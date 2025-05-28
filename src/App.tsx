import { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";
import { Carousel } from "./components/Carrousel";

import LogoRincon from "./assets/logo-rincon.svg";
import SES from "/SmartEcoSchoolSquared.png";
import LogoZazume from "./assets/logo-zazume.svg";
import QRSes from "./assets/qr-ses.svg";
import ThermometerChart from "./components/ThermometerChart";

interface ConsumoData {
  idSensor: number;
  fecha: string;
  consumo?: number;
  incremento: number;
  costo?: number;
  medidas: number;
}

function App() {
  const [consumoLuz, setConsumoLuz] = useState<ConsumoData[]>([]);
  const [consumoAgua, setConsumoAgua] = useState<ConsumoData[]>([]);
  const [consumoLuzAyer, setConsumoLuzAyer] = useState<number>(1);
  const [consumoAguaAyer, setConsumoAguaAyer] = useState<number>(1);
  //const [temperatura, setTemperatura] = useState<number>(25);
  const hashRef = useRef<string>("");
  //setTemperatura(22);

  const getTotalValue = (arr: ConsumoData[]): number =>
    arr.reduce((acc: number, val: ConsumoData) => acc + (val.incremento || 0), 0);

  const totalConsumoLuz = useMemo(() => getTotalValue(consumoLuz), [consumoLuz]);
  const totalConsumoAgua = useMemo(() => getTotalValue(consumoAgua) * 1000, [consumoAgua]); // litros

  const createHash = (data: object): string => {
    return JSON.stringify(data)
      .split("")
      .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
      .toString();
  };

  const calcularIncrementos = (data: ConsumoData[]): ConsumoData[] => {
    const ordenadas = [...data].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    return ordenadas.map((item, index) => {
      if (index === 0) return { ...item, incremento: 0 };
      const incremento = item.medidas - ordenadas[index - 1].medidas;
      return {
        ...item,
        incremento: isNaN(incremento) ? 0 : parseFloat(incremento.toFixed(4)),
      };
    });
  };

  const DataSensor = async () => {
    try {
      const today = new Date();
      const yesterday = new Date(Date.now() - 86400000);

      const responseToday = await fetch(
        import.meta.env.VITE_SENSORS_ENDPOINT + "?date=" + today.toLocaleDateString("en-CA")
      );
      const dataToday: ConsumoData[] = await responseToday.json();

      const luzHoyRaw = dataToday.filter((item: ConsumoData) => item.idSensor === 1);
      const aguaHoyRaw = dataToday.filter((item: ConsumoData) => item.idSensor === 2);

      const luzHoy = calcularIncrementos(luzHoyRaw);
      const aguaHoy = calcularIncrementos(aguaHoyRaw);

      const responseYesterday = await fetch(
        import.meta.env.VITE_SENSORS_ENDPOINT + "?date=" + yesterday.toLocaleDateString("en-CA")
      );
      const dataYesterday: ConsumoData[] = await responseYesterday.json();

      const luzAyerRaw = dataYesterday.filter((item: ConsumoData) => item.idSensor === 1);
      const aguaAyerRaw = dataYesterday.filter((item: ConsumoData) => item.idSensor === 2);

      const totalLuzAyer = getTotalValue(calcularIncrementos(luzAyerRaw));
      setConsumoLuzAyer(totalLuzAyer > 0 ? totalLuzAyer : 1);

      const totalAguaAyer = getTotalValue(calcularIncrementos(aguaAyerRaw)) * 1000;
      setConsumoAguaAyer(totalAguaAyer > 0 ? totalAguaAyer : 1);

      const newHash = createHash([...luzHoy, ...aguaHoy]);
      if (hashRef.current !== newHash) {
        hashRef.current = newHash;
        setConsumoLuz(luzHoy);
        setConsumoAgua(aguaHoy);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    DataSensor();

    const interval = setInterval(() => {
      DataSensor();
    }, 1800000); // 30 minutos

    return () => clearInterval(interval);
  }, []);

  const getInterpolatedColor = (color: string, percentage: number): string => {
    if (color === "#FADB3E") {
      const start = [255, 221, 128];
      const end = [255, 188, 3];
      const interpolated = start.map((c, i) =>
        Math.round(c + (end[i] - c) * percentage)
      );
      return `rgb(${interpolated[0]}, ${interpolated[1]}, ${interpolated[2]})`;
    }

    const base = [74, 199, 247];
    const dark = [29, 125, 180];
    const interpolated = base.map((c, i) =>
      Math.round(c + (dark[i] - c) * percentage)
    );
    return `rgb(${interpolated[0]}, ${interpolated[1]}, ${interpolated[2]})`;
  };

  const renderAppleRing = (
    value: number,
    max: number,
    color: string,
    radius: number,
    icon: string
  ) => {
    const strokeWidth = 30;
    const center = 200;
    const safeMax = max > 0 && !isNaN(max) ? max : 1;
    const safeValue = !isNaN(value) ? value : 0;
    const percentage = safeValue >= safeMax ? 1 : safeValue / safeMax;
    const startAngle = 135;
    const endAngle = 135 + 270;
    const angleSpan = 270 * percentage;
    const valueEndAngle = startAngle + angleSpan;

    const baseStart = (Math.PI / 180) * startAngle;
    const baseEnd = (Math.PI / 180) * endAngle;
    const valEnd = (Math.PI / 180) * valueEndAngle;

    const bx1 = center + radius * Math.cos(baseStart);
    const by1 = center + radius * Math.sin(baseStart);
    const bx2 = center + radius * Math.cos(baseEnd);
    const by2 = center + radius * Math.sin(baseEnd);

    const vx1 = center + radius * Math.cos(baseStart);
    const vy1 = center + radius * Math.sin(baseStart);
    const vx2 = center + radius * Math.cos(valEnd);
    const vy2 = center + radius * Math.sin(valEnd);

    const interpolatedColor = getInterpolatedColor(color, percentage);

    return (
      <>
        <defs>
          <linearGradient id={`grad-${icon}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={interpolatedColor} />
          </linearGradient>
        </defs>

        <path
          d={`M ${bx1} ${by1} A ${radius} ${radius} 0 1 1 ${bx2} ${by2}`}
          fill="none"
          stroke="#ddd"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="6,6"
        />
        <path
          d={`M ${vx1} ${vy1} A ${radius} ${radius} 0 ${angleSpan > 180 ? 1 : 0} 1 ${vx2} ${vy2}`}
          fill="none"
          stroke={`url(#grad-${icon})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
        <text x={center - 5} y={center + radius - 10} fontSize="26" fill="white">
          {icon}
        </text>
      </>
    );
  };

  return (
    <>
      <div className="header">
        <Carousel images={[{ src: QRSes, alt: "QR de SmartEcoSchool" }, { src: LogoRincon, alt: "IES El Rincón" }]} />
        <div className="title">
          <p>Consumo de agua y luz</p>
        </div>
        <Carousel images={[{ src: SES, alt: "SmartEcoSchool" }, { src: LogoZazume, alt: "Zazume" }]} />
      </div>

      <div className="circulitos" style={{ display: "flex", justifyContent: "center", marginTop: "0px" }}>
        <svg width="400" height="400">
          {renderAppleRing(totalConsumoAgua, consumoAguaAyer, "#4AC7F7", 170, "💧")}
          {renderAppleRing(totalConsumoLuz, consumoLuzAyer, "#FADB3E", 130, "⚡")}
        </svg>
      </div>

      <div className="bottom">
        <div className="temp" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ThermometerChart value={22} max={50} />
        </div>

        <div className="consumo">
          <h3>
            <text>Hoy: {totalConsumoLuz.toFixed(2)} kWh</text>
            <text>|  |</text>
            <text>Ayer: {consumoLuzAyer.toFixed(2)} kWh</text>
          </h3>
          <h3>
            <text>Hoy: {totalConsumoAgua.toFixed(2)} litros</text>
            <text>|  |</text>
            <text>Ayer: {consumoAguaAyer.toFixed(2)} litros</text>
          </h3>
        </div>

        <div className="hum"></div>
      </div>
    </>
  );
}

export default App;
