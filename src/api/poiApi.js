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

// Lấy POI theo ID
export const getPoiById = async (id) => {
  try {
    const response = await apiClient.get(`/pois/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Lỗi khi lấy POI theo ID: ${error.message}`);
  }
};

// Lấy POI theo UUID
export const getPoiByUuid = async (uuid) => {
  try {
    const response = await apiClient.get(`/pois/uuid/${uuid}`);
    return response.data;
  } catch (error) {
    throw new Error(`Lỗi khi lấy POI theo UUID: ${error.message}`);
  }
};

// Lấy POI theo Floor ID
export const getPoisByFloor = async (floorId) => {
  try {
    const response = await apiClient.get(`/pois/floor/${floorId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Lỗi khi lấy POI theo Floor: ${error.message}`);
  }
};

// Helper function để xử lý lỗi API
export const handleApiError = (error) => {
  if (error.response) {
    // Server trả về response với status code lỗi
    const { status, data } = error.response;
    return {
      message: data.message || "Có lỗi xảy ra từ server",
      status,
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
