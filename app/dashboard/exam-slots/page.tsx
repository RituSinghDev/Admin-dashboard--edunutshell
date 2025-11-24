"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { examSlotAPI } from "@/lib/api";
import { Calendar, Users, Search, Filter, CheckCircle, Clock, XCircle } from "lucide-react";
import { useDebounce } from "@/lib/hooks";

interface ExamSlot {
  _id: string;
  studentName: string;
  studentEmail: string;
  program: string;
  slotDate: string;
  slotTime: string;
  paymentStatus: "pending" | "completed" | "failed";
  registrationStatus: "existing" | "new";
  verificationStatus?: "pending" | "approved" | "rejected";
  bookingDate: string;
}

const PROGRAMS = ["All", "CSE/IT", "ECE/EEE", "Mechanical", "Agriculture", "Management", "Medical"];
const PAYMENT_STATUS = ["All", "pending", "completed", "failed"];

export default function ExamSlotsPage() {
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchSlots = useCallback(async () => {
    try {
      const response = await examSlotAPI.getAll();
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching exam slots:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Wait for localStorage to be available (client-side only)
    const timer = setTimeout(() => {
      fetchSlots();
    }, 0);
    
    return () => clearTimeout(timer);
  }, [fetchSlots]);

  const dailySlotCount = useMemo(() => {
    const dateToCheck = selectedDate || new Date().toISOString().split('T')[0];
    return slots.filter(slot => slot.slotDate === dateToCheck).length;
  }, [slots, selectedDate]);

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      const matchesSearch = !debouncedSearch || 
        slot.studentName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        slot.studentEmail.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const matchesProgram = selectedProgram === "All" || slot.program === selectedProgram;
      const matchesPayment = selectedPaymentStatus === "All" || slot.paymentStatus === selectedPaymentStatus;
      const matchesDate = !selectedDate || slot.slotDate === selectedDate;

      return matchesSearch && matchesProgram && matchesPayment && matchesDate;
    });
  }, [slots, debouncedSearch, selectedProgram, selectedPaymentStatus, selectedDate]);

  const getStatusBadge = (status: string, type: "payment" | "verification") => {
    const styles = {
      payment: {
        completed: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        failed: "bg-red-100 text-red-700"
      },
      verification: {
        approved: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        rejected: "bg-red-100 text-red-700"
      }
    };

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[type][status as keyof typeof styles[typeof type]]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Calendar size={32} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Exam Slots</h1>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Manage exam slot bookings and track daily limits
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="text-xs font-semibold mb-1">
            {selectedDate ? `Slot Usage (${selectedDate})` : "Today's Slot Usage"}
          </div>
          <div className="text-2xl font-bold">
            {dailySlotCount} / 150
          </div>
          <div className="text-xs mt-1">
            {150 - dailySlotCount} slots remaining
          </div>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Program Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Program</label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {PROGRAMS.map((program) => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Status</label>
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {PAYMENT_STATUS.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Slots Table */}
      {loading ? (
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <Calendar size={48} className="mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No exam slots found</h3>
          <p className="text-gray-600 text-sm">
            {slots.length === 0 
              ? "No bookings have been made yet" 
              : "Try adjusting your search or filter criteria"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Slot Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSlots.map((slot) => (
                  <tr key={slot._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        #{slot._id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-gray-900">{slot.studentName}</div>
                        <div className="text-sm text-gray-600">{slot.studentEmail}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {slot.registrationStatus === "existing" ? (
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Existing Student</span>
                          ) : (
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">New Student</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {slot.program}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Calendar size={16} className="text-blue-600" />
                        <span className="font-semibold">{slot.slotDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                        <Clock size={14} />
                        <span>{slot.slotTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(slot.paymentStatus, "payment")}
                    </td>
                    <td className="px-6 py-4">
                      {slot.registrationStatus === "new" && slot.verificationStatus ? (
                        getStatusBadge(slot.verificationStatus, "verification")
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
