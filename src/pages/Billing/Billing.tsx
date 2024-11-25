import React, { useState, useEffect } from "react";
import axiosInstance from '../../utils/axiosInstance';
import "./Billing.css";

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
        console.error("Error al cargar facturas:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedFacturaId) {
      // Cargar incidentes facturados de la factura seleccionada
      axiosInstance
        .get(`/facturas/${Number(selectedFacturaId)}/incidentes`)
        .then((response) => {
          setIncidentes(response.data);
          setFilteredIncidentes(response.data);
        })
        .catch((error) => {
          console.error("Error al cargar incidentes facturados:", error);
        });
    }
  }, [selectedFacturaId]);

  const handleFacturaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFacturaId(Number(e.target.value));
  };



  const handleDownloadFactura = () => {
    if (selectedFacturaId) {
      axiosInstance
        .get(`/facturas/${Number(selectedFacturaId)}/download`, { responseType: "blob" })
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
          console.error("Error al descargar la factura:", error);
        });
    }
  };

  return (
    <div className="incidentes-facturados">
      <h1>Incidentes Facturados</h1>
      <div className="selector">
        <label htmlFor="factura-select">Seleccionar Factura:</label>
        <select id="factura-select" onChange={handleFacturaChange} value={selectedFacturaId || ""}>
          {facturas.map((factura) => (
            <option key={factura.id} value={factura.id}>
              {`ID: ${factura.id} | Periodo: ${factura.fecha_inicio} - ${factura.fecha_fin}`}
            </option>
          ))}
        </select>
      </div>
      <table className="incident-table">
        <thead>
          <tr>
            <th>Radicado Incidente</th>
            <th>Costo</th>
            <th>Fecha Incidente</th>
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
        Descargar Factura
      </button>
    </div>
  );
};

export default IncidentesFacturados;
