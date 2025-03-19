import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const BoletasCalculator = () => {
  const [monto, setMonto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [total, setTotal] = useState(null);

  const calcularTotal = () => {
    const totalCalculado = parseFloat(monto) * parseInt(cantidad, 10);
    setTotal(totalCalculado.toFixed(2));
  };

  return (
    <div className="container mt-4">
      <h2>Calculadora de Boletas</h2>
      <div className="mb-3">
        <label htmlFor="monto" className="form-label">
          Monto por Boleta (en $):
        </label>
        <input
          type="number"
          className="form-control"
          id="monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="cantidad" className="form-label">
          Cantidad de Boletas:
        </label>
        <input
          type="number"
          className="form-control"
          id="cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={calcularTotal}>
        Calcular Total
      </button>
      {total !== null && (
        <div className="alert alert-success mt-3">
          <strong>Total Calculado:</strong> ${total}
        </div>
      )}
    </div>
  );
};

export default BoletasCalculator;