import React, { useState, useEffect } from "react";
import "./FarmaciaTurno.css"; // Archivo CSS para estilos personalizados

const FarmaciaTurno = () => {
  const [farmacias, setFarmacias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comuna, setComuna] = useState(""); // Comuna seleccionada
  const [busqueda, setBusqueda] = useState(""); // Texto ingresado por el usuario
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState([]); // Ciudades filtradas

  const fetchCiudades = async () => {
    const url = "https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data)) {
        const ciudadesUnicas = [...new Set(data.map((farmacia) => farmacia.comuna_nombre))];
        return ciudadesUnicas.sort(); // Ordenar alfabéticamente
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error al obtener las ciudades:", error);
      return [];
    }
  };

  const fetchFarmaciasTurno = async (comuna) => {
    const url = "https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php";

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const data = await response.json();
      console.log("Datos de la API:", data); // Verificar los datos que devuelve la API
      if (data && Array.isArray(data)) {
        const farmaciasFiltradas = data.filter(
          (farmacia) => farmacia.comuna_nombre && farmacia.comuna_nombre.toLowerCase() === comuna.toLowerCase()
        );
        console.log("Farmacias filtradas:", farmaciasFiltradas); // Verificar las farmacias filtradas
        return farmaciasFiltradas;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error al obtener las farmacias de turno:", error);
      return [];
    }
  };

  useEffect(() => {
    const obtenerCiudades = async () => {
      const ciudadesDisponibles = await fetchCiudades();
      setCiudades(ciudadesDisponibles);
      setCiudadesFiltradas(ciudadesDisponibles); // Inicialmente, todas las ciudades están disponibles
      setLoading(false); // Finalizar la carga
    };

    obtenerCiudades();
  }, []);

  useEffect(() => {
    if (comuna) {
      const obtenerFarmacias = async () => {
        setLoading(true);
        const farmaciasFiltradas = await fetchFarmaciasTurno(comuna);
        setFarmacias(farmaciasFiltradas); // Mostrar todas las farmacias sin filtrar por horario
        setLoading(false); // Finalizar la carga
      };

      obtenerFarmacias();
    }
  }, [comuna]);

  // Filtrar ciudades en tiempo real según el texto ingresado
  useEffect(() => {
    const filtradas = ciudades.filter((ciudad) =>
      ciudad.toLowerCase().includes(busqueda.toLowerCase())
    );
    setCiudadesFiltradas(filtradas);
  }, [busqueda, ciudades]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Farmacias de Turno</h2>
      <div className="mb-3 position-relative">
        <label htmlFor="busqueda" className="form-label">
          <strong>Busca tu ciudad:</strong>
        </label>
        <input
          id="busqueda"
          type="text"
          className="form-control"
          placeholder="Escribe el nombre de tu ciudad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {busqueda && ciudadesFiltradas.length > 0 && (
          <ul className="list-group position-absolute w-100 mt-1" style={{ zIndex: 1000 }}>
            {ciudadesFiltradas.map((ciudad) => (
              <li
                key={ciudad}
                className={`list-group-item ${ciudad === comuna ? "active" : ""}`}
                onClick={() => {
                  setComuna(ciudad);
                  setBusqueda(""); // Limpiar el campo de búsqueda
                  setCiudadesFiltradas([]); // Ocultar la lista después de seleccionar
                }}
                style={{ cursor: "pointer" }}
              >
                {ciudad}
              </li>
            ))}
          </ul>
        )}
      </div>
      {comuna && (
        <div className="alert alert-info text-center rounded-pill shadow-sm fixed-top">
          <strong>Mostrando farmacias en:</strong> {comuna}
        </div>
      )}
      {loading ? (
        <div className="text-center mt-5">
          <p>Cargando farmacias...</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
          {farmacias.map((farmacia) => (
            <div key={farmacia.local_id} className="col">
              <div className="card shadow-lg h-100 rounded-3 farmacia-card">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title text-primary text-center">
                      <i className="bi bi-shop display-5"></i>
                      <br />
                      {farmacia.local_nombre}
                    </h5>
                    <p className="card-text mt-3">
                      <i className="bi bi-geo-alt-fill text-danger"></i>{" "}
                      <strong>Dirección:</strong> {farmacia.local_direccion}
                    </p>
                    <p className="card-text">
                      <i className="bi bi-telephone-fill text-success"></i>{" "}
                      <strong>Teléfono:</strong> {farmacia.local_telefono || "No disponible"}
                    </p>
                    <p className="card-text">
                      <i className="bi bi-building text-info"></i>{" "}
                      <strong>Ciudad:</strong> {farmacia.comuna_nombre}
                    </p>
                  </div>
                  <div className="mt-3">
                    <p className="card-text">
                      <i className="bi bi-calendar-event text-warning"></i>{" "}
                      <strong>Horario:</strong> {farmacia.funcionamiento_hora_apertura} - {farmacia.funcionamiento_hora_cierre}
                    </p>
                    <p className="card-text">
                      <i className="bi bi-clock-history text-primary"></i>{" "}
                      <strong>Día de Turno:</strong> {farmacia.funcionamiento_dia}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FarmaciaTurno;