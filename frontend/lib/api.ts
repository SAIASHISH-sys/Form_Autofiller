const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ access_token: string; token_type: string }>("/auth/login/token", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (data: { email: string; password: string; full_name?: string }) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    googleLogin: (id_token: string) =>
      request<{ access_token: string; token_type: string }>("/auth/login/google", {
        method: "POST",
        body: JSON.stringify({ id_token }),
      }),
    me: () => request<{ id: string; email: string; full_name: string }>("/auth/me"),
  },
  profiles: {
    getByUser: (userId: string) =>
      request<
        {
          id: string;
          user_id: string;
          full_name: string;
          roll_no: string;
          college: string;
          dob: string;
          mobile_no: string;
          email: string;
          interests: string[];
          id_default: boolean;
        }[]
      >(`/profile/${userId}`),
    save: (profileId: string, data: Record<string, unknown>) =>
      request(`/profile/${profileId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    create: (userId: string, data: Record<string, unknown>) =>
      request(`/profile/${userId}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    delete: (profileId: string) =>
      request(`/profile/${profileId}`, {
        method: "DELETE",
      }),
    setDefault: (profileId: string) =>
      request(`/profile/${profileId}/set-default`, {
        method: "PATCH",
      }),
  },
  resumes: {
    get: () => request("/resumes"),
    upload: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return request("/resumes/upload", {
        method: "POST",
        body: formData,
        headers: {},
      });
    },
  },
};