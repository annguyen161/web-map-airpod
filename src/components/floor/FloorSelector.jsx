import React, { useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Fab,
  Popover,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  Layers as LayersIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import SwipeableBottomSheet from "../search/SwipeableBottomSheet";

const FloorSelector = ({
  floors = [],
  selectedFloor = null,
  onFloorChange,
  loading = false,
  isTransitioning = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [showMobileSheet, setShowMobileSheet] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (isMobile) {
      setShowMobileSheet(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowMobileSheet(false);
  };

  const handleChange = (event) => {
    const floorId = event.target.value;
    const floor = floors.find((f) => f.id === floorId);
    if (floor) {
      onFloorChange(floor);
    }
    handleClose(); // Close popover after selection
  };

  const handleMobileFloorSelect = (floor) => {
    onFloorChange(floor);
    handleClose();
  };

  if (loading || floors.length === 0) {
    return (
      <Fab
        disabled
        size={isMobile ? "small" : "medium"}
        sx={{
          position: "fixed",
          bottom: isMobile ? "auto" : "auto",
          top: isMobile ? 160 : 100, // Tăng giá trị để di chuyển xuống dưới
          right: isMobile ? 16 : 16,
          zIndex: 1100,
          bgcolor: "white",
          color: "#999",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          // Thêm !important để đảm bảo style được áp dụng
          "&.MuiFab-root": {
            top: isMobile ? "160px !important" : "100px !important",
          },
        }}
      >
        <LayersIcon />
      </Fab>
    );
  }

  return (
    <>
      {/* Floating Action Button with Transition Animation */}
      <Fab
        onClick={handleClick}
        disabled={isTransitioning}
        size={isMobile ? "small" : "medium"}
        sx={{
          position: "fixed",
          bottom: isMobile ? "auto" : "auto",
          top: isMobile ? 160 : 100, // Tăng giá trị để di chuyển xuống dưới
          right: isMobile ? 16 : 16,
          zIndex: 1100,
          bgcolor: isTransitioning ? "#f3f4f6" : "white",
          color: isTransitioning ? "#9ca3af" : "#2563eb",
          boxShadow: isTransitioning
            ? "0 2px 8px rgba(0,0,0,0.1)"
            : "0 4px 12px rgba(0,0,0,0.15)",
          "&:hover": {
            bgcolor: isTransitioning ? "#f3f4f6" : "#f8fafc",
            transform: isTransitioning ? "none" : "scale(1.05)",
          },
          transition: "all 0.3s ease-in-out",
          // Thêm !important để đảm bảo style được áp dụng
          "&.MuiFab-root": {
            top: isMobile ? "160px !important" : "100px !important",
          },
          // Add pulse animation during transition
          animation: isTransitioning
            ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            : "none",
          "@keyframes pulse": {
            "0%, 100%": {
              opacity: 1,
            },
            "50%": {
              opacity: 0.7,
            },
          },
        }}
      >
        <LayersIcon
          sx={{
            transform: isTransitioning ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.5s ease-in-out",
          }}
        />
      </Fab>

      {/* Mobile Swipeable Bottom Sheet */}
      <SwipeableBottomSheet
        isOpen={showMobileSheet}
        onClose={handleClose}
        maxHeight="60vh"
        minHeight="200px"
        initialHeight="40vh" // Chiều cao vừa phải cho floor selector
        zIndex={1400}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            pb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            Chọn Tầng
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ color: "#6b7280" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mx: 2, mb: 1 }} />

        {/* Floor List */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            pb: 2,
          }}
        >
          <List>
            {floors.map((floor, index) => (
              <React.Fragment key={floor.id}>
                <ListItem
                  button
                  onClick={() => handleMobileFloorSelect(floor)}
                  sx={{
                    py: 2,
                    px: 2,
                    "&:hover": {
                      bgcolor: "#f9fafb",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LayersIcon
                      sx={{
                        color:
                          selectedFloor?.id === floor.id
                            ? "#3b82f6"
                            : "#9ca3af",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={floor.name}
                    primaryTypographyProps={{
                      fontSize: "16px",
                      fontWeight: selectedFloor?.id === floor.id ? 600 : 500,
                      color:
                        selectedFloor?.id === floor.id ? "#1f2937" : "#374151",
                    }}
                  />
                  {selectedFloor?.id === floor.id && (
                    <CheckIcon
                      sx={{
                        color: "#3b82f6",
                        fontSize: "20px",
                      }}
                    />
                  )}
                </ListItem>
                {index < floors.length - 1 && <Divider sx={{ mx: 2 }} />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </SwipeableBottomSheet>

      {/* Desktop/Tablet Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          mt: 1,
          zIndex: 1200,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 2.5,
            minWidth: 250,
            maxWidth: 300,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              Chọn Tầng
            </Typography>
            <IconButton
              onClick={handleClose}
              size="small"
              sx={{ color: "#6b7280" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <FormControl fullWidth size="small">
            <Select
              value={selectedFloor?.id || ""}
              onChange={handleChange}
              displayEmpty
              IconComponent={ArrowDownIcon}
              sx={{
                fontSize: "16px",
                "& .MuiSelect-select": {
                  py: 1.5,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e5e7eb",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                },
              }}
            >
              {floors.map((floor) => (
                <MenuItem
                  key={floor.id}
                  value={floor.id}
                  sx={{
                    fontSize: "16px",
                    py: 1,
                    "&.Mui-selected": {
                      bgcolor: "#eff6ff",
                      color: "#1e40af",
                      fontWeight: 600,
                    },
                    "&.Mui-selected:hover": {
                      bgcolor: "#dbeafe",
                    },
                  }}
                >
                  {floor.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Popover>
    </>
  );
};

export default FloorSelector;
