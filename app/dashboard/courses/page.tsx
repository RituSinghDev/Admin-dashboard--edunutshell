"use client";

import { useEffect, useState } from "react";
import { courseAPI } from "@/lib/api";
import CourseModal from "@/components/CourseModal";
import { BookOpen, Plus, Trash2, Search } from "lucide-react";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  level: string;
  category?: string;
}

const CATEGORIES = [
  "All",
  "CSE/IT",
  "ECE/EEE",
  "Mechanical",
  "Agriculture",
  "Management",
  "Medical",
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await courseAPI.delete(id);
      setCourses(courses.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course");
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingCourse(null);
    setShowModal(true);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <BookOpen size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Courses
          </h1>
          <p className="text-gray-600 text-sm">
            Manage and organize your educational content
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 shadow-sm animate-pulse"
            >
              <div className="h-40 bg-gray-200 rounded mb-3"></div>
              <div className="h-5 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <BookOpen size={48} className="mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {courses.length === 0 ? "No courses yet" : "No courses found"}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {courses.length === 0
              ? "Get started by creating your first course"
              : "Try adjusting your search or filter criteria"}
          </p>
          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Create Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course, index) => (
            <div
              key={course._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative overflow-hidden h-40">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x250?text=Course+Image";
                  }}
                />
              </div>
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {course.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ₹{course.price}
                  </span>
                  {course.level && (
                    <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                      {course.level}
                    </span>
                  )}
                </div>
                {course.category && (
                  <div className="mb-3">
                    <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                      {course.category}
                    </span>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all border border-red-200 hover:border-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <CourseModal
          course={editingCourse}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchCourses();
          }}
        />
      )}
    </div>
  );
}
