"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { blogAPI } from "@/lib/api";
import dynamic from "next/dynamic";
import { FileText, Plus, PenLine, Calendar, Search } from "lucide-react";
import { useDebounce } from "@/lib/hooks";

const BlogModal = dynamic(() => import("@/components/BlogModal"), {
  ssr: false,
});

interface Blog {
  _id: string;
  title: string;
  body: string;
  image: string;
  tags: string[];
  eventDate: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await blogAPI.getAll();
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await blogAPI.delete(id);
      setBlogs(prev => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    }
  }, []);

  const handleEdit = useCallback((blog: Blog) => {
    setEditingBlog(blog);
    setShowModal(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditingBlog(null);
    setShowModal(true);
  }, []);

  // Memoized filter and sort with debounced search
  const filteredAndSortedBlogs = useMemo(() => {
    return blogs
      .filter((blog) => {
        if (!debouncedSearch) return true;
        const searchLower = debouncedSearch.toLowerCase();
        return (
          blog.title.toLowerCase().includes(searchLower) ||
          blog.body.toLowerCase().includes(searchLower) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.eventDate).getTime();
        const dateB = new Date(b.eventDate).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [blogs, debouncedSearch, sortOrder]);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FileText size={32} className="text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Blogs
          </h1>
          <p className="text-gray-600 text-sm">
            Share insights and knowledge with your community
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Add Blog</span>
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search blogs by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="sm:w-48">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
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
      ) : filteredAndSortedBlogs.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <PenLine size={48} className="mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {blogs.length === 0 ? "No blogs yet" : "No blogs found"}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {blogs.length === 0
              ? "Start sharing your knowledge by creating your first blog post"
              : "Try adjusting your search or filter criteria"}
          </p>
          {blogs.length === 0 && (
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Write Blog
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedBlogs.map((blog, index) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                {blog.image && (
                  <div className="md:w-48 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-32 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/400x250?text=Blog+Image";
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {blog.body}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {blog.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {blog.eventDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={14} />
                        <span>
                          {new Date(blog.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
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
        <BlogModal
          blog={editingBlog}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchBlogs();
          }}
        />
      )}
    </div>
  );
}
