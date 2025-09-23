import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, Paper, useTheme, useMediaQuery, Slide } from "@mui/material";

const SwipeableBottomSheet = ({
  isOpen,
  onClose,
  children,
  maxHeight = "85vh",
  minHeight = "200px",
  initialHeight,
  zIndex = 1400,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [sheetHeight, setSheetHeight] = useState(initialHeight || minHeight);
  const sheetRef = useRef(null);
  const contentRef = useRef(null);

  // Convert CSS height to pixels
  const getHeightInPixels = (height) => {
    if (height.includes("vh")) {
      const vh = parseFloat(height) / 100;
      return window.innerHeight * vh;
    }
    if (height.includes("px")) {
      return parseFloat(height);
    }
    return 0;
  };

  // Convert pixels to CSS height
  const getHeightInCSS = (pixels) => {
    const vh = (pixels / window.innerHeight) * 100;
    return `${vh}vh`;
  };

  // Handle touch start
  const handleTouchStart = useCallback(
    (e) => {
      if (!isMobile) return;

      // Prevent default to ensure we capture the touch
      e.preventDefault();
      setIsDragging(true);
      setStartY(e.touches[0].clientY);
      setCurrentY(e.touches[0].clientY);
    },
    [isMobile]
  );

  // Reset height when opening
  useEffect(() => {
    if (isOpen) {
      // Sử dụng initialHeight nếu có, nếu không thì dùng minHeight
      setSheetHeight(initialHeight || minHeight);
    }
  }, [isOpen, minHeight, initialHeight]);

  // Add global touch event listeners for better gesture handling
  useEffect(() => {
    if (!isMobile || !isDragging) return;

    const handleGlobalTouchMove = (e) => {
      e.preventDefault();
      const currentTouchY = e.touches[0].clientY;
      setCurrentY(currentTouchY);

      const deltaY = currentTouchY - startY;
      const currentHeightPx = getHeightInPixels(sheetHeight);
      const newHeightPx = Math.max(
        getHeightInPixels(minHeight),
        Math.min(getHeightInPixels(maxHeight), currentHeightPx - deltaY)
      );

      setSheetHeight(getHeightInCSS(newHeightPx));
    };

    const handleGlobalTouchEnd = () => {
      setIsDragging(false);
      const deltaY = currentY - startY;

      // If swiped down more than 100px, close the sheet
      if (deltaY > 100) {
        onClose();
        return;
      }

      // Snap to nearest position
      const currentHeightPx = getHeightInPixels(sheetHeight);
      const minHeightPx = getHeightInPixels(minHeight);
      const maxHeightPx = getHeightInPixels(maxHeight);
      const initialHeightPx = initialHeight
        ? getHeightInPixels(initialHeight)
        : minHeightPx;

      const snapPoints = [minHeightPx, initialHeightPx, maxHeightPx].sort(
        (a, b) => a - b
      );

      let closestSnapPoint = snapPoints[0];
      let minDiff = Math.abs(currentHeightPx - snapPoints[0]);

      for (let i = 1; i < snapPoints.length; i++) {
        const diff = Math.abs(currentHeightPx - snapPoints[i]);
        if (diff < minDiff) {
          minDiff = diff;
          closestSnapPoint = snapPoints[i];
        }
      }

      setSheetHeight(getHeightInCSS(closestSnapPoint));
    };

    document.addEventListener("touchmove", handleGlobalTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleGlobalTouchEnd, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [
    isMobile,
    isDragging,
    startY,
    currentY,
    sheetHeight,
    maxHeight,
    minHeight,
    initialHeight,
    onClose,
  ]);

  if (!isMobile) {
    return (
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight,
            overflow: "hidden",
            bgcolor: "white",
          }}
        >
          {children}
        </Paper>
      </Slide>
    );
  }

  return (
    <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
      <Paper
        ref={sheetRef}
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: sheetHeight,
          overflow: "hidden",
          bgcolor: "white",
          transition: isDragging
            ? "none"
            : "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          // Improve touch handling on real devices
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      >
        {/* Drag area - larger touch target */}
        <Box
          sx={{
            py: 2,
            px: 2,
            cursor: "grab",
            touchAction: "none",
            "&:active": {
              cursor: "grabbing",
            },
          }}
          onTouchStart={handleTouchStart}
        >
          {/* Visual handle indicator */}
          <Box
            sx={{
              width: 40,
              height: 4,
              bgcolor: isDragging ? "#9ca3af" : "#e5e7eb",
              borderRadius: 2,
              mx: "auto",
              transition: "background-color 0.2s ease",
            }}
          />
        </Box>

        {/* Content area */}
        <Box
          ref={contentRef}
          sx={{
            height: "calc(100% - 48px)", // Subtract drag area height
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            touchAction: "pan-y", // Allow vertical scrolling in content
          }}
        >
          {children}
        </Box>
      </Paper>
    </Slide>
  );
};

export default SwipeableBottomSheet;
