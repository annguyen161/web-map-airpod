import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Fade,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Share as ShareIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import SwipeableBottomSheet from "../search/SwipeableBottomSheet";

export default function AreaInfo({
  selectedArea,
  areaData,
  isLoading = false,
  error = null,
  onClose,
  onFocus,
  onDirections,
}) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const descriptionRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Handle smooth transitions when area changes
  useEffect(() => {
    if (selectedArea) {
      if (!isVisible) {
        // First time showing - fade in
        setIsVisible(true);
        setIsTransitioning(false);
      } else {
        // Area changed - transition effect
        setIsTransitioning(true);
        const timer = setTimeout(() => {
          setIsTransitioning(false);
        }, 300); // Match transition duration
        return () => clearTimeout(timer);
      }
    } else {
      // No area selected - fade out
      setIsVisible(false);
      setIsTransitioning(false);
    }
  }, [selectedArea, isVisible]);

  // Check if description needs "read more" button
  useEffect(() => {
    if (!selectedArea) return;

    // Reset expanded state when area changes
    setIsDescriptionExpanded(false);

    // Use setTimeout to ensure DOM is rendered
    const timer = setTimeout(() => {
      if (descriptionRef.current && areaData?.description) {
        const element = descriptionRef.current;
        const lineHeight = parseInt(
          window.getComputedStyle(element).lineHeight
        );
        const maxHeight = lineHeight * 3; // 3 lines
        setShowReadMore(element.scrollHeight > maxHeight);
      } else {
        setShowReadMore(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [areaData?.description, selectedArea]);

  if (!selectedArea || !isVisible) return null;

  // Dữ liệu mẫu cho các khu vực
  const defaultAreaData = {
    name: selectedArea,
    description:
      "Khu vực được chọn trong bản đồ 3D. Đây là mô tả chi tiết về khu vực này và các tiện ích có sẵn.",
    type: "Khu vực",
    status: "Hoạt động",
    image_url: null,
    hours: "Mở cửa hàng ngày từ 6:00 - 22:00",
    categories: ["Dịch vụ", "Y tế"], // Thay thế priority bằng categories
  };

  const currentAreaData = areaData || defaultAreaData;

  // Category color - all categories use the same color
  const getCategoryColor = (category) => {
    return "#6b7280"; // Gray for all categories
  };

  // Mobile bottom sheet version
  if (isMobile) {
    return (
      <SwipeableBottomSheet
        isOpen={isVisible}
        onClose={onClose}
        maxHeight="70vh"
        minHeight="200px"
        zIndex={1400}
      >
        {/* Header with logo and actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            pb: 2,
          }}
        >
          {/* Categories Tags */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {currentAreaData.categories?.map((category, index) => (
              <Box
                key={index}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "white",
                  bgcolor: getCategoryColor(category),
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {category}
              </Box>
            ))}
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={onDirections}
              sx={{
                color: "#6b7280",
                "&:hover": { color: "#3b82f6" },
                transition: "color 0.2s ease",
              }}
              title="Chia sẻ"
            >
              <ShareIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                color: "#6b7280",
                "&:hover": { color: "#ef4444" },
                transition: "color 0.2s ease",
              }}
              title="Đóng"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Area Name */}
        <Box sx={{ px: 2, pb: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#1f2937",
              lineHeight: 1.2,
            }}
          >
            {currentAreaData.name}
          </Typography>
        </Box>

        {/* Location and Status */}
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#3b82f6",
              fontSize: "14px",
              fontWeight: 500,
              mb: 0.5,
            }}
          >
            {currentAreaData.type}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#f59e0b",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {currentAreaData.status}
          </Typography>
        </Box>

        <Divider sx={{ mx: 2, mb: 2 }} />

        {/* Content */}
        <Box
          sx={{
            px: 2,
            pb: 2,
            flex: 1,
            maxHeight: "calc(70vh - 200px)", // Giới hạn chiều cao để có thể scroll
            overflowY: "auto",
            opacity: isTransitioning ? 0.7 : 1,
            transition: "opacity 0.3s ease",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f5f9",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#cbd5e1",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#94a3b8",
            },
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 #f1f5f9",
          }}
        >
          {/* Loading State */}
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} />
              <Typography sx={{ ml: 2, color: "#6b7280" }}>
                Đang tải thông tin...
              </Typography>
            </Box>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {/* Description */}
          {currentAreaData.description && (
            <Box sx={{ mb: 3 }}>
              <Typography
                ref={descriptionRef}
                variant="body2"
                className={!isDescriptionExpanded ? "line-clamp-3" : ""}
                sx={{
                  color: "#4b5563",
                  lineHeight: 1.5,
                  fontSize: "14px",
                  transition: "all 0.3s ease",
                }}
              >
                {currentAreaData.description}
              </Typography>
              {showReadMore && (
                <Button
                  onClick={() => {
                    setIsDescriptionExpanded(!isDescriptionExpanded);
                    setTimeout(() => {
                      if (descriptionRef.current) {
                        descriptionRef.current.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                        });
                      }
                    }, 100);
                  }}
                  sx={{
                    mt: 1,
                    p: 0,
                    minWidth: "auto",
                    textTransform: "none",
                    color: "#3b82f6",
                    fontSize: "12px",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#2563eb",
                    },
                  }}
                >
                  {isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
                </Button>
              )}
            </Box>
          )}

          {/* Image */}
          {currentAreaData.image_url && (
            <Box
              sx={{
                transform: isTransitioning ? "scale(0.98)" : "scale(1)",
                transition: "transform 0.3s ease",
                mb: 2,
              }}
            >
              <img
                src={currentAreaData.image_url}
                alt={currentAreaData.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                }}
                onError={(e) => {
                  const target = e.target;
                  target.style.display = "none";
                }}
              />
            </Box>
          )}

          {/* Hours section */}
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#1f2937",
                fontSize: "14px",
                fontWeight: 600,
                mb: 1,
              }}
            >
              Giờ hoạt động
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              {currentAreaData.hours}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons - Fixed at bottom */}
        <Box
          sx={{
            px: 2,
            pb: 3,
            pt: 2,
            borderTop: "1px solid #f0f0f0",
            bgcolor: "#fafafa",
            transform: isTransitioning ? "scale(0.98)" : "scale(1)",
            transition: "transform 0.3s ease",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={onDirections}
              startIcon={<LocationIcon />}
              sx={{
                bgcolor: "#3b82f6",
                color: "white",
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#2563eb",
                },
              }}
            >
              Chỉ đường
            </Button>
            <IconButton
              onClick={onFocus}
              sx={{
                bgcolor: "#f3f4f6",
                color: "#374151",
                border: "1px solid #e5e7eb",
                "&:hover": {
                  bgcolor: "#e5e7eb",
                },
              }}
            >
              <PhoneIcon />
            </IconButton>
          </Box>
        </Box>
      </SwipeableBottomSheet>
    );
  }

  // Desktop/Tablet version
  return (
    <Fade in={isVisible} timeout={300}>
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: isTablet ? 8 : 16,
          right: isTablet ? 8 : "auto",
          zIndex: 1200,
          width: isTablet ? "calc(100% - 16px)" : 450,
          maxWidth: isTablet ? "none" : 450,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            bgcolor: "white",
            borderRadius: isTablet ? 3 : 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            overflow: "hidden",
            maxHeight: "calc(100vh - 40px)", // Giới hạn chiều cao tối đa
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: "1px solid #f0f0f0",
              bgcolor: "#f8fafc",
              position: "relative",
              overflow: "hidden",
              "&::before": isTransitioning
                ? {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
                    animation: "shimmer 0.6s ease-in-out",
                    "@keyframes shimmer": {
                      "0%": { left: "-100%" },
                      "100%": { left: "100%" },
                    },
                  }
                : {},
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: isTablet ? "16px" : "18px",
                fontWeight: 600,
                flex: 1,
                mr: 1,
                transition: "color 0.3s ease",
                color: "#1f2937",
              }}
            >
              {currentAreaData.name}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                onClick={onDirections}
                sx={{
                  color: "#6b7280",
                  "&:hover": { color: "#3b82f6" },
                  transition: "color 0.2s ease",
                }}
                title="Chia sẻ"
              >
                <ShareIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={onClose}
                sx={{
                  color: "#6b7280",
                  "&:hover": { color: "#ef4444" },
                  transition: "color 0.2s ease",
                }}
                title="Đóng"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Content */}
          <Box
            className="area-info-panel-content"
            sx={{
              p: 2,
              pb: 3, // Thêm padding bottom để tránh bị che bởi scrollbar
              maxHeight: "calc(100vh - 180px)", // Chiều cao tối đa cho content (trừ header và nút Directions)
              overflowY: "auto", // Thêm scroll
              opacity: isTransitioning ? 0.7 : 1,
              transition: "opacity 0.3s ease",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f5f9",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#cbd5e1",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#94a3b8",
              },
              // Firefox scrollbar
              scrollbarWidth: "thin",
              scrollbarColor: "#cbd5e1 #f1f5f9",
            }}
          >
            {/* Loading State */}
            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={24} />
                <Typography sx={{ ml: 2, color: "#6b7280" }}>
                  Đang tải thông tin...
                </Typography>
              </Box>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {/* Categories and Type */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                flexWrap: "wrap",
              }}
            >
              {currentAreaData.categories?.map((category, index) => (
                <Box
                  key={index}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "white",
                    bgcolor: getCategoryColor(category),
                    transform: isTransitioning ? "scale(0.95)" : "scale(1)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {category}
                </Box>
              ))}
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  fontSize: "14px",
                  transition: "color 0.3s ease",
                }}
              >
                {currentAreaData.type}
              </Typography>
            </Box>

            {/* Description */}
            {currentAreaData.description && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  ref={descriptionRef}
                  variant="body2"
                  className={!isDescriptionExpanded ? "line-clamp-3" : ""}
                  sx={{
                    color: "#4b5563",
                    lineHeight: 1.5,
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                  }}
                >
                  {currentAreaData.description}
                </Typography>
                {showReadMore && (
                  <Button
                    onClick={() => {
                      setIsDescriptionExpanded(!isDescriptionExpanded);
                      // Scroll to show the expanded content
                      setTimeout(() => {
                        if (descriptionRef.current) {
                          descriptionRef.current.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                          });
                        }
                      }, 100);
                    }}
                    sx={{
                      mt: 1,
                      p: 0,
                      minWidth: "auto",
                      textTransform: "none",
                      color: "#3b82f6",
                      fontSize: "12px",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "#2563eb",
                      },
                    }}
                  >
                    {isDescriptionExpanded ? "Thu gọn" : "Xem thêm"}
                  </Button>
                )}
              </Box>
            )}

            {/* Image */}
            {currentAreaData.image_url && (
              <Box
                sx={{
                  transform: isTransitioning ? "scale(0.98)" : "scale(1)",
                  transition: "transform 0.3s ease",
                }}
              >
                <img
                  src={currentAreaData.image_url}
                  alt={currentAreaData.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                  onError={(e) => {
                    const target = e.target;
                    target.style.display = "none";
                  }}
                />
              </Box>
            )}

            {/* Hours */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#1f2937",
                  fontSize: "14px",
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Giờ hoạt động
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                {currentAreaData.hours}
              </Typography>
            </Box>
          </Box>

          {/* Directions Button - Fixed at bottom */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #f0f0f0",
              bgcolor: "#fafafa",
              transform: isTransitioning ? "scale(0.98)" : "scale(1)",
              transition: "transform 0.3s ease",
            }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={onDirections}
              startIcon={<LocationIcon />}
              sx={{
                bgcolor: "#3b82f6",
                color: "white",
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#2563eb",
                },
              }}
            >
              Chỉ đường
            </Button>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
}
