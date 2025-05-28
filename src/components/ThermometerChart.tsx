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
  height = 300,
  width = 80,
}) => {
  const safeValue = typeof value === "number" ? value : 0;
  const percentage = Math.min(safeValue / max, 1);
  const fillHeight = (height - 40) * percentage;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
  {/* Termómetro contorno (tubo + bulbo) */}
  <path
    d={`
      M ${width / 2 - 10} 20
      a 10 10 0 0 1 20 0
      v ${height - 60}
      a 20 20 0 1 1 -20 0
      z
    `}
    fill="red"
    stroke="#333"
    strokeWidth={2}
  />

  {/* Máscara para contener el relleno dentro del termómetro */}
  <mask id="thermoMask">
    <rect width="100%" height="100%" fill="white" />
    <path
      d={`
        M ${width / 2 - 10} 20
        a 10 10 0 0 1 20 0
        v ${height - 60}
        a 20 20 0 1 1 -20 0
        z
      `}
      fill="black"
    />
  </mask>

  {/* Relleno del termómetro */}
  <rect
    x={width / 2 - 10}
    y={height - 20 - fillHeight}
    width={20}
    height={fillHeight}
    fill="red"
  />

  {/* Valor numérico */}
  <text
    x={width / 2}
    y={height - fillHeight - 30}
    textAnchor="middle"
    fill="#111"
    fontSize="18"
    fontWeight="bold"
    style={{ pointerEvents: "none" }}
  >
    {typeof value === "number" ? `${value.toFixed(1)}°C` : "--"}
  </text>
</svg>

  );
};

export default ThermometerChart;
