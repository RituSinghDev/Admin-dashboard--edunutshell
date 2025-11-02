"use client";

import { useEffect, useState } from "react";
import { courseAPI, blogAPI, testimonialAPI } from "@/lib/api";
import { getUser } from "@/lib/auth";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    courses: 0,
    blogs: 0,
    testimonials: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);

    const fetchStats = async () => {
      try {
        const [coursesRes, blogsRes, testimonialsRes] = await Promise.allSettled([
          courseAPI.getAll(),
          blogAPI.getAll(),
          testimonialAPI.getAll(),
        ]);

        setStats({
          courses: coursesRes.status === 'fulfilled' ? (Array.isArray(coursesRes.value.data) ? coursesRes.value.data.length : 0) : 0,
          blogs: blogsRes.status === 'fulfilled' ? (Array.isArray(blogsRes.value.data) ? blogsRes.value.data.length : 0) : 0,
          testimonials: testimonialsRes.status === 'fulfilled' ? (Array.isArray(testimonialsRes.value.data?.testimonials) ? testimonialsRes.value.data.testimonials.length : 0) : 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Calculate progress percentage (max 20 items = 100%)
  const calculateProgress = (value: number) => {
    const maxValue = 20;
    const percentage = Math.min((value / maxValue) * 100, 100);
    return percentage;
  };

  const statCards = [
    {
      label: "Total Courses",
      value: stats.courses,
      icon: "🎓",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
      progress: calculateProgress(stats.courses),
    },
    {
      label: "Total Blogs",
      value: stats.blogs,
      icon: "📝",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      iconBg: "bg-purple-100",
      textColor: "text-purple-600",
      progress: calculateProgress(stats.blogs),
    },
    {
      label: "Testimonials",
      value: stats.testimonials,
      icon: "💬",
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-100",
      iconBg: "bg-amber-100",
      textColor: "text-amber-600",
      progress: calculateProgress(stats.testimonials),
    },
  ];

  const quickActions = [
    {
      title: "Add New Course",
      description: "Create a new course for students",
      icon: "➕",
      link: "/dashboard/courses",
      color: "blue",
    },
    {
      title: "Write Blog Post",
      description: "Share knowledge with your audience",
      icon: "✍️",
      link: "/dashboard/blogs",
      color: "purple",
    },
    {
      title: "Add Testimonial",
      description: "Share student success stories",
      icon: "💬",
      link: "/dashboard/testimonials",
      color: "amber",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-8 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name || 'Admin'}! 👋
            </h1>
            <div className="flex flex-col gap-1 text-blue-100">
              <p className="flex items-center gap-2">
                <span className="text-lg">📧</span>
                <span className="font-medium">{user?.email || 'N/A'}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lg">👤</span>
                <span className="font-medium capitalize">Role: {user?.role || 'Admin'}</span>
              </p>
            </div>
          </div>
          <div className="hidden md:block text-6xl">
            🎓
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 shadow-sm animate-pulse"
            >
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`${stat.iconBg} w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}
                >
                  {stat.icon}
                </div>
              </div>
              <h3
                className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}
              >
                {stat.value}
              </h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000`}
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <a
              key={action.title}
              href={action.link}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {action.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {action.title}
              </h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
