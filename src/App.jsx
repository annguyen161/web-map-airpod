import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/header/Header";
import Scene3D from "./components/map/Scene3D";
import SearchBar from "./components/search/SearchBar";
import AreaInfo from "./components/areas/AreaInfo";
import FloorSelector from "./components/floor/FloorSelector";
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
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Dữ liệu tầng mẫu - có thể thay thế bằng API call
  const floors = [
    { id: "tang2", name: "Tầng 2", modelUrl: "/models/Tang2/tang2T3GLB.glb" },
    { id: "tang3", name: "Tầng 3", modelUrl: "/models/Tang3/tang3T3GLB.glb" },
  ];

  // Khởi tạo tầng mặc định
  React.useEffect(() => {
    if (floors.length > 0 && !selectedFloor) {
      setSelectedFloor(floors[0]); // Chọn tầng đầu tiên làm mặc định
    }
  }, []);

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    setAreaData(null); // Reset areaData, Scene3D sẽ set lại
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

  const handleFloorChange = (floor) => {
    if (floor.id !== selectedFloor?.id) {
      setIsTransitioning(true);

      // Clear current selection when changing floors
      setSelectedArea(null);
      setAreaData(null);

      // Update selected floor
      setSelectedFloor(floor);

      // Simulate transition delay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <main style={{ flex: 1, position: "relative" }}>
          <Scene3D
            selectedFloor={selectedFloor}
            isTransitioning={isTransitioning}
            selectedArea={selectedArea}
            onAreaSelect={handleAreaSelect}
          />
          <SearchBar
            onAreaSelect={handleAreaSelect}
            onCategorySelect={handleCategorySelect}
            onClearSearch={handleClearSearch}
          />
          <FloorSelector
            floors={floors}
            selectedFloor={selectedFloor}
            onFloorChange={handleFloorChange}
            loading={false}
            isTransitioning={isTransitioning}
          />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
