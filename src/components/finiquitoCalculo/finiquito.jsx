import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FiniquitoCalculo = () => {
  const [causa, setCausa] = useState("Art. 159 número 2: Renuncia");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [diasVacacionesTomados, setDiasVacacionesTomados] = useState(0);
  const [sueldoBase, setSueldoBase] = useState(0);
  const [otrasRemuneracionesImponibles, setOtrasRemuneracionesImponibles] = useState(0);
  const [otrasRemuneracionesNoImponibles, setOtrasRemuneracionesNoImponibles] = useState(0);
  const [remuneracionVariable, setRemuneracionVariable] = useState(false);
  const [remuneracionVariableMeses, setRemuneracionVariableMeses] = useState({
    noviembre: 0,
    octubre: 0,
    septiembre: 0,
  });
  const [finiquito, setFiniquito] = useState(null);

  const handleInputChange = (setter) => (e) => {
    const value = e.target.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value;
    setter(value);
  };

  const handleVariableChange = (month) => (e) => {
    const value = parseFloat(e.target.value) || 0;
    setRemuneracionVariableMeses((prev) => ({
      ...prev,
      [month]: value,
    }));
  };

  const calcularFiniquito = () => {
    const fechaInicio = new Date(fechaIngreso);
    const fechaTermino = new Date(fechaFin);
    const tiempoTrabajado = fechaTermino - fechaInicio;
    const añosTrabajados = tiempoTrabajado / (1000 * 60 * 60 * 24 * 365.25);
    
    // Cálculo de días de vacaciones proporcionales
    const diasVacacionesCorrespondientes = Math.floor(añosTrabajados * 15);
    const diasVacacionesPendientes = Math.max(diasVacacionesCorrespondientes - diasVacacionesTomados, 0);
    const pagoVacaciones = (sueldoBase / 30) * diasVacacionesPendientes;

    // Promedio de remuneración variable
    const totalRemuneracionVariable = Object.values(remuneracionVariableMeses).reduce((acc, curr) => acc + curr, 0);
    const promedioRemuneracionVariable = remuneracionVariable ? totalRemuneracionVariable / 3 : 0;

    // Indemnización por años de servicio (para Art. 161)
    const indemnizacionAñosServicio = causa === "Art. 161: Necesidades de la empresa"
      ? Math.min(Math.floor(añosTrabajados), 11) * (sueldoBase + promedioRemuneracionVariable)
      : 0;

    // Pago por aviso previo (solo si aplica)
    const pagoAvisoPrevio = causa === "Art. 161: Necesidades de la empresa" ? sueldoBase : 0;

    // Cálculo final del finiquito
    const totalFiniquito =
      sueldoBase +
      otrasRemuneracionesImponibles +
      otrasRemuneracionesNoImponibles +
      promedioRemuneracionVariable +
      pagoVacaciones +
      indemnizacionAñosServicio +
      pagoAvisoPrevio;

    const formattedFiniquito = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(totalFiniquito);

    setFiniquito(formattedFiniquito);
  };

  return (
    <div className="container mt-4">
      <h2>Cálculo de Finiquito</h2>
      <div className="mb-3">
        <label className="form-label">Causa de Finalización</label>
        <select className="form-select" value={causa} onChange={(e) => setCausa(e.target.value)}>
          {[
            "Art. 159 número 2: Renuncia",
            "Art. 159 número 4: Vencimiento del plazo convenido",
            "Art. 161: Necesidades de la empresa"
          ].map((opt, index) => (
            <option key={index} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {[{ label: "Fecha de Ingreso", value: fechaIngreso, setter: setFechaIngreso },
        { label: "Fecha Fin de Contrato", value: fechaFin, setter: setFechaFin },
        { label: "Días de Vacaciones Tomados", value: diasVacacionesTomados, setter: setDiasVacacionesTomados },
        { label: "Sueldo Base", value: sueldoBase, setter: setSueldoBase },
        { label: "Otras Remuneraciones Imponibles", value: otrasRemuneracionesImponibles, setter: setOtrasRemuneracionesImponibles },
        { label: "Otras Remuneraciones No Imponibles", value: otrasRemuneracionesNoImponibles, setter: setOtrasRemuneracionesNoImponibles }
      ].map((field, index) => (
        <div className="mb-3" key={index}>
          <label className="form-label">{field.label}</label>
          <input type={field.label.includes("Fecha") ? "date" : "number"} className="form-control" value={field.value} onChange={handleInputChange(field.setter)} />
        </div>
      ))}

      <div className="mb-3">
        <label className="form-label">Remuneración Variable</label>
        <div className="form-check">
          <input className="form-check-input" type="radio" id="si" checked={remuneracionVariable} onChange={() => setRemuneracionVariable(true)} />
          <label className="form-check-label" htmlFor="si">Sí</label>
        </div>
        <div className="form-check">
          <input className="form-check-input" type="radio" id="no" checked={!remuneracionVariable} onChange={() => setRemuneracionVariable(false)} />
          <label className="form-check-label" htmlFor="no">No</label>
        </div>
      </div>

      {remuneracionVariable && (
        <div className="mb-3">
          <label className="form-label">Remuneración Variable por Mes</label>
          {Object.keys(remuneracionVariableMeses).map((month) => (
            <div className="col" key={month}>
              <label className="form-label text-capitalize">{month}</label>
              <input type="number" className="form-control" value={remuneracionVariableMeses[month]} onChange={handleVariableChange(month)} />
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-primary" onClick={calcularFiniquito}>Calcular Finiquito</button>
      {finiquito && <div className="mt-3">Total Finiquito: {finiquito}</div>}
    </div>
  );
};

export default FiniquitoCalculo;