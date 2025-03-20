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
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);

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

  useEffect(() => {
    const obtenerCiudades = async () => {
      const ciudadesDisponibles = await fetchCiudades();
      setCiudades(ciudadesDisponibles);
      setCiudadesFiltradas(ciudadesDisponibles);
      setLoading(false);
    };

    obtenerCiudades();

    // Detectar si el teclado está activo
    const handleResize = () => {
      setIsKeyboardActive(window.innerHeight < document.documentElement.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  const handleSelectCiudad = (ciudad) => {
    setComuna(ciudad);
    setBusqueda("");
    setCiudadesFiltradas([]);
  };

  return (
    <div className={`farmacia-turno-container ${isKeyboardActive ? "keyboard-active" : ""}`}>
      <div className="search-section mb-5">
        <h2 className="text-center mb-4">
          <i className="bi bi-capsule me-2"></i>
          Farmacias de Turno
        </h2>

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
    </div>
  );
};

export default FarmaciaTurno;