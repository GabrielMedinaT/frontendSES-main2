import { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";
import frasesData from "./assets/frases.json";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Carousel } from "./components/Carrousel";

import LogoRincon from "./assets/logo-rincon.svg";
import SES from "/SmartEcoSchoolSquared.png";
import LogoZazume from "./assets/logo-zazume.svg";
import QRSes from "./assets/qr-ses.svg";

let preciosHoy: number[] = [], preciosAyer: number[] = [];

const Precios = async () => {
  const responseToday = await fetch("https://api.esios.ree.es/archives/70/download_json?date=" + new Date().toLocaleDateString('en-CA'));
  const dataToday = await responseToday.json();
  dataToday.PVPC.forEach((entry: { PCB: string }) => {
    const pcbValue = parseFloat(entry.PCB.replace(',', '.')); // Convert from string to number
    preciosHoy.push(pcbValue);
  });

  const responseYesterday = await fetch("https://api.esios.ree.es/archives/70/download_json?date=" + new Date(Date.now() - 86400000).toLocaleDateString('en-CA'));
  const dataYesterday = await responseYesterday.json();
  dataYesterday.PVPC.forEach((entry: { PCB: string }) => {
    const pcbValue = parseFloat(entry.PCB.replace(',', '.')); // Convert from string to number
    preciosAyer.push(pcbValue);
  });
};

await Precios();

function App() {
  interface ConsumoData {
    idSensor: number;
    fecha: string;
    consumo: number;
    incremento: number;
    costo: number;
  }

  const [fraseLuz, setFraseLuz] = useState<string>("");
  const [fraseAgua, setFraseAgua] = useState<string>("");
  const [consumoLuz, setConsumoLuz] = useState<ConsumoData[]>([]);
  const [consumoAgua, setConsumoAgua] = useState<ConsumoData[]>([]);
  const fechaActual = useRef<string>(new Date().toLocaleDateString('es-ES'));
  const [mostrarHoy, setMostrarHoy] = useState<boolean>(true);

  const totalConsumoLuz = useMemo(() => {
    if (consumoLuz.length === 0) { return 0; }
    return consumoLuz[consumoLuz.length - 1].consumo;
  }, [consumoLuz]);

  const totalConsumoAgua = useMemo(() => {
    if (consumoLuz.length === 0) { return 0; }
    return consumoAgua[consumoAgua.length - 1].consumo;
  }, [consumoAgua]);

  const totalCostoLuz = useMemo(() => {
    if (consumoLuz.length === 0) { return 0; }
    return consumoLuz.reduce((sum, item) => sum + item.costo, 0);
  }, [totalConsumoLuz]);

  const totalCostoAgua = useMemo(() => {
    if (consumoLuz.length === 0) { return 0; }
    return consumoAgua.reduce((sum, item) => sum + item.costo, 0);
  }, [totalConsumoLuz]);

  const obtenerFrasesAleatorias = () => {
    const luzFrases = frasesData.categorias.find((cat) => cat.nombre === "luz")?.frases ?? [];
    const aguaFrases = frasesData.categorias.find((cat) => cat.nombre === "agua")?.frases ?? [];

    if (luzFrases.length > 0) {
      setFraseLuz(
        luzFrases[Math.floor(Math.random() * luzFrases.length)].frase
      );
    }
    if (aguaFrases.length > 0) {
      setFraseAgua(
        aguaFrases[Math.floor(Math.random() * aguaFrases.length)].frase
      );
    }
  };

  const DataSensor = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_SENSORS_ENDPOINT + "?date=" + (mostrarHoy ? new Date() : new Date(Date.now() - 86400000)).toLocaleDateString('en-CA'));
      const data: ConsumoData[] = await response.json();

      const sensorFiltradoLuz = data.filter(item => item.idSensor === 1);
      sensorFiltradoLuz.forEach(item => item.costo = Number((item.incremento * preciosHoy[Number(item.fecha.slice(11, 13))] / 1000).toFixed(2)));
      setConsumoLuz(sensorFiltradoLuz);

      const sensorFiltradoAgua = data.filter(item => item.idSensor === 2);
      sensorFiltradoAgua.forEach(item => item.costo = Number((item.incremento * 2.13 / 1000).toFixed(2)));;
      setConsumoAgua(sensorFiltradoAgua);
    }
    catch (error) { console.error('Error fetching data:', error); }
  };

  useEffect(() => {
    fechaActual.current =
      (mostrarHoy
        ? new Date()
        : new Date(Date.now() - 86400000)
      ).toLocaleDateString('es-ES');
    obtenerFrasesAleatorias();
    DataSensor();

    const interval = setInterval(() => {
      setMostrarHoy((prev) => !prev);
    }, 30000);
    return () => clearInterval(interval);
  }, [mostrarHoy]);

  return (
    <>
      <div className="header">
        <Carousel images={[
          {src: QRSes, alt: "QR de SmartEcoSchool"},
          {src: LogoRincon, alt: "IES El Rincón"}
        ]} />
        <div className="title">
          <p>Consumo de agua y luz</p>
          <p>{fechaActual.current + " "}({mostrarHoy ? "Hoy" : "Ayer"})</p>
        </div>
        <Carousel images={[
          {src: SES, alt: "SmartEcoSchool"},
          {src: LogoZazume, alt: "Zazume"}
          ]} />
      </div>

      <div className="titleBanners">
        <div className="electricityBanner">
          <span className="star" />
          <p>Luz</p>
          <span className="star" />
        </div>
        <div className="waterBanner">
          <span className="droplet" />
          <p>Agua</p>
          <span className="droplet" />
        </div>
      </div>

      <div className="graphContainer">
        <div className="electricityGraph">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={consumoLuz}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={(data) => data.fecha.slice(11, 16)} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incremento" fill="#EBE478" name="Consumo kWh" />
              <Bar dataKey="costo" fill="#f8815d" name="Costo en €" />
            </BarChart>
          </ResponsiveContainer>
          <div className="bottomText">
            <h4 className="summary">
              Total consumo: {totalConsumoLuz} kWh{<br />}Costo acumulado:{" " + totalCostoLuz.toFixed(2)} €
            </h4>
            <h3 className="tip">{fraseLuz}</h3>
          </div>
        </div>

        <div className="waterGraph">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={consumoAgua}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={(data) => data.fecha.slice(11, 16)} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="incremento" fill="#9ddffb" name="Consumo litros" />
              <Bar dataKey="costo" fill="#6186f4" name="Costo en €" />
            </BarChart>
          </ResponsiveContainer>
          <div className="bottomText">
            <h4>
              Total consumo: {totalConsumoAgua} litros{<br />}Costo acumulado:{" " + totalCostoAgua.toFixed(2)} €
            </h4>
            <h3 className="tip">{fraseAgua}</h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;