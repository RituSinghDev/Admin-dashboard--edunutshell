"use client";

import { useEffect, useState } from "react";
import { getUser, setUser as saveUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { userAPI } from "@/lib/api";
import { 
  User, 
  Mail, 
  Target, 
  CheckCircle, 
  IdCard, 
  Calendar, 
  RefreshCw, 
  Edit, 
  Lock, 
  Settings 
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const localUser = getUser();
      if (!localUser) {
        router.push("/login");
        return;
      }

      try {
        // Try to fetch fresh user data from API
        const response = await userAPI.getProfile();
        const apiUser = response.data.user || response.data;
        setUser(apiUser);
        // Update local storage with fresh data
        saveUser(apiUser);
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        // Fallback to local storage data
        setUser(localUser);
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          setTimeout(() => router.push("/login"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="bg-white rounded-xl p-8 shadow-sm animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <User size={32} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Admin Profile
        </h1>
        <p className="text-gray-600 text-sm">
          Manage your account information and settings
        </p>
      </div>

      {/* Profile Card with Banner */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6 hover:shadow-lg transition-all duration-300">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        {/* Profile Content */}
        <div className="p-6 -mt-16">
          {/* Avatar and Name */}
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl border-4 border-white">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex-1 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {user?.name}
              </h2>
              <p className="text-blue-600 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Name Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <User size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block font-semibold">
                Full Name
              </label>
              <p className="text-gray-900 font-semibold text-lg">{user?.name}</p>
            </div>
          </div>
        </div>

        {/* Email Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Mail size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block font-semibold">
                Email Address
              </label>
              <p className="text-gray-900 font-semibold text-lg break-all">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Role Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Target size={20} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block font-semibold">
                Role
              </label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white capitalize">
                {user?.role || "Administrator"}
              </span>
            </div>
          </div>
        </div>

        {/* Account Status Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block font-semibold">
                Account Status
              </label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* User ID Card */}
        {user?._id && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group md:col-span-2">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <IdCard size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block font-semibold">
                  User ID
                </label>
                <p className="text-gray-900 font-mono text-sm break-all">{user._id}</p>
              </div>
            </div>
          </div>
        )}

        {/* Created At Card */}
        {user?.createdAt && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar size={20} className="text-pink-600" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block font-semibold">
                  Member Since
                </label>
                <p className="text-gray-900 font-semibold text-lg">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Last Updated Card */}
        {user?.updatedAt && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <RefreshCw size={20} className="text-cyan-600" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 uppercase tracking-wide mb-1 block font-semibold">
                  Last Updated
                </label>
                <p className="text-gray-900 font-semibold text-lg">
                  {new Date(user.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 group">
            <Edit size={18} className="group-hover:scale-110 transition-transform" />
            <span>Edit Profile</span>
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 border border-gray-300 hover:border-gray-400 flex items-center gap-2 group">
            <Lock size={18} className="group-hover:scale-110 transition-transform" />
            <span>Change Password</span>
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 border border-gray-300 hover:border-gray-400 flex items-center gap-2 group">
            <Settings size={18} className="group-hover:scale-110 transition-transform" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
