import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/header/Header";
import Scene3D from "./components/map/Scene3D";
import SearchBar from "./components/search/SearchBar";
import AreaInfo from "./components/areas/AreaInfo";
import "./components/areas/AreaInfo.css";

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3b82f6",
    },
    secondary: {
      main: "#6b7280",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function App() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [areaData, setAreaData] = useState(null);

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    // Mock area data - replace with your actual data fetching
    setAreaData({
      name: area.name,
      description: area.description,
      type: area.properties?.Layer || "Khu vực",
      status: "Hoạt động",
      capacity: "100 người",
      facilities: ["WiFi", "Điều hòa", "Thiết bị âm thanh"],
      coordinates: "X: 0, Y: 0, Z: 0",
      image_url: null,
      hours: "Mở cửa hàng ngày từ 6:00 - 22:00",
      priority: 2,
    });
  };

  const handleCategorySelect = (categoryKey) => {
    console.log("Category selected:", categoryKey);
    // Handle category selection logic here
  };

  const handleClearSearch = () => {
    setSelectedArea(null);
    setAreaData(null);
  };

  const handleCloseAreaInfo = () => {
    setSelectedArea(null);
    setAreaData(null);
  };

  const handleFocus = (area) => {
    console.log("Focus on area:", area);
    // Handle focus logic here
  };

  const handleDirections = () => {
    console.log("Directions requested");
    // Handle directions logic here
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <main style={{ flex: 1, position: "relative" }}>
          <Scene3D />
          <SearchBar
            onAreaSelect={handleAreaSelect}
            onCategorySelect={handleCategorySelect}
            onClearSearch={handleClearSearch}
          />
          <AreaInfo
            selectedArea={selectedArea}
            areaData={areaData}
            onClose={handleCloseAreaInfo}
            onFocus={handleFocus}
            onDirections={handleDirections}
          />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
