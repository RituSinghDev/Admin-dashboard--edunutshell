"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { enquiryAPI, supportAPI } from "@/lib/api";

interface Enquiry {
  full_name: string;
  email: string;
  phone: string;
  program: string;
  college: string;
  message: string;
}

interface SupportForm {
  full_name: string;
  email: string;
  phone: string;
  message: string;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [supportForms, setSupportForms] = useState<SupportForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"enquiries" | "support">("enquiries");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [enquiriesRes, supportRes] = await Promise.all([
        enquiryAPI.getAll(),
        supportAPI.getAll(),
      ]);
      setEnquiries(enquiriesRes.data);
      setSupportForms(supportRes.data);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteEnquiry = async (email: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    
    try {
      setDeleting(email);
      await enquiryAPI.delete(email);
      setEnquiries(enquiries.filter((e) => e.email !== email));
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete enquiry");
      console.error("Error deleting enquiry:", err);
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteSupport = async (email: string) => {
    if (!confirm("Are you sure you want to delete this support request?")) return;
    
    try {
      setDeleting(email);
      await supportAPI.delete(email);
      setSupportForms(supportForms.filter((s) => s.email !== email));
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete support request");
      console.error("Error deleting support request:", err);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Enquiries & Support</h1>
        <p className="text-gray-600 mt-2">
          Manage and view all student enquiries and support requests
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("enquiries")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "enquiries"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Student Enquiries ({enquiries.length})
        </button>
        <button
          onClick={() => setActiveTab("support")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "support"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Support Requests ({supportForms.length})
        </button>
      </div>

      {/* Student Enquiries Table */}
      {activeTab === "enquiries" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    College
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enquiries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No enquiries found
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enquiry, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {enquiry.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {enquiry.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {enquiry.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {enquiry.program}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {enquiry.college || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {enquiry.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteEnquiry(enquiry.email)}
                          disabled={deleting === enquiry.email}
                          className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleting === enquiry.email ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Support Requests Table */}
      {activeTab === "support" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {supportForms.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No support requests found
                    </td>
                  </tr>
                ) : (
                  supportForms.map((support, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {support.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {support.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {support.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {support.message}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteSupport(support.email)}
                          disabled={deleting === support.email}
                          className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleting === support.email ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
