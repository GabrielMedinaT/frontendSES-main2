import React from "react";

interface ThermometerChartProps {
  value: number | null | undefined;
  max?: number;
  height?: number;
  width?: number;
}

const ThermometerChart: React.FC<ThermometerChartProps> = ({
  value,
  max = 50,
  height = 320,
  width = 200,
}) => {
  const safeValue = typeof value === "number" ? value : 0;
  const percentage = Math.min(safeValue / max, 1);
  const fillHeight = (height - 60) * percentage; // ajustado para dejar espacio para el bulbo
  const bulbRadius = 20;
  const bulbCenterX = width / 2;
  const bulbCenterY = height - bulbRadius;

  return (
    <svg width={width + 10} height={height} viewBox={`0 0 ${width + 10} ${height}`}>
      {/* Definir gradiente */}
      <defs>
        <linearGradient id="thermo-gradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="orange" />
          <stop offset="100%" stopColor="red" />
        </linearGradient>
        <clipPath id="clipPathTube">
          <rect
            x={width / 2 - 10}
            y={20}
            width={20}
            height={height - 60}
            rx={10}
          />
        </clipPath>
      </defs>

      {/* Contorno del termómetro */}
      <path
        d={`
          M ${width / 2 - 10} 20
          a 10 10 0 0 1 20 0
          v ${height - 60}
          a 20 20 0 1 1 -20 0
          z
        `}
        fill="none"
        stroke="#333"
        strokeWidth={2}
      />

      {/* Relleno del tubo con gradiente */}
      <rect
        x={width / 2 - 10}
        y={height - bulbRadius * 2 - fillHeight}
        width={20}
        height={fillHeight}
        fill="url(#thermo-gradient)"
        clipPath="url(#clipPathTube)"
      />

      {/* Bulbo relleno con gradiente */}
      <circle
        cx={bulbCenterX}
        cy={bulbCenterY-2}
        r={bulbRadius}
        fill="orange"
      />

      {/* Valor numérico */}
      <text
        x={bulbCenterX + 35}
        y={height - fillHeight - bulbRadius * 2 + 6}
        textAnchor="middle"
        fill="#111"
        fontSize="18"
        fontWeight="bold"
        style={{ pointerEvents: "none" }}
      >
        {typeof value === "number" ? `――${value.toFixed(1)}°C` : "--"}
      </text>
    </svg>
  );
};

export default ThermometerChart;
