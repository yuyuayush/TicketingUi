// API service layer for connecting frontend to backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T = any> {
    message?: string;
    token?: string;
    user?: any;
    data?: T;
    [key: string]: any;
}

class ApiError extends Error {
    status: number;
    data: any;

    constructor(message: string, status: number, data: any = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// Token management
const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('aiq-token');
    }
    return null;
};

const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('aiq-token', token);
    }
};

const removeToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('aiq-token');
    }
};

// Base API request function
const apiRequest = async <T = any>(endpoint: string, options: RequestInit & { headers?: Record<string, string> } = {}): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getToken();

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Add authentication header if token exists
    if (token) {
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);

        let data;
        try {
            data = await response.json();
        } catch (e) {
            data = null;
        }

        if (!response.ok) {
            // Handle 401 Unauthorized specifically
            if (response.status === 401) {
                // Token might be expired, remove it
                removeToken();
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('aiq-user');
                }
            }

            throw new ApiError(
                data?.message || `HTTP error! status: ${response.status}`,
                response.status,
                data
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Network error occurred', 0);
    }
};

// Auth API
export const authApi = {
    // Login
    async login(payload): Promise<ApiResponse> {
        const data = await apiRequest<ApiResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (data.token) {
            setToken(data.token);
        }

        return data;
    },

    // Register
    async register(payload): Promise<ApiResponse> {
        const data = await apiRequest<ApiResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (data.token) {
            setToken(data.token);
        }

        return data;
    },

    // Get current user profile
    async getProfile(): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>('/auth/profile');
    },

    // Update profile
    async updateProfile(profileData: Record<string, any>): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    },

    // Update instructor profile
    async updateInstructorProfile(instructorData: Record<string, any>): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>('/auth/instructor-profile', {
            method: 'PUT',
            body: JSON.stringify(instructorData),
        });
    },

    // Logout
    logout(): void {
        removeToken();
        if (typeof window !== 'undefined') {
            localStorage.removeItem('aiq-user');
        }
    },
};

// City API
export const citiesApi = {
    //  Get all cities (public endpoint)
    async getAll(params: Record<string, any> = {}): Promise<ApiResponse> {
        const queryParams = new URLSearchParams();

        Object.keys(params).forEach((key) => {
            if (params[key] !== undefined && params[key] !== null) {
                queryParams.append(key, params[key].toString());
            }
        });

        return await apiRequest<ApiResponse>(`/city?${queryParams}`);
    },

    //  Get single city by ID
    async getById(id: string): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>(`/city/${id}`);
    },

    //  Create new city (Admin only)
    async create(data: { name: string; state: string; country?: string }): Promise<ApiResponse> {
        const token = getToken();
        return await apiRequest<ApiResponse>("/city", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    },

    // Update existing city
    async update(
        id: string,
        data: { name?: string; state?: string; country?: string; isActive?: boolean }
    ): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/city/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    },

    // Delete city
    async delete(id: string): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/city/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};

// theater
export const theatersApi = {
    //  Get all theaters (public)
    async getAll(params: Record<string, any> = {}): Promise<ApiResponse> {
        const queryParams = new URLSearchParams();

        Object.keys(params).forEach((key) => {
            if (params[key] !== undefined && params[key] !== null) {
                queryParams.append(key, params[key].toString());
            }
        });

        return await apiRequest<ApiResponse>(`/theaters?${queryParams}`);
    },

    //  Get a theater by ID
    async getById(id: string): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>(`/theaters/${id}`);
    },

    //  Create a new theater (admin only)
    async create(theaterData: Record<string, any>): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>("/theaters", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(theaterData),
        });
    },

    //  Update theater (admin only)
    async update(id: string, updateData: Record<string, any>): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/theaters/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });
    },

    //  Delete theater (admin only)
    async delete(id: string): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/theaters/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
    },
};

// shows
export const showsApi = {
    //  Get all shows (public)
    async getAll(params: Record<string, any> = {}): Promise<ApiResponse> {
        const queryParams = new URLSearchParams();

        Object.keys(params).forEach((key) => {
            if (params[key] !== undefined && params[key] !== null) {
                queryParams.append(key, params[key].toString());
            }
        });

        return await apiRequest<ApiResponse>(`/shows?${queryParams}`);
    },

    //  Get show by ID
    async getById(id: string): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>(`/shows/${id}`);
    },

    //  Create new show (admin only)
    async create(showData: Record<string, any>): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>("/shows", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(showData),
        });
    },

    //  Update show (admin only)
    async update(id: string, updateData: Record<string, any>): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/shows/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });
    },

    //  Delete show (admin only)
    async delete(id: string): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/shows/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    },
};


export const concertApi = {
    //  Get all concerts (public)
    async getAll(params: Record<string, any> = {}): Promise<ApiResponse> {
        const queryParams = new URLSearchParams();

        Object.keys(params).forEach((key) => {
            if (params[key] !== undefined && params[key] !== null) {
                queryParams.append(key, params[key].toString());
            }
        });

        return await apiRequest<ApiResponse>(`/movies?${queryParams}`);
    },

    //  Get concert by ID (public)
    async getById(id: string): Promise<ApiResponse> {
        return await apiRequest<ApiResponse>(`/movies/${id}`);
    },

    //  Create new concert (admin only)
    async create(concertData: Record<string, any>): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>("/movies", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(concertData),
        });
    },

    //  Update concert details (admin only)
    async update(id: string, updateData: Record<string, any>): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/movies/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });
    },

    //  Delete concert (admin only)
    async delete(id: string): Promise<ApiResponse> {
        const token = getToken();

        return await apiRequest<ApiResponse>(`/movies/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
    },
};


















// Export helper functions
export { ApiError, getToken, setToken, removeToken };