import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";

export const profileService = {
  // User's own profile operations
  getProfile: async () => {
    try {
      const timestamp = new Date().getTime();
      const [basicProfile, detailedProfile] = await Promise.all([
        api.get(`/me?_t=${timestamp}`),
        api.get(`/profile?_t=${timestamp}`),
      ]);

      return {
        success: true,
        data: {
          ...basicProfile.data.data,
          profile: detailedProfile.data.data.profile,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.post("/profile", profileData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  },

  updateProfilePhoto: async (photoData, onProgress) => {
    try {
      const formData = new FormData();
      formData.append("photo", photoData);

      const response = await api.post("/user/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  },

  // Profile attributes and metadata
  fetchPersonalAttributes: async () => {
    try {
      const response = await api.get(ENDPOINTS.PERSONAL_ATTRIBUTES);
      return response.data;
    } catch (error) {
      console.error("Error fetching personal attributes:", error);
      throw error;
    }
  },

  fetchLifestyleInterests: async () => {
    try {
      const response = await api.get(ENDPOINTS.LIFESTYLE_INTERESTS);
      return response.data;
    } catch (error) {
      console.error("Error fetching lifestyle interests:", error);
      throw error;
    }
  },

  fetchProfessionalEducational: async () => {
    try {
      const response = await api.get(ENDPOINTS.PROFESSIONAL_EDUCATIONAL);
      return response.data;
    } catch (error) {
      console.error("Error fetching professional educational:", error);
      throw error;
    }
  },

  fetchGeographic: async () => {
    try {
      const response = await api.get(ENDPOINTS.GEOGRAPHIC);
      return response.data;
    } catch (error) {
      console.error("Error fetching geographic data:", error);
      throw error;
    }
  },

  fetchCitiesByCountry: async (countryId) => {
    try {
      const response = await api.get(`${ENDPOINTS.CITIES}/${countryId}/cities`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cities:", error);
      return { data: [] };
    }
  },

  fetchAllProfileData: async () => {
    try {
      const [personal, lifestyle, professional, geographic] = await Promise.all([
        profileService.fetchPersonalAttributes(),
        profileService.fetchLifestyleInterests(),
        profileService.fetchProfessionalEducational(),
        profileService.fetchGeographic(),
      ]);

      return {
        personal: personal.data || [],
        lifestyle: lifestyle.data || [],
        professional: professional.data || [],
        geographic: geographic.data || [],
      };
    } catch (error) {
      console.error("Error fetching all profile data:", error);
      throw error;
    }
  },

  // Extended profile data with fallbacks
  fetchSocialMediaPresences: async () => {
    try {
      const response = await api.get("/social-media-presences");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching social media presences:", error);
      return [
        { id: 1, name: "Highly Active 📱" },
        { id: 2, name: "Moderately Active 🖥️" },
        { id: 3, name: "Rarely Active 📴" },
        { id: 4, name: "Inactive 🚫" },
      ];
    }
  },

  fetchJobTitles: async () => {
    try {
      const response = await api.get("/job-titles");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching job titles:", error);
      return [
        { id: 1, name: "Software Developer 💻" },
        { id: 2, name: "Data Scientist 📊" },
        { id: 3, name: "Cloud Engineer ☁️" },
        { id: 4, name: "Product Manager 📋" },
        { id: 5, name: "Designer 🎨" },
        { id: 6, name: "Marketing Specialist 📢" },
        { id: 7, name: "Financial Analyst 💰" },
        { id: 8, name: "Teacher/Educator 📚" },
        { id: 9, name: "Healthcare Professional 🏥" },
        { id: 10, name: "Engineer 🔧" },
        { id: 11, name: "Consultant 💼" },
        { id: 12, name: "Sales Representative 🤝" },
        { id: 13, name: "Project Manager 📊" },
        { id: 14, name: "Research Scientist 🔬" },
        { id: 15, name: "Content Creator 📝" },
        { id: 16, name: "Other" },
      ];
    }
  },
};