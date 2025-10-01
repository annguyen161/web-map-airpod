// Export tất cả API functions
export * from "./poiApi.js";
export { default as apiClient } from "./config.js";

// Re-export các functions chính để dễ sử dụng
export {
  getAllPois,
  searchPois,
  getPoiById,
  getPoiByUuid,
  getPoisByFloor,
  handleApiError,
} from "./poiApi.js";
