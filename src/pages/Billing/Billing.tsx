import React, { useState, useEffect } from "react";
import axiosInstance from '../../utils/axiosInstance';
import "./Billing.css";
import { useTranslation } from 'react-i18next';

interface Factura {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
}

interface IncidenteFacturado {
  factura_id: number;
  radicado_incidente: string;
  costo: number;
  fecha_incidente: string;
}

const IncidentesFacturados: React.FC = () => {
  const { t } = useTranslation(); // Hook para traducciones
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [selectedFacturaId, setSelectedFacturaId] = useState<number | null>(null);
  const [incidentes, setIncidentes] = useState<IncidenteFacturado[]>([]);
  const [filteredIncidentes, setFilteredIncidentes] = useState<IncidenteFacturado[]>([]);

  useEffect(() => {
    // Cargar facturas del cliente
    axiosInstance
      .get("/facturas-by-cliente")
      .then((response) => {
        setFacturas(response.data);
        if (response.data.length > 0) {
          setSelectedFacturaId(response.data[0].id);
        }
      })
      .catch((error) => {
        console.error(t("Error al cargar facturas:"), error);
      });
  }, []);

  useEffect(() => {
    if (selectedFacturaId) {
      const currency = localStorage.getItem('currency') || 'USD';
      const language = localStorage.getItem('language') || 'es';

      axiosInstance
        .get(`/facturas/${Number(selectedFacturaId)}/incidentes`, {
          params: { currency },
        })
        .then((response) => {
          setIncidentes(response.data);
          setFilteredIncidentes(response.data);
        })
        .catch((error) => {
          console.error(t("Error al cargar incidentes facturados:"), error);
        });
    }
  }, [selectedFacturaId]);

  const handleFacturaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFacturaId(Number(e.target.value));
  };

  const handleDownloadFactura = () => {
    if (selectedFacturaId) {
      const currency = localStorage.getItem('currency') || 'USD';
      const language = localStorage.getItem('language') || 'es';

      axiosInstance
        .get(`/facturas/${Number(selectedFacturaId)}/download`, {
          params: { currency, language },
          responseType: "blob",
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `factura_${selectedFacturaId}.pdf`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error(t("Error al descargar la factura:"), error);
        });
    }
  };

  return (
    <div className="incidentes-facturados">
      <h1>{t("Incidentes Facturados")}</h1>
      <div className="selector">
        <label htmlFor="factura-select">{t("Seleccionar Factura:")}</label>
        <select id="factura-select" onChange={handleFacturaChange} value={selectedFacturaId || ""}>
          {facturas.map((factura) => (
            <option key={factura.id} value={factura.id}>
              {`${t("ID:")} ${factura.id} | ${t("Periodo:")} ${factura.fecha_inicio} - ${factura.fecha_fin}`}
            </option>
          ))}
        </select>
      </div>
      <table className="incident-table">
        <thead>
          <tr>
            <th>{t("Radicado Incidente")}</th>
            <th>{t("Costo")}</th>
            <th>{t("Fecha Incidente")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredIncidentes.map((incidente) => (
            <tr key={incidente.factura_id}>
              <td>{incidente.radicado_incidente}</td>
              <td>{incidente.costo.toFixed(2)}</td>
              <td>{incidente.fecha_incidente}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="download-button" onClick={handleDownloadFactura} disabled={!selectedFacturaId}>
        {t("Descargar Factura")}
      </button>
    </div>
  );
};

export default IncidentesFacturados;
