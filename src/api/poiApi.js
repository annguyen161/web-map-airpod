import apiClient from "./config.js";

// Lấy tất cả POI
export const getAllPois = async (params = {}) => {
  try {
    const response = await apiClient.get("/pois", { params });
    return response.data;
  } catch (error) {
    throw new Error(`Lỗi khi lấy danh sách POI: ${error.message}`);
  }
};

// Tìm kiếm POI
export const searchPois = async (searchParams) => {
  try {
    const response = await apiClient.get("/pois/search", {
      params: searchParams,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Lỗi khi tìm kiếm POI: ${error.message}`);
  }
};

// Lấy POI theo ID Name (endpoint mới)
export const getPoiByIdName = async (idName) => {
  try {
    const response = await apiClient.get(`/pois/id-name/${idName}`);
    return response.data;
  } catch (error) {
    // Giữ nguyên lỗi gốc để có thể truy cập error.response
    throw error;
  }
};

// Helper function để xử lý lỗi API
export const handleApiError = (error) => {
  if (error.response) {
    // Server trả về response với status code lỗi
    const { status, data } = error.response;
    return {
      message: data.message || "Có lỗi xảy ra từ server",
      status: data.status || status,
      data: data.data || null,
    };
  } else if (error.request) {
    // Request được gửi nhưng không nhận được response
    return {
      message: "Không thể kết nối đến server",
      status: 0,
      data: null,
    };
  } else {
    // Lỗi khác
    return {
      message: error.message || "Có lỗi không xác định",
      status: -1,
      data: null,
    };
  }
};
