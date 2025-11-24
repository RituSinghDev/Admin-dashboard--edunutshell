"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { verificationAPI } from "@/lib/api";
import { UserCheck, Search, CheckCircle, XCircle, Clock, Mail } from "lucide-react";
import { useDebounce } from "@/lib/hooks";

interface Verification {
  _id: string;
  studentName: string;
  studentEmail: string;
  phone: string;
  program: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  documents?: string[];
  notes?: string;
}

const PROGRAMS = ["All", "CSE/IT", "ECE/EEE", "Mechanical", "Agriculture", "Management", "Medical"];

export default function VerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchVerifications = useCallback(async () => {
    try {
      const response = await verificationAPI.getAll();
      setVerifications(response.data);
    } catch (error) {
      console.error("Error fetching verifications:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Wait for localStorage to be available (client-side only)
    const timer = setTimeout(() => {
      fetchVerifications();
    }, 0);
    
    return () => clearTimeout(timer);
  }, [fetchVerifications]);

  const handleApprove = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to approve this student?")) return;

    try {
      await verificationAPI.approve(id);
      setVerifications(prev => 
        prev.map(v => v._id === id ? { ...v, status: "approved" as const } : v)
      );
      alert("Student approved! Confirmation email sent.");
    } catch (error) {
      console.error("Error approving verification:", error);
      alert("Failed to approve student");
    }
  }, []);

  const handleReject = useCallback(async (id: string) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      await verificationAPI.reject(id, reason);
      setVerifications(prev => 
        prev.map(v => v._id === id ? { ...v, status: "rejected" as const } : v)
      );
      alert("Student rejected. Notification email sent.");
    } catch (error) {
      console.error("Error rejecting verification:", error);
      alert("Failed to reject student");
    }
  }, []);

  const filteredVerifications = useMemo(() => {
    return verifications.filter((verification) => {
      const matchesSearch = !debouncedSearch || 
        verification.studentName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        verification.studentEmail.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesProgram = selectedProgram === "All" || verification.program === selectedProgram;
      const matchesStatus = statusFilter === "all" || verification.status === statusFilter;

      return matchesSearch && matchesProgram && matchesStatus;
    });
  }, [verifications, debouncedSearch, selectedProgram, statusFilter]);

  const pendingCount = verifications.filter(v => v.status === "pending").length;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck size={32} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Student Verifications</h1>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Review and approve new student registrations
          </p>
        </div>
        
        {pendingCount > 0 && (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg">
            <div className="text-xs font-semibold mb-1">Pending Verifications</div>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by student name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap gap-4">
            {/* Status Filter */}
            <div className="flex gap-2">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as typeof statusFilter)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    statusFilter === status
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Program Filter */}
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {PROGRAMS.map((program) => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Verifications List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-3 w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredVerifications.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <UserCheck size={48} className="mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No verifications found</h3>
          <p className="text-gray-600 text-sm">
            {verifications.length === 0 
              ? "No verification requests yet" 
              : "Try adjusting your search or filter criteria"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredVerifications.map((verification) => (
            <div
              key={verification._id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {verification.studentName}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail size={14} />
                          <span>{verification.studentEmail}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📱</span>
                          <span>{verification.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {verification.status === "pending" && (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Clock size={12} />
                          Pending
                        </span>
                      )}
                      {verification.status === "approved" && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <CheckCircle size={12} />
                          Approved
                        </span>
                      )}
                      {verification.status === "rejected" && (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <XCircle size={12} />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {verification.program}
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Requested: {new Date(verification.requestDate).toLocaleDateString()}
                    </div>
                  </div>

                  {verification.documents && verification.documents.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <span className="font-semibold text-blue-900 text-sm">Documents: </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {verification.documents.map((doc, index) => (
                          <a
                            key={index}
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-200 hover:border-blue-400 transition-all flex items-center gap-1"
                          >
                            📄 Document {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {verification.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                      <span className="font-semibold">Notes: </span>
                      {verification.notes}
                    </div>
                  )}
                </div>

                {verification.status === "pending" && (
                  <div className="flex gap-3 lg:flex-col">
                    <button
                      onClick={() => handleApprove(verification._id)}
                      className="flex-1 lg:flex-none bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(verification._id)}
                      className="flex-1 lg:flex-none bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
