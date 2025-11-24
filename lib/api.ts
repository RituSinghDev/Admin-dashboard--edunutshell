import axios from "axios";

const BASE_URL = "https://edunutshell-lms.onrender.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server may be sleeping');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (name: string, email: string, password: string, role: string) =>
    api.post("/auth/register", { name, email, password, role }),
  createAdmin: (name: string, email: string, password: string) =>
    api.post("/auth/create-admin", { name, email, password }),
  logout: () => api.post("/auth/logout"),
};

export const courseAPI = {
  getAll: () => api.get("/courses/list"),
  create: (data: any) => api.post("/courses/add", data),
  update: (id: string, data: any) => api.put(`/courses/edit/${id}`, data),
  delete: (id: string) => api.delete(`/courses/delete/${id}`),
};

export const blogAPI = {
  getAll: () => api.get("/blogs"),
  create: (data: any) => api.post("/blogs", data),
  update: (id: string, data: any) => api.patch(`/blogs/${id}`, data),
  delete: (id: string) => api.delete(`/blogs/${id}`),
};

export const testimonialAPI = {
  getAll: () => api.get("/testimonials/"),
  create: (data: any) => api.post("/testimonials/", data),
  update: (id: string, data: any) => api.patch(`/testimonials/${id}`, data),
  delete: (id: string) => api.delete(`/testimonials/delete/${id}`),
};

export const feedbackAPI = {
  getByCourse: (courseId: string) => api.get(`/feedback/course/${courseId}`),
};

export const userAPI = {
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data: any) => api.patch("/auth/profile", data),
};

export const enquiryAPI = {
  getAll: () =>
    axios.get("https://sheetdb.io/api/v1/32r64i5cxdi2x", {
      headers: {
        Authorization: "Bearer 5t3ohqc39zlaw7wnqolvywww6xzp610dvsgadmqv",
      },
    }),
  delete: (email: string) =>
    axios.delete(`https://sheetdb.io/api/v1/32r64i5cxdi2x/email/${email}`, {
      headers: {
        Authorization: "Bearer 5t3ohqc39zlaw7wnqolvywww6xzp610dvsgadmqv",
      },
    }),
};

export const supportAPI = {
  getAll: () =>
    axios.get("https://sheetdb.io/api/v1/th56i1hfrga3o", {
      headers: {
        Authorization: "Bearer 145d1174qu29789m7p23l01fr2juriqaj3l5qezz",
      },
    }),
  delete: (email: string) =>
    axios.delete(`https://sheetdb.io/api/v1/th56i1hfrga3o/email/${email}`, {
      headers: {
        Authorization: "Bearer 145d1174qu29789m7p23l01fr2juriqaj3l5qezz",
      },
    }),
};

export const examSlotAPI = {
  getAll: () => api.get("/exam-slots"),
  getByDate: (date: string) => api.get(`/exam-slots/date/${date}`),
  create: (data: any) => api.post("/exam-slots", data),
  update: (id: string, data: any) => api.patch(`/exam-slots/${id}`, data),
  delete: (id: string) => api.delete(`/exam-slots/${id}`),
};

export const verificationAPI = {
  getAll: () => api.get("/verifications"),
  approve: (id: string) => api.post(`/verifications/${id}/approve`),
  reject: (id: string, reason: string) => api.post(`/verifications/${id}/reject`, { reason }),
};
