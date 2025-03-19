import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FiniquitoCalculo = () => {
  const [salario, setSalario] = useState("");
  const [diasTrabajados, setDiasTrabajados] = useState("");
  const [finiquito, setFiniquito] = useState(null);

  const calcularFiniquito = () => {
    const salarioDiario = parseFloat(salario) / 30;
    const totalFiniquito = salarioDiario * parseInt(diasTrabajados, 10);
    setFiniquito(totalFiniquito.toFixed(2));
  };

  return (
    <div className="container mt-4">
      <h2>Cálculo de Finiquito</h2>
      <div className="mb-3">
        <label htmlFor="salario" className="form-label">
          Salario Mensual (en $):
        </label>
        <input
          type="number"
          className="form-control"
          id="salario"
          value={salario}
          onChange={(e) => setSalario(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="diasTrabajados" className="form-label">
          Días Trabajados:
        </label>
        <input
          type="number"
          className="form-control"
          id="diasTrabajados"
          value={diasTrabajados}
          onChange={(e) => setDiasTrabajados(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={calcularFiniquito}>
        Calcular Finiquito
      </button>
      {finiquito !== null && (
        <div className="alert alert-success mt-3">
          <strong>Finiquito Calculado:</strong> ${finiquito}
        </div>
      )}
    </div>
  );
};

export default FiniquitoCalculo;