import React, { useState, useEffect } from "react";
import "./FarmaciaTurno.css";

const FarmaciaTurno = () => {
  const [farmacias, setFarmacias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comuna, setComuna] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [ciudadesFiltradas, setCiudadesFiltradas] = useState([]);
  const [error, setError] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const API_URL = "https://midas.minsal.cl/farmacia_v2/WS/getLocalesTurnos.php";

  const fetchCiudades = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data)) {
        const ciudadesUnicas = [...new Set(data.map((farmacia) => farmacia.comuna_nombre))];
        return ciudadesUnicas.sort();
      } else {
        throw new Error("Formato de datos inesperado");
      }
    } catch (error) {
      console.error("Error al obtener las ciudades:", error);
      setError("No se pudieron cargar las ciudades. Por favor, intente nuevamente más tarde.");
      return [];
    }
  };

  const fetchFarmaciasTurno = async (comuna) => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data)) {
        return data.filter(
          (farmacia) => farmacia.comuna_nombre && 
          farmacia.comuna_nombre.toLowerCase() === comuna.toLowerCase()
        );
      } else {
        throw new Error("Formato de datos inesperado");
      }
    } catch (error) {
      console.error("Error al obtener las farmacias de turno:", error);
      setError("No se pudieron cargar las farmacias. Por favor, intente nuevamente más tarde.");
      return [];
    }
  };

  useEffect(() => {
    const obtenerCiudades = async () => {
      const ciudadesDisponibles = await fetchCiudades();
      setCiudades(ciudadesDisponibles);
      setCiudadesFiltradas(ciudadesDisponibles);
      setLoading(false);
    };

    obtenerCiudades();
  }, []);

  useEffect(() => {
    if (comuna) {
      const obtenerFarmacias = async () => {
        setLoading(true);
        const farmaciasFiltradas = await fetchFarmaciasTurno(comuna);
        setFarmacias(farmaciasFiltradas);
        setLoading(false);
      };

      obtenerFarmacias();
    }
  }, [comuna]);

  useEffect(() => {
    if (busqueda) {
      const filtradas = ciudades.filter((ciudad) =>
        ciudad.toLowerCase().includes(busqueda.toLowerCase())
      );
      setCiudadesFiltradas(filtradas);
    } else {
      setCiudadesFiltradas(ciudades);
    }
  }, [busqueda, ciudades]);

  // Función para manejar la selección de ciudad
  const handleSelectCiudad = (ciudad) => {
    setComuna(ciudad);
    setBusqueda("");
    setCiudadesFiltradas([]);
  };

  // Función para obtener la franja horaria
  const getFranjaHoraria = (horaApertura, horaCierre) => {
    if (!horaApertura || !horaCierre) return "Horario no disponible";
    
    // Convertir a formato de 12 horas para mejor legibilidad
    const formatHora = (hora) => {
      if (!hora) return "";
      const [h, m] = hora.split(":");
      const hr = parseInt(h, 10);
      return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
    };
    
    return `${formatHora(horaApertura)} - ${formatHora(horaCierre)}`;
  };

  return (
    <div className="farmacia-turno-container">
      <div className="search-section mb-5">
        <h2 className="text-center mb-4">
          <i className="bi bi-capsule me-2"></i>
          Farmacias de Turno
        </h2>
        
        {/* Sección de búsqueda */}
        <div className="search-container">
          <div className="input-group mb-3">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              id="busqueda"
              type="text"
              className="form-control form-control-lg shadow-sm"
              placeholder="Busca tu ciudad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              autoComplete="off"
            />
            {busqueda && (
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={() => setBusqueda("")}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
          
          {/* Dropdown de ciudades */}
          {isSearchFocused && ciudadesFiltradas.length > 0 && (
            <div className="dropdown-list shadow-lg">
              {ciudadesFiltradas.map((ciudad) => (
                <div
                  key={ciudad}
                  className={`dropdown-item ${ciudad === comuna ? "active" : ""}`}
                  onClick={() => handleSelectCiudad(ciudad)}
                >
                  <i className="bi bi-geo-alt me-2"></i>
                  {ciudad}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Badge de comuna seleccionada */}
      {comuna && (
        <div className="text-center mb-4">
          <span className="badge bg-primary px-4 py-2 rounded-pill fs-6">
            <i className="bi bi-geo-alt me-2"></i>
            {comuna}
            <button 
              className="btn btn-sm ms-2 text-white"
              onClick={() => setComuna("")}
              title="Cambiar comuna"
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </span>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Indicador de carga */}
      {loading && (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Buscando farmacias de turno...</p>
        </div>
      )}

      {/* Resultados */}
      {!loading && comuna && farmacias.length === 0 && (
        <div className="alert alert-info text-center">
          <i className="bi bi-info-circle me-2"></i>
          No se encontraron farmacias de turno en {comuna}
        </div>
      )}

      {/* Grid de farmacias */}
      {!loading && farmacias.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {farmacias.map((farmacia) => (
            <div key={farmacia.local_id} className="col">
              <div className="card h-100 farmacia-card">
                <div className="card-header text-white text-center py-3">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-shop me-2"></i>
                    {farmacia.local_nombre}
                  </h5>
                </div>
                <div className="card-body">
                  <div className="info-group">
                    <div className="info-icon">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div className="info-content">
                      <strong>Dirección:</strong>
                      <p>{farmacia.local_direccion || "No disponible"}</p>
                    </div>
                  </div>
                  
                  <div className="info-group">
                    <div className="info-icon">
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                    <div className="info-content">
                      <strong>Teléfono:</strong>
                      <p>{farmacia.local_telefono || "No disponible"}</p>
                    </div>
                  </div>
                  
                  <div className="info-group">
                    <div className="info-icon">
                      <i className="bi bi-clock-history"></i>
                    </div>
                    <div className="info-content">
                      <strong>Horario:</strong>
                      <p>
                        {getFranjaHoraria(
                          farmacia.funcionamiento_hora_apertura,
                          farmacia.funcionamiento_hora_cierre
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="info-group">
                    <div className="info-icon">
                      <i className="bi bi-calendar-event"></i>
                    </div>
                    <div className="info-content">
                      <strong>Día de Turno:</strong>
                      <p>{farmacia.funcionamiento_dia || "No especificado"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="card-footer text-center">
                  {farmacia.local_lat && farmacia.local_lng ? (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${farmacia.local_lat},${farmacia.local_lng}`}
                      className="btn btn-outline-primary w-100"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-map me-2"></i>
                      Ver en el mapa
                    </a>
                  ) : (
                    <button className="btn btn-outline-secondary w-100" disabled>
                      <i className="bi bi-map me-2"></i>
                      Ubicación no disponible
                    </button>
                  )}
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