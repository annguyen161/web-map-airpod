// Export tất cả API functions
export * from "./poiApi.js";
export { default as apiClient } from "./config.js";

// Re-export các functions chính để dễ sử dụng
export {
  getAllPois,
  searchPois,
  getPoiByIdName,
  handleApiError,
} from "./poiApi.js";
