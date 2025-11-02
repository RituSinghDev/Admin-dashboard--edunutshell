"use client";

import { useState, useEffect } from "react";
import { testimonialAPI } from "@/lib/api";

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

interface TestimonialModalProps {
  testimonial: Testimonial | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TestimonialModal({
  testimonial,
  onClose,
  onSuccess,
}: TestimonialModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    photoURL: "",
    socialHandle: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name,
        message: testimonial.message,
        photoURL: testimonial.photoURL,
        socialHandle: testimonial.socialHandle,
      });
    }
  }, [testimonial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (testimonial) {
        await testimonialAPI.update(testimonial._id, formData);
      } else {
        await testimonialAPI.create(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      alert("Failed to save testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-t-xl">
          <h2 className="text-2xl font-bold">
            {testimonial ? "Edit Testimonial" : "Add New Testimonial"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Photo URL
            </label>
            <input
              type="url"
              value={formData.photoURL}
              onChange={(e) =>
                setFormData({ ...formData, photoURL: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Social Handle (URL)
            </label>
            <input
              type="url"
              value={formData.socialHandle}
              onChange={(e) =>
                setFormData({ ...formData, socialHandle: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/username"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : testimonial ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
