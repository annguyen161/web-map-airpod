import React, { useState } from "react";
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Grid,
  Button,
  Typography,
  Collapse,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Fade,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  ArrowBack as ArrowBackIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";
import SwipeableBottomSheet from "./SwipeableBottomSheet";

// Mock data for areas - replace with your actual data
const mockAreas = [
  {
    _id: "1",
    name: "Khu vực A",
    description: "Mô tả khu vực A",
    type: "meeting",
    properties: { Layer: "Meeting Room" },
  },
  {
    _id: "2",
    name: "Khu vực B",
    description: "Mô tả khu vực B",
    type: "office",
    properties: { Layer: "Office" },
  },
  {
    _id: "3",
    name: "Khu vực C",
    description: "Mô tả khu vực C",
    type: "lobby",
    properties: { Layer: "Lobby" },
  },
];

// Mock categories
const categories = [
  { key: "meeting", label: "Phòng họp", icon: "🏢", color: "#3b82f6" },
  { key: "office", label: "Văn phòng", icon: "💼", color: "#10b981" },
  { key: "lobby", label: "Sảnh", icon: "🏛️", color: "#f59e0b" },
  { key: "cafe", label: "Cà phê", icon: "☕", color: "#8b5cf6" },
  { key: "restaurant", label: "Nhà hàng", icon: "🍽️", color: "#ef4444" },
  { key: "shop", label: "Cửa hàng", icon: "🛍️", color: "#06b6d4" },
  { key: "parking", label: "Bãi đỗ xe", icon: "🅿️", color: "#6b7280" },
  { key: "elevator", label: "Thang máy", icon: "🛗", color: "#84cc16" },
];

export default function SearchBar({
  areas = mockAreas,
  onAreaSelect,
  onCategorySelect,
  onClearSearch,
  placeholder = "Tìm kiếm...",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Filter areas based on search term
  const filteredAreas = areas.filter(
    (area) =>
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      setShowResults(true);
      setShowCategories(false);
    } else {
      setShowResults(false);
      // Show categories if search is expanded but no text
      setShowCategories(isSearchExpanded);
    }
  };

  const handleAreaClick = (area) => {
    setSearchTerm(area.name);
    setShowResults(false);
    setShowCategories(false);
    onAreaSelect?.(area);
  };

  const handleCategoryClick = (categoryKey) => {
    setShowCategories(false);
    setIsSearchExpanded(false);
    onCategorySelect?.(categoryKey);
  };

  const handleClear = () => {
    setSearchTerm("");
    setShowResults(false);
    setShowCategories(false);
    onClearSearch?.(); // Notify parent to clear selection
  };

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
    if (searchTerm.length > 0) {
      setShowResults(true);
      setShowCategories(false);
    } else {
      setShowCategories(true);
      setShowResults(false);
    }
  };

  const handleBackClick = () => {
    setIsSearchExpanded(false);
    setShowResults(false);
    setShowCategories(false);
    setSearchTerm("");
    onClearSearch?.(); // Also clear selection when going back
  };

  const toggleCategories = () => {
    // Don't toggle if there's search text
    if (searchTerm.length > 0) return;

    const newShowCategories = !showCategories;
    setShowCategories(newShowCategories);
    setShowResults(false);

    // Update search expansion state accordingly
    if (newShowCategories) {
      setIsSearchExpanded(true);
    } else {
      setIsSearchExpanded(false);
    }
  };

  const handleCloseCategories = () => {
    setShowCategories(false);
    setIsSearchExpanded(false);
  };

  // Mobile optimized search bar with bottom sheet style
  if (isMobile) {
    return (
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 8,
          right: 8,
          zIndex: 1000,
        }}
      >
        {/* Compact Search Input */}
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "white",
            borderRadius: 3,
            minHeight: 48,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {isSearchExpanded ? (
            <IconButton
              sx={{
                p: "8px",
                color: "#666",
              }}
              aria-label="back"
              onClick={handleBackClick}
            >
              <ArrowBackIcon fontSize="medium" />
            </IconButton>
          ) : (
            <IconButton
              sx={{
                p: "8px",
                color: "#666",
              }}
              aria-label="search"
            >
              <SearchIcon fontSize="medium" />
            </IconButton>
          )}

          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              fontSize: "16px",
              "& input": {
                padding: "12px 0",
              },
            }}
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleSearchFocus}
          />

          {searchTerm ? (
            <IconButton
              sx={{
                p: "8px",
                color: "#666",
              }}
              aria-label="clear"
              onClick={handleClear}
            >
              <ClearIcon fontSize="medium" />
            </IconButton>
          ) : (
            <IconButton
              sx={{
                p: "8px",
                color: "#666",
              }}
              aria-label="toggle-categories"
              onClick={toggleCategories}
            >
              {showCategories ? (
                <ArrowUpIcon fontSize="medium" />
              ) : (
                <ArrowDownIcon fontSize="medium" />
              )}
            </IconButton>
          )}
        </Paper>

        {/* Mobile Swipeable Bottom Sheet for Categories */}
        <SwipeableBottomSheet
          isOpen={showCategories}
          onClose={handleCloseCategories}
          maxHeight="70vh"
          minHeight="300px"
          initialHeight="50vh"
          zIndex={1300}
        >
          {/* Categories Grid */}
          <Box
            sx={{
              px: 2,
              pb: 4,
              flex: 1,
              overflowY: "auto",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: "18px",
                fontWeight: 600,
                mb: 2,
                color: "#1f2937",
              }}
            >
              Danh mục
            </Typography>

            <Grid container spacing={1.5}>
              {categories.map((category) => (
                <Grid item xs={3} key={category.key}>
                  <Button
                    variant="text"
                    onClick={() => handleCategoryClick(category.key)}
                    sx={{
                      width: "100%",
                      height: 85,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 1,
                      color: "#374151",
                      borderRadius: 2,
                      border: "1px solid transparent",
                      "&:hover": {
                        bgcolor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        transform: "translateY(-1px)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      },
                      textTransform: "none",
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 26,
                        mb: 0.75,
                        color: "#374151",
                      }}
                    >
                      {category.icon}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.7rem",
                        textAlign: "center",
                        lineHeight: 1.1,
                        fontWeight: 500,
                        color: "inherit",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "2.2em",
                        maxWidth: "100%",
                      }}
                    >
                      {category.label}
                    </Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </SwipeableBottomSheet>

        {/* Search Results - Mobile optimized */}
        <Fade in={showResults}>
          <Paper
            elevation={3}
            sx={{
              mt: 1,
              maxHeight: 250,
              overflow: "auto",
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <List dense>
              {filteredAreas.length > 0 ? (
                filteredAreas.slice(0, 10).map((area) => (
                  <ListItem
                    key={area._id}
                    onClick={() => handleAreaClick(area)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                      borderBottom: "1px solid #f0f0f0",
                      "&:last-child": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <ListItemText
                      primary={area.name}
                      secondary={area.description}
                      primaryTypographyProps={{
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                      secondaryTypographyProps={{
                        noWrap: true,
                        fontSize: "14px",
                        color: "#666",
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem sx={{ py: 2 }}>
                  <ListItemText
                    primary="Không tìm thấy kết quả"
                    primaryTypographyProps={{
                      fontSize: "16px",
                      color: "text.secondary",
                    }}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Fade>
      </Box>
    );
  }

  // Desktop/Tablet version
  return (
    <Box
      sx={{
        position: "absolute",
        top: 20,
        left: isTablet ? 16 : 16,
        right: "auto",
        zIndex: 1000,
        width: isTablet ? 350 : 400,
        maxWidth: 400,
      }}
    >
      {/* Search Input */}
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "white",
          borderRadius: 2,
          minHeight: 56,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {isSearchExpanded && isTablet ? (
          <IconButton
            sx={{
              p: "10px",
              color: "#666",
            }}
            aria-label="back"
            onClick={handleBackClick}
          >
            <ArrowBackIcon fontSize="medium" />
          </IconButton>
        ) : (
          <IconButton
            sx={{
              p: "10px",
              color: "#666",
            }}
            aria-label="search"
          >
            <SearchIcon fontSize="medium" />
          </IconButton>
        )}

        <InputBase
          sx={{
            ml: 1,
            flex: 1,
            fontSize: "14px",
            "& input": {
              padding: "10px 0",
            },
          }}
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleSearchFocus}
        />

        {searchTerm ? (
          <IconButton
            sx={{
              p: "10px",
              color: "#666",
            }}
            aria-label="clear"
            onClick={handleClear}
          >
            <ClearIcon fontSize="medium" />
          </IconButton>
        ) : (
          <IconButton
            sx={{
              p: "10px",
              color: "#666",
            }}
            aria-label="toggle-categories"
            onClick={toggleCategories}
          >
            {showCategories ? (
              <ArrowUpIcon fontSize="medium" />
            ) : (
              <ArrowDownIcon fontSize="medium" />
            )}
          </IconButton>
        )}
      </Paper>

      {/* Search Results */}
      <Collapse in={showResults}>
        <Paper
          elevation={3}
          sx={{
            mt: 1,
            maxHeight: 300,
            overflow: "auto",
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <List dense={!isTablet}>
            {filteredAreas.length > 0 ? (
              filteredAreas.slice(0, 10).map((area) => (
                <ListItem
                  key={area._id}
                  onClick={() => handleAreaClick(area)}
                  sx={{
                    py: isTablet ? 1.5 : 1,
                    px: isTablet ? 2 : 1.5,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                    borderBottom: "1px solid #f0f0f0",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <ListItemText
                    primary={area.name}
                    secondary={area.description}
                    primaryTypographyProps={{
                      fontSize: isTablet ? "16px" : "14px",
                      fontWeight: 500,
                    }}
                    secondaryTypographyProps={{
                      noWrap: true,
                      fontSize: isTablet ? "14px" : "0.75rem",
                      color: "#666",
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem sx={{ py: isTablet ? 2 : 1.5 }}>
                <ListItemText
                  primary="Không tìm thấy kết quả"
                  primaryTypographyProps={{
                    fontSize: isTablet ? "16px" : "14px",
                    color: "text.secondary",
                  }}
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </Collapse>

      {/* Category Grid */}
      <Collapse in={showCategories}>
        <Paper
          elevation={3}
          sx={{
            mt: 1,
            p: isTablet ? 2 : 2,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            maxHeight: isTablet ? 400 : 450,
            overflow: "auto",
          }}
        >
          <Grid container spacing={1.5} sx={{ justifyContent: "flex-start" }}>
            {categories.map((category) => (
              <Grid item xs={3} key={category.key}>
                <Button
                  variant="text"
                  onClick={() => handleCategoryClick(category.key)}
                  sx={{
                    width: "100%",
                    height: isTablet ? 85 : 80,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: isTablet ? 1 : 0.75,
                    color: "#374151",
                    borderRadius: 2,
                    border: "1px solid transparent",
                    "&:hover": {
                      bgcolor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      transform: "translateY(-1px)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                    textTransform: "none",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: isTablet ? 26 : 22,
                      mb: 0.75,
                      color: "#374151",
                    }}
                  >
                    {category.icon}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: isTablet ? "0.7rem" : "0.65rem",
                      textAlign: "center",
                      lineHeight: 1.1,
                      fontWeight: 500,
                      color: "inherit",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.2em",
                      maxWidth: "100%",
                    }}
                  >
                    {category.label}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Collapse>
    </Box>
  );
}
