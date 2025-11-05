"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { removeToken, removeUser, getUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Mail, 
  LogOut 
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Courses", path: "/dashboard/courses", icon: BookOpen },
  { name: "Blogs", path: "/dashboard/blogs", icon: FileText },
  { name: "Testimonials", path: "/dashboard/testimonials", icon: MessageSquare },
  { name: "Enquiries", path: "/dashboard/enquiries", icon: Mail },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    removeToken();
    removeUser();
    router.push("/login");
  };

  return (
    <div className="w-64 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white min-h-screen h-screen sticky top-0 p-5 flex flex-col shadow-xl overflow-y-auto">
      {/* Logo Section */}
      <div className="mb-6">
        <Image 
          src="/edunutshelllogo.png" 
          alt="EduNutshell" 
          width={200}
          height={100}
          className="h-19 w-30"
        />
        {/* <p className="text-xs text-blue-300 mt-0.5">Admin Dashboard</p> */}
      </div>

      {/* User Profile */}
      {user && (
        <Link href="/dashboard/profile">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 mb-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
                {user.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate text-sm">
                  {user.name}
                </p>
                <p className="text-xs text-blue-300 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <IconComponent
                size={20}
                className={`transition-transform duration-300 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              />
              <span className="font-medium text-sm">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="pt-5 border-t border-white/10 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <LogOut
            size={18}
            className="relative group-hover:rotate-12 transition-transform duration-300"
          />
          <span className="relative text-sm font-bold tracking-wide">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}
