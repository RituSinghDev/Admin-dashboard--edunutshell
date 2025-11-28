"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { examSlotAPI, examAPI, slotAPI } from "@/lib/api";
import { Calendar, Clock, Plus, X } from "lucide-react";
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

interface Exam {
  _id: string;
  title: string;
  description: string;
  price: number;
  totalSlotsPerDay: number;
  createdAt: string;
  updatedAt: string;
}

interface Slot {
  _id: string;
  exam: string;
  date: string;
  bookedCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function ExamSlotsPage() {
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examSlots, setExamSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<string>("");
  
  // Modal states
  const [showExamModal, setShowExamModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  
  // Form states
  const [examForm, setExamForm] = useState({
    title: "",
    description: "",
    price: "",
    totalSlotsPerDay: "150"
  });
  
  const [slotForm, setSlotForm] = useState({
    examId: "",
    date: ""
  });

  const fetchExams = useCallback(async () => {
    try {
      const response = await examAPI.getAll();
      setExams(response.data.exams || []);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  }, []);

  const fetchSlotsByExam = useCallback(async (examId: string) => {
    try {
      const response = await slotAPI.getByExam(examId);
      setExamSlots(response.data.slots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setExamSlots([]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExams();
      setLoading(false);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [fetchExams]);

  useEffect(() => {
    if (selectedExam) {
      fetchSlotsByExam(selectedExam);
    } else {
      setExamSlots([]);
    }
  }, [selectedExam, fetchSlotsByExam]);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await examAPI.create({
        title: examForm.title,
        description: examForm.description,
        price: Number(examForm.price),
        totalSlotsPerDay: Number(examForm.totalSlotsPerDay)
      });
      setShowExamModal(false);
      setExamForm({ title: "", description: "", price: "", totalSlotsPerDay: "150" });
      fetchExams();
      alert("Exam created successfully!");
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("Failed to create exam");
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await slotAPI.create({
        examId: slotForm.examId,
        date: slotForm.date
      });
      setShowSlotModal(false);
      setSlotForm({ examId: "", date: "" });
      if (selectedExam) {
        fetchSlotsByExam(selectedExam);
      }
      alert("Slot created successfully!");
    } catch (error) {
      console.error("Error creating slot:", error);
      alert("Failed to create slot");
    }
  };

  const selectedExamDetails = useMemo(() => {
    return exams.find(exam => exam._id === selectedExam);
  }, [exams, selectedExam]);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Calendar size={32} className="text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Exam Slots Management</h1>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            Create exams and manage exam slots
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowExamModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Create Exam
          </button>
          <button
            onClick={() => setShowSlotModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Create Slot
          </button>
        </div>
      </div>

      {/* Exam Selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Exam to View Slots</label>
        <select
          value={selectedExam}
          onChange={(e) => setSelectedExam(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="">-- Select an Exam --</option>
          {exams.map((exam) => (
            <option key={exam._id} value={exam._id}>
              {exam.title} - ₹{exam.price} ({exam.totalSlotsPerDay} slots/day)
            </option>
          ))}
        </select>
      </div>

      {/* Exam Details */}
      {selectedExamDetails && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedExamDetails.title}</h2>
          <p className="text-gray-700 mb-3">{selectedExamDetails.description}</p>
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-gray-600">Price:</span>
              <span className="font-semibold text-gray-900 ml-2">₹{selectedExamDetails.price}</span>
            </div>
            <div>
              <span className="text-gray-600">Slots per Day:</span>
              <span className="font-semibold text-gray-900 ml-2">{selectedExamDetails.totalSlotsPerDay}</span>
            </div>
          </div>
        </div>
      )}

      {/* Slots List */}
      {loading ? (
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : !selectedExam ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <Calendar size={48} className="mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Exam Selected</h3>
          <p className="text-gray-600 text-sm">
            Please select an exam to view its slots
          </p>
        </div>
      ) : examSlots.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <Calendar size={48} className="mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Slots Found</h3>
          <p className="text-gray-600 text-sm">
            No slots have been created for this exam yet
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Slot ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Booked Count
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {examSlots.map((slot) => (
                  <tr key={slot._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        #{slot._id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Calendar size={16} className="text-blue-600" />
                        <span className="font-semibold">
                          {new Date(slot.date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {slot.bookedCount}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {selectedExamDetails ? selectedExamDetails.totalSlotsPerDay - slot.bookedCount : 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(slot.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Create New Exam</h2>
              <button
                onClick={() => setShowExamModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., 12th pyqs"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  value={examForm.description}
                  onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., full length paper"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={examForm.price}
                  onChange={(e) => setExamForm({ ...examForm, price: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., 129"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Slots Per Day</label>
                <input
                  type="number"
                  required
                  value={examForm.totalSlotsPerDay}
                  onChange={(e) => setExamForm({ ...examForm, totalSlotsPerDay: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., 150"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all"
                >
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Slot Modal */}
      {showSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Create New Slot</h2>
              <button
                onClick={() => setShowSlotModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Exam</label>
                <select
                  required
                  value={slotForm.examId}
                  onChange={(e) => setSlotForm({ ...slotForm, examId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">-- Select an Exam --</option>
                  {exams.map((exam) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={slotForm.date}
                  onChange={(e) => setSlotForm({ ...slotForm, date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSlotModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:shadow-lg transition-all"
                >
                  Create Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
