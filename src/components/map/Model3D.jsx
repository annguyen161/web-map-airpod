import { useRef, useEffect, forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

const Model = forwardRef(function Model(
  { url, onAreaClick, selectedArea, ...props },
  ref
) {
  const { scene } = useGLTF(url);
  const internalRef = useRef();
  const modelRef = ref || internalRef;
  const { raycaster, camera } = useThree();

  // Clone scene và tạo materials riêng cho mỗi object
  const clonedScene = scene.clone();

  // Tạo materials riêng cho mỗi mesh để tránh shared materials
  clonedScene.traverse((child) => {
    if (child.isMesh && child.material) {
      if (Array.isArray(child.material)) {
        child.material = child.material.map((material) => material.clone());
      } else {
        child.material = child.material.clone();
      }
    }
  });

  useFrame(() => {
    if (modelRef.current) {
      // Reset tất cả materials về trạng thái ban đầu (trừ selected area)
      modelRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          const isSelected = selectedArea && child.name === selectedArea;
          if (!isSelected) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => {
                material.emissive.setHex(0x000000);
                material.emissiveIntensity = 0;
                // Khôi phục opacity ban đầu
                material.opacity = Math.max(material.opacity - 0.5, 0.1);
              });
            } else {
              child.material.emissive.setHex(0x000000);
              child.material.emissiveIntensity = 0;
              // Khôi phục opacity ban đầu
              child.material.opacity = Math.max(
                child.material.opacity - 0.5,
                0.1
              );
            }
          }
        }
      });

      // Highlight khu vực được chọn
      if (selectedArea) {
        modelRef.current.traverse((child) => {
          if (child.isMesh && child.name === selectedArea) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => {
                material.emissive.setHex(0x00ff00);
                material.emissiveIntensity = 2.0;
                // Tăng độ sáng tổng thể của material
                material.opacity = Math.min(material.opacity + 0.5, 1.0);
              });
            } else {
              child.material.emissive.setHex(0x00ff00);
              child.material.emissiveIntensity = 2.0;
              // Tăng độ sáng tổng thể của material
              child.material.opacity = Math.min(
                child.material.opacity + 0.5,
                1.0
              );
            }
          }
        });
      }
    }
  });

  // Chỉ xử lý click events
  useEffect(() => {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    const dragThreshold = 5; // pixels - ngưỡng để phân biệt click và drag

    const handleMouseDown = (event) => {
      isDragging = false;
      startX = event.clientX;
      startY = event.clientY;
    };

    const handleMouseMove = (event) => {
      if (startX !== 0 && startY !== 0) {
        const deltaX = Math.abs(event.clientX - startX);
        const deltaY = Math.abs(event.clientY - startY);

        // Nếu di chuyển quá ngưỡng thì coi là đang drag
        if (deltaX > dragThreshold || deltaY > dragThreshold) {
          isDragging = true;
        }
      }
    };

    const handleClick = (event) => {
      // Chỉ xử lý click nếu không phải đang drag
      if (isDragging || !modelRef.current) {
        console.log("Ignoring click - was dragging");
        return;
      }

      // Cập nhật mouse position
      const rect = event.target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Raycast để tìm object được click
      raycaster.setFromCamera({ x, y }, camera);
      const intersects = raycaster.intersectObject(modelRef.current, true);

      console.log("Click - intersects:", intersects.length);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.isMesh) {
          const areaName = object.name || `Area_${object.uuid}`;
          console.log("Clicked on mesh:", areaName, object);
          if (onAreaClick) {
            onAreaClick(areaName, object);
          }
        }
      }
    };

    const handleMouseUp = () => {
      // Reset sau một khoảng thời gian ngắn để tránh click ngay sau drag
      setTimeout(() => {
        isDragging = false;
        startX = 0;
        startY = 0;
      }, 100);
    };

    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("mousedown", handleMouseDown);
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("click", handleClick);
      canvas.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("mousedown", handleMouseDown);
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("click", handleClick);
        canvas.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [raycaster, camera, onAreaClick]);

  return <primitive ref={modelRef} object={clonedScene} {...props} />;
});

const Model3D = forwardRef(function Model3D(
  { onAreaClick, selectedArea, selectedFloor, isTransitioning },
  ref
) {
  // Xác định URL model dựa trên tầng được chọn
  const getModelUrl = () => {
    if (selectedFloor?.modelUrl) {
      return selectedFloor.modelUrl;
    }
    // Fallback về tầng 3 nếu không có tầng được chọn
    return "/models/Tang3/tang3T3GLB.glb";
  };

  return (
    <Model
      ref={ref}
      url={getModelUrl()}
      onAreaClick={onAreaClick}
      selectedArea={selectedArea}
      isTransitioning={isTransitioning}
    />
  );
});

export default Model3D;
