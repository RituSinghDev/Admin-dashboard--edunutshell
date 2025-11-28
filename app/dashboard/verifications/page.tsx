"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { verificationAPI } from "@/lib/api";
import { UserCheck, Search, CheckCircle, XCircle, Clock, Mail } from "lucide-react";
import { useDebounce } from "@/lib/hooks";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  eligibilityStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface LookupResult {
  _id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  eligibilityStatus: string;
}

const PROGRAMS = ["All", "CSE/IT", "ECE/EEE", "Mechanical", "Agriculture", "Management", "Medical"];

export default function VerificationsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("All");
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupPhone, setLookupPhone] = useState("");
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [showLookup, setShowLookup] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await verificationAPI.getPendingStudents();
      setStudents(response.data.students || []);
    } catch (error) {
      console.error("Error fetching pending students:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Wait for localStorage to be available (client-side only)
    const timer = setTimeout(() => {
      fetchStudents();
    }, 0);
    
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleLookup = useCallback(async () => {
    if (!lookupEmail && !lookupPhone) {
      alert("Please enter email or phone number");
      return;
    }

    setLookupLoading(true);
    setLookupResult(null);
    
    try {
      const response = await verificationAPI.lookupStudent(lookupEmail, lookupPhone);
      setLookupResult(response.data);
    } catch (error: any) {
      console.error("Error looking up student:", error);
      alert(error.response?.data?.message || "Student not found");
    } finally {
      setLookupLoading(false);
    }
  }, [lookupEmail, lookupPhone]);

  const handleApprove = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to approve this student?")) return;

    try {
      await verificationAPI.approve(id);
      // Refresh the list
      fetchStudents();
      alert("Student approved! Confirmation email sent.");
    } catch (error) {
      console.error("Error approving verification:", error);
      alert("Failed to approve student");
    }
  }, [fetchStudents]);

  const handleReject = useCallback(async (id: string) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      await verificationAPI.reject(id, reason);
      // Refresh the list
      fetchStudents();
      alert("Student rejected. Notification email sent.");
    } catch (error) {
      console.error("Error rejecting verification:", error);
      alert("Failed to reject student");
    }
  }, [fetchStudents]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = !debouncedSearch || 
        student.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        student.phone.includes(debouncedSearch);
      
      const matchesProgram = selectedProgram === "All" || student.program === selectedProgram;

      return matchesSearch && matchesProgram;
    });
  }, [students, debouncedSearch, selectedProgram]);

  const pendingCount = students.length;

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
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
            <div className="text-xs font-semibold mb-1">Pending Verifications</div>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </div>
        )}
      </div>

      {/* Filters and Lookup Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by student name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap gap-4 items-center">
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

            {/* Lookup Button */}
            <button
              onClick={() => setShowLookup(!showLookup)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md"
            >
              {showLookup ? "Hide Lookup" : "Student Lookup"}
            </button>
          </div>

          {/* Lookup Form */}
          {showLookup && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-3">Lookup Student</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={lookupEmail}
                  onChange={(e) => setLookupEmail(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={handleLookup}
                  disabled={lookupLoading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md disabled:opacity-50"
                >
                  {lookupLoading ? "Searching..." : "Search"}
                </button>
              </div>

              {/* Lookup Result */}
              {lookupResult && (
                <div className="mt-4 bg-white rounded-lg p-4 border border-blue-300">
                  <h4 className="font-bold text-gray-900 mb-2">Student Found:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div><span className="font-semibold">Name:</span> {lookupResult.name}</div>
                    <div><span className="font-semibold">Email:</span> {lookupResult.email}</div>
                    <div><span className="font-semibold">Phone:</span> {lookupResult.phone}</div>
                    <div><span className="font-semibold">Program:</span> {lookupResult.program}</div>
                    <div className="sm:col-span-2">
                      <span className="font-semibold">Status:</span>{" "}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        lookupResult.eligibilityStatus === "PENDING" 
                          ? "bg-yellow-100 text-yellow-700"
                          : lookupResult.eligibilityStatus === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {lookupResult.eligibilityStatus}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pending Students List */}
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
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <UserCheck size={48} className="mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No pending students found</h3>
          <p className="text-gray-600 text-sm">
            {students.length === 0 
              ? "No pending verification requests" 
              : "Try adjusting your search or filter criteria"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {student.name}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail size={14} />
                          <span>{student.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📱</span>
                          <span>{student.phone}</span>
                        </div>
                      </div>
                    </div>
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Clock size={12} />
                      {student.eligibilityStatus}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3">
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {student.program}
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Registered: {new Date(student.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 lg:flex-col">
                  <button
                    onClick={() => handleApprove(student._id)}
                    className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(student._id)}
                    className="flex-1 lg:flex-none bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
