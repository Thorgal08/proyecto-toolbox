import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Archivo CSS para estilos personalizados
import BoletasCalculator from './components/boletas/BoletasCalculator';
import FarmaciaTurno from './components/farmaciasTurno/farmaciaTurno';
import Finiquito from './components/finiquitoCalculo/finiquito';
import CalculadoraPlazos from './components/CalculadoraPlazos/CalculadoraPlazos'; // Importar el nuevo componente

function App() {
  const [activeComponent, setActiveComponent] = useState(null); // Estado inicial sin componente activo

  const renderComponent = () => {
    switch (activeComponent) {
      case 'BoletasCalculator':
        return <BoletasCalculator />;
      case 'FarmaciaTurno':
        return <FarmaciaTurno />;
      case 'Finiquito':
        return <Finiquito />;
      case 'CalculadoraPlazos': // Nuevo caso para el componente Calculadora de Plazos
        return <CalculadoraPlazos />;
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4 text-primary">Tool Box V1</h1>
      {activeComponent === null ? (
        // Menú principal estilo Lumia
        <div className="row g-3 justify-content-center">
          <div className="col-6 col-md-4">
            <button
              className="btn btn-light-blue w-100 py-5 shadow-lg rounded-3 text-white"
              onClick={() => setActiveComponent('BoletasCalculator')}
            >
              <i className="bi bi-calculator display-4"></i>
              <p className="mt-2 mb-0">Boletas Calculator</p>
            </button>
          </div>
          <div className="col-6 col-md-4">
            <button
              className="btn btn-mint-green w-100 py-5 shadow-lg rounded-3 text-white"
              onClick={() => setActiveComponent('FarmaciaTurno')}
            >
              <i className="bi bi-shop display-4"></i>
              <p className="mt-2 mb-0">Farmacia Turno</p>
            </button>
          </div>
          <div className="col-6 col-md-4">
            <button
              className="btn btn-golden-yellow w-100 py-5 shadow-lg rounded-3 text-white"
              onClick={() => setActiveComponent('Finiquito')}
            >
              <i className="bi bi-file-earmark-text display-4"></i>
              <p className="mt-2 mb-0">Finiquito</p>
            </button>
          </div>
          <div className="col-6 col-md-4">
            <button
              className="btn btn-purple w-100 py-5 shadow-lg rounded-3 text-white"
              onClick={() => setActiveComponent('CalculadoraPlazos')}
            >
              <i className="bi bi-clock display-4"></i>
              <p className="mt-2 mb-0">Calculadora de Plazos</p>
            </button>
          </div>
        </div>
      ) : (
        // Componente seleccionado
        <div>
          <button
            className="btn btn-secondary mb-3"
            onClick={() => setActiveComponent(null)} // Regresar al menú principal
          >
            <i className="bi bi-arrow-left"></i> Volver al menú
          </button>
          <div className="card p-3 shadow-lg">{renderComponent()}</div>
        </div>
      )}
    </div>
  );
}

export default App;