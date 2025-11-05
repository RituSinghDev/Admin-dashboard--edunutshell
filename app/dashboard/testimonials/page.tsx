"use client";

import { useEffect, useState } from "react";
import { testimonialAPI } from "@/lib/api";
import TestimonialModal from "@/components/TestimonialModal";
import { MessageSquare, Plus, Star } from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  message: string;
  photoURL: string;
  socialHandle: string;
  published: boolean;
  createdAt: string;
  __v?: number;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const fetchTestimonials = async () => {
    try {
      const response = await testimonialAPI.getAll();
      console.log("API Response:", response.data);
      
      // Handle different response structures
      const data = response.data.testimonials || response.data.data || response.data || [];
      console.log("Testimonials data:", data);
      
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      await testimonialAPI.delete(id);
      setTestimonials(testimonials.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Failed to delete testimonial");
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
    setShowModal(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare size={32} className="text-amber-600" />
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Testimonials
          </h1>
          <p className="text-gray-600 text-sm">
            Manage student feedback and success stories
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 shadow-sm animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <Star size={48} className="mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No testimonials yet
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Start collecting feedback by adding your first testimonial
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Note: Backend API endpoint /api/testimonials needs to be configured
          </p>
          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Add Testimonial
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial._id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                {testimonial.photoURL && (
                  <div className="md:w-24 flex-shrink-0">
                    <img
                      src={testimonial.photoURL}
                      alt={testimonial.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 group-hover:border-blue-200 transition-all"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/150?text=User";
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {testimonial.name}
                      </h3>
                      {testimonial.socialHandle && (
                        <a
                          href={testimonial.socialHandle}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {testimonial.socialHandle}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          testimonial.published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {testimonial.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4 italic">
                    "{testimonial.message}"
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-red-200 hover:border-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TestimonialModal
          testimonial={editingTestimonial}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchTestimonials();
          }}
        />
      )}
    </div>
  );
}
