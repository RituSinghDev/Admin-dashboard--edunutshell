import axios from "axios";

const BASE_URL = "https://edunutshell-lms.onrender.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  update: async (id: string, data: any) => {
    console.log("Updating course:", id, "with data:", data);
    
    // Try multiple endpoint variations
    const endpoints = [
      { method: "patch", url: `/courses/${id}` },
      { method: "put", url: `/courses/${id}` },
      { method: "patch", url: `/courses/update/${id}` },
      { method: "put", url: `/courses/update/${id}` },
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying ${endpoint.method.toUpperCase()} ${endpoint.url}`);
        if (endpoint.method === "patch") {
          return await api.patch(endpoint.url, data);
        } else {
          return await api.put(endpoint.url, data);
        }
      } catch (err: any) {
        console.log(`Failed: ${err.response?.status || err.message}`);
        continue;
      }
    }
    
    throw new Error("Course update endpoint not available. Please contact the backend team.");
  },
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
  delete: (id: string) => api.delete(`/testimonials/${id}`),
};

export const feedbackAPI = {
  getByCourse: (courseId: string) => api.get(`/feedback/course/${courseId}`),
};

export const userAPI = {
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data: any) => api.patch("/auth/profile", data),
};
