import React from "react";

interface WaterDropChartProps {
  value: number | null | undefined;
  max?: number;
  height?: number;
  width?: number;
}

const WaterDropChart: React.FC<WaterDropChartProps> = ({
  value,
  max = 100,
  height = 300,
  width = 200,
}) => {
  const safeValue = typeof value === "number" ? value : 0;
  const percentage = Math.min(safeValue / max, 1);
  const fillHeight = height * percentage;

  const centerX = width / 2;
  const dropTopY = height * 0.02;  // Punto más alto más fino
  const dropBottomY = height * 0.98; // Punto base más redondeado
  const bulgeHeight = height * 0.7;  // Altura donde está la parte más ancha

  // Forma con base más redondeada
  const dropPath = `
  M ${centerX + 10 },${dropBottomY - 10}
  C ${centerX + width * 0.5},${bulgeHeight} 
    ${centerX + width * 0.2},${height * 0.5} 
    ${centerX },${dropTopY}
  C ${centerX - width * 0.2},${height * 0.5} 
    ${centerX - width * 0.5},${bulgeHeight} 
    ${centerX - 10 },${dropBottomY - 10}
  Z
`;


  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: "visible" }}
    >
      {/* Máscara con forma de gota */}
      <mask id="dropMask">
        <path d={dropPath} fill="white" />
      </mask>

      {/* Relleno con gradiente más realista */}
      <defs>
        <linearGradient id="waterGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#2580c7" />
          <stop offset="50%" stopColor="#4b9fd9" />
          <stop offset="100%" stopColor="#89c4f4" />
        </linearGradient>
        
        {/* Efecto de brillo */}
        <radialGradient id="waterHighlight" cx="30%" cy="30%" r="60%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="white" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Fondo de la gota */}
      <rect
        x="0"
        y={height - fillHeight}
        width={width}
        height={fillHeight}
        fill="url(#waterGradient)"
        mask="url(#dropMask)"
      />
      
      {/* Efecto de brillo */}
      <path
        d={dropPath}
        fill="url(#waterHighlight)"
        opacity="0.6"
      />

      {/* Contorno con efecto 3D */}
      <path
        d={dropPath}
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1"
      />
      <path
        d={dropPath}
        fill="none"
        stroke="#0b5fb3"
        strokeWidth="1.5"
      />

      {/* Texto mejorado */}
      <text
        x={centerX}
        y={height * 0.6}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="20"
        fontWeight="600"
        style={{ 
          pointerEvents: "none",
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.7))'
        }}
      >
        {typeof value === "number" ? `${value.toFixed(1)}%` : "--"}
      </text>
    </svg>
  );
};

export default WaterDropChart;