"use client";

import { useEffect, useState } from "react";
import { blogAPI } from "@/lib/api";
import BlogModal from "@/components/BlogModal";

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

  const fetchBlogs = async () => {
    try {
      const response = await blogAPI.getAll();
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      await blogAPI.delete(id);
      setBlogs(blogs.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingBlog(null);
    setShowModal(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Blogs 📝
          </h1>
          <p className="text-gray-600 text-sm">
            Share insights and knowledge with your community
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 group"
        >
          <span className="text-lg group-hover:rotate-90 transition-transform duration-300">
            +
          </span>
          <span>Add Blog</span>
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
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="text-5xl mb-3">✍️</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No blogs yet
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Start sharing your knowledge by creating your first blog post
          </p>
          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Write Blog
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog, index) => (
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
                        <span>📅</span>
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
