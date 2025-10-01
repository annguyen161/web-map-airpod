import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import Model3D from "./Model3D";
import AreaInfo from "../areas/AreaInfo";

export default function Scene3D({ selectedFloor, isTransitioning }) {
  const [selectedArea, setSelectedArea] = useState(null);
  const [areaData, setAreaData] = useState(null);
  const controlsRef = useRef();
  const modelRef = useRef();

  const handleAreaClick = (areaName, object) => {
    console.log("Clicked area:", areaName, object);

    // Tạo dữ liệu mẫu cho khu vực
    const mockAreaData = {
      name: areaName,
      description: `Đây là khu vực ${areaName} trong bản đồ 3D. Khu vực này có thể được sử dụng cho các hoạt động khác nhau.`,
      type: "Khu vực chức năng",
      status: "Hoạt động",
      capacity: Math.floor(Math.random() * 200) + 50 + " người",
      facilities: ["WiFi", "Điều hòa", "Thiết bị âm thanh", "Màn hình"],
      coordinates: `X: ${object.position.x.toFixed(
        2
      )}, Y: ${object.position.y.toFixed(2)}, Z: ${object.position.z.toFixed(
        2
      )}`,
    };

    setSelectedArea(areaName);
    setAreaData(mockAreaData);

    // Tự động focus vào khu vực được chọn
    focusOnArea(areaName, object);
  };

  const handleCloseAreaInfo = () => {
    setSelectedArea(null);
    setAreaData(null);
  };

  const focusOnArea = (areaName, object) => {
    if (controlsRef.current && object) {
      // Lấy bounding box của object để tính toán vị trí chính xác
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Tính toán khoảng cách phù hợp dựa trên kích thước object
      const maxDimension = Math.max(size.x, size.y, size.z);

      // Logic mới: object nhỏ zoom gần hơn, object lớn zoom xa hơn
      let distance;
      if (maxDimension < 0.5) {
        // Object rất nhỏ - zoom rất gần để dễ xem
        distance = Math.max(maxDimension * 1.5, 0.8);
      } else if (maxDimension < 1.0) {
        // Object nhỏ - zoom gần
        distance = Math.max(maxDimension * 2, 1.2);
      } else if (maxDimension < 2.0) {
        // Object trung bình - zoom vừa phải
        distance = Math.max(maxDimension * 2.5, 2.0);
      } else {
        // Object lớn - zoom xa hơn
        distance = Math.max(maxDimension * 3, 3.0);
      }

      // Vị trí camera mới - nhìn thẳng từ trên xuống (top-down view)
      // Đảm bảo camera luôn ở phía trên object
      const cameraPosition = new THREE.Vector3(
        center.x, // X giữ nguyên
        center.y + distance, // Y cao hơn để nhìn từ trên xuống
        center.z // Z giữ nguyên
      );

      // Đảm bảo khoảng cách tối thiểu và tối đa hợp lý
      const minDistance = 0.5;
      const maxDistance = 8.0;
      cameraPosition.y = Math.max(
        Math.min(cameraPosition.y, center.y + maxDistance),
        center.y + minDistance
      );

      // Smooth animation đến vị trí mới
      const startTarget = controlsRef.current.target.clone();
      const startPosition = controlsRef.current.object.position.clone();

      // Animation duration (milliseconds)
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        // Interpolate target position (luôn nhìn thẳng xuống center)
        controlsRef.current.target.lerpVectors(
          startTarget,
          center,
          easeProgress
        );

        // Interpolate camera position
        controlsRef.current.object.position.lerpVectors(
          startPosition,
          cameraPosition,
          easeProgress
        );

        // Đảm bảo camera luôn nhìn thẳng xuống và không bị lật
        // Chỉ cho phép xoay quanh trục Y (vertical axis)
        const currentPosition = controlsRef.current.object.position;
        const targetPosition = controlsRef.current.target;

        // Tính toán vector từ camera đến target
        const direction = new THREE.Vector3()
          .subVectors(targetPosition, currentPosition)
          .normalize();

        // Đảm bảo camera luôn ở phía trên target
        if (currentPosition.y < targetPosition.y) {
          currentPosition.y = targetPosition.y + 0.1; // Đảm bảo camera luôn ở trên
        }

        // Update controls
        controlsRef.current.update();

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();

      console.log(
        "Focused on area:",
        areaName,
        "at position:",
        center,
        "distance:",
        distance
      );
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#b7b3b3",
        position: "relative",
      }}
    >
      <Canvas
        camera={{
          position: [0, 8, 0], // Nhìn từ trên cao xuống - tăng độ cao để tránh lật
          fov: 50,
          up: [0, 1, 0], // Đảm bảo up vector đúng hướng
        }}
        style={{ background: "#b7b3b3" }}
      >
        {/* Ánh sáng môi trường */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Mô hình 3D với interaction */}
        <Model3D
          ref={modelRef}
          onAreaClick={handleAreaClick}
          selectedArea={selectedArea}
          selectedFloor={selectedFloor}
          isTransitioning={isTransitioning}
        />

        {/* Điều khiển camera */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          minPolarAngle={0} // Không cho xem từ dưới lên
          maxPolarAngle={Math.PI / 2} // Chỉ cho xem từ trên xuống
          minDistance={0.5} // Giới hạn zoom tối thiểu (không thể zoom quá gần)
          maxDistance={4} // Giới hạn zoom tối đa (tăng lên để có thể zoom xa hơn)
          enableDamping={true} // Thêm damping để chuyển động mượt mà hơn
          dampingFactor={0.05} // Tốc độ damping
          screenSpacePanning={false} // Tránh lật bản đồ khi pan
          enableAutoRotate={false} // Tắt auto rotate
          rotateSpeed={0.5} // Giảm tốc độ xoay
          panSpeed={0.8} // Tốc độ pan
          zoomSpeed={0.8} // Tốc độ zoom
          mouseButtons={{
            LEFT: 2, // Chuột trái = di chuyển (pan)
            MIDDLE: 1, // Chuột giữa = zoom
            RIGHT: 0, // Chuột phải = xoay (rotate)
          }}
        />

        {/* Môi trường xung quanh */}
        <Environment preset="sunset" />
      </Canvas>

      {/* Component hiển thị thông tin khu vực */}
      <AreaInfo
        selectedArea={selectedArea}
        areaData={areaData}
        onClose={handleCloseAreaInfo}
        onFocus={(areaName) => {
          // Tìm object trong scene để focus
          if (modelRef.current) {
            let foundObject = null;
            modelRef.current.traverse((child) => {
              if (child.isMesh && child.name === areaName) {
                foundObject = child;
              }
            });

            if (foundObject) {
              focusOnArea(areaName, foundObject);
            } else {
              console.warn("Could not find object with name:", areaName);
            }
          }
        }}
      />
    </div>
  );
}
