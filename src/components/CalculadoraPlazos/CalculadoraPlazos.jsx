import React, { useState } from "react";
import { addDays, isWeekend } from "date-fns";
import { es } from "date-fns/locale";
import { Form, Button, Alert, ListGroup } from "react-bootstrap";

const CalculadoraPlazos = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [dias, setDias] = useState("");
  const [tipoPlazo, setTipoPlazo] = useState("habiles");
  const [materia, setMateria] = useState(""); // Nueva materia seleccionada
  const [fechaFinal, setFechaFinal] = useState(null);
  const [feriadosPersonalizados, setFeriadosPersonalizados] = useState([]);
  const [diasIncluidos, setDiasIncluidos] = useState([]);
  const [diasExcluidos, setDiasExcluidos] = useState([]);
  const [mostrarListaCompleta, setMostrarListaCompleta] = useState(false); // Estado para controlar la lista

  const feriadosNacionales = [
    "01-01", "05-01", "05-21", "07-16", "08-15", "09-18", "09-19", "10-12", "10-31", "11-01", "12-08", "12-25"
  ];

  const materiasLegales = [
    { nombre: "Presentación de recursos administrativos", dias: 5, tipo: "habiles" },
    { nombre: "Pago de cotizaciones previsionales", dias: 10, tipo: "corridos" },
    { nombre: "Apelación en juicio civil", dias: 10, tipo: "habiles" },
    { nombre: "Interposición de querella", dias: 15, tipo: "corridos" },
    { nombre: "Prescripción de deudas laborales", dias: 60, tipo: "corridos" },
    { nombre: "Prescripción de acciones civiles", dias: 5 * 365, tipo: "corridos" }, // 5 años
  ];

  const esFeriado = (fecha) => {
    const fechaFormato = fecha.toISOString().slice(5, 10);
    return (
      feriadosNacionales.includes(fechaFormato) ||
      feriadosPersonalizados.includes(fechaFormato) ||
      diasExcluidos.includes(fecha.toISOString().slice(0, 10))
    );
  };

  const calcularFecha = () => {
    if (!fechaInicio || !dias) return;
    let fecha = new Date(fechaInicio);
    let diasRestantes = parseInt(dias);
    const diasConsiderados = [];

    while (diasRestantes > 0) {
      fecha = addDays(fecha, 1);
      if (
        tipoPlazo === "corridos" ||
        (tipoPlazo === "habiles" && !isWeekend(fecha) && !esFeriado(fecha)) ||
        (tipoPlazo === "habiles-administrativos" && !isWeekend(fecha) && !esFeriado(fecha))
      ) {
        diasRestantes--;
        diasConsiderados.push(fecha.toISOString().slice(0, 10));
      }
    }

    setFechaFinal(
      fecha.toLocaleDateString("es-CL", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        locale: es,
      })
    );
    setDiasIncluidos(diasConsiderados);
  };

  const reiniciarAjustes = () => {
    setFeriadosPersonalizados([]);
    setDiasIncluidos([]);
    setDiasExcluidos([]);
    setFechaFinal(null);
    setDias("");
    setMateria("");
  };

  const manejarCambioMateria = (materiaSeleccionada) => {
    const materiaEncontrada = materiasLegales.find((m) => m.nombre === materiaSeleccionada);
    if (materiaEncontrada) {
      setDias(materiaEncontrada.dias);
      setTipoPlazo(materiaEncontrada.tipo);
    }
    setMateria(materiaSeleccionada);
  };

  return (
    <div className="container mt-4">
      <h2>Calculadora de Plazos Legales</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Materia Legal</Form.Label>
          <Form.Select
            value={materia}
            onChange={(e) => manejarCambioMateria(e.target.value)}
          >
            <option value="">Selecciona una materia</option>
            {materiasLegales.map((materia, index) => (
              <option key={index} value={materia.nombre}>
                {materia.nombre}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Fecha de Inicio</Form.Label>
          <Form.Control
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Número de Días</Form.Label>
          <Form.Control
            type="number"
            value={dias}
            onChange={(e) => setDias(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tipo de Plazo</Form.Label>
          <Form.Select
            value={tipoPlazo}
            onChange={(e) => setTipoPlazo(e.target.value)}
          >
            <option value="habiles">Días Hábiles</option>
            <option value="corridos">Días Corridos</option>
            <option value="habiles-administrativos">
              Días Hábiles Administrativos
            </option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" onClick={calcularFecha} className="me-2">
          Calcular
        </Button>
        <Button variant="secondary" onClick={reiniciarAjustes}>
          Reiniciar Ajustes
        </Button>
      </Form>
      {fechaFinal && (
        <Alert variant="success" className="mt-3">
          La fecha final del plazo es: <strong>{fechaFinal}</strong>
        </Alert>
      )}
      {diasIncluidos.length > 0 && (
        <div className="mt-3">
          <h5>Días considerados:</h5>
          <p>
            Desde: <strong>{diasIncluidos[0]}</strong> hasta:{" "}
            <strong>{diasIncluidos[diasIncluidos.length - 1]}</strong>
          </p>
          {diasIncluidos.length > 10 && !mostrarListaCompleta && (
            <p>
              Mostrando los primeros y últimos días.{" "}
              <Button
                variant="link"
                onClick={() => setMostrarListaCompleta(true)}
              >
                Ver todos
              </Button>
            </p>
          )}
          {mostrarListaCompleta ? (
            <ListGroup>
              {diasIncluidos.map((dia, index) => (
                <ListGroup.Item key={index}>{dia}</ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <ListGroup>
              {diasIncluidos.slice(0, 5).map((dia, index) => (
                <ListGroup.Item key={index}>{dia}</ListGroup.Item>
              ))}
              <ListGroup.Item>...</ListGroup.Item>
              {diasIncluidos.slice(-5).map((dia, index) => (
                <ListGroup.Item key={index}>{dia}</ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculadoraPlazos;