import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BoletasCalculator from './components/boletas/BoletasCalculator';
import FarmaciaTurno from './components/farmaciasTurno/farmaciaTurno';
import Finiquito from './components/finiquitoCalculo/finiquito';
import CalculadoraPlazos from './components/CalculadoraPlazos/CalculadoraPlazos';

// Configuración de herramientas para centralizar datos y facilitar mantenimiento
const tools = [
  {
    id: 'BoletasCalculator',
    title: 'Boletas Calculator',
    icon: 'bi-calculator',
    color: 'light-blue',
    component: BoletasCalculator
  },
  {
    id: 'FarmaciaTurno',
    title: 'Farmacia Turno',
    icon: 'bi-shop',
    color: 'mint-green',
    component: FarmaciaTurno
  },
  {
    id: 'Finiquito',
    title: 'Finiquito',
    icon: 'bi-file-earmark-text',
    color: 'golden-yellow',
    component: Finiquito
  },
  {
    id: 'CalculadoraPlazos',
    title: 'Calculadora de Plazos',
    icon: 'bi-clock',
    color: 'purple',
    component: CalculadoraPlazos
  }
];

function App() {
  const [activeComponent, setActiveComponent] = useState(null);

  // Función para obtener el componente activo
  const renderComponent = () => {
    const selectedTool = tools.find(tool => tool.id === activeComponent);
    return selectedTool ? <selectedTool.component /> : null;
  };

  return (
    <div className="container-fluid py-4">
      <div className="container">
        <header className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary">Tool Box <span className="badge bg-primary">V1</span></h1>
          <p className="text-muted">Herramientas para facilitar tus cálculos diarios</p>
        </header>

        {activeComponent === null ? (
          // Menú principal con diseño de tarjetas
          <div className="row g-4 justify-content-center">
            {tools.map(tool => (
              <div key={tool.id} className="col-12 col-md-6 col-lg-3">
                <div 
                  className={`card border-0 h-100 tool-card bg-${tool.color} text-white`}
                  onClick={() => setActiveComponent(tool.id)}
                >
                  <div className="card-body d-flex flex-column align-items-center justify-content-center text-center py-4">
                    <i className={`bi ${tool.icon} display-3 mb-3`}></i>
                    <h3 className="card-title h4 mb-3">{tool.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Contenido del componente seleccionado
          <div className="tool-content">
            <nav aria-label="breadcrumb" className="mb-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <button 
                    className="btn btn-link text-decoration-none p-0" 
                    onClick={() => setActiveComponent(null)}
                  >
                    <i className="bi bi-house-door"></i> Inicio
                  </button>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {tools.find(tool => tool.id === activeComponent)?.title}
                </li>
              </ol>
            </nav>
            
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-header bg-white border-0 py-3">
                <h2 className="card-title h5 mb-0">
                  <i className={`bi ${tools.find(tool => tool.id === activeComponent)?.icon} me-2`}></i>
                  {tools.find(tool => tool.id === activeComponent)?.title}
                </h2>
              </div>
              <div className="card-body p-4">
                {renderComponent()}
              </div>
            </div>
          </div>
        )}

        <footer className="text-center mt-5 pt-4 text-muted">
          <small>&copy; {new Date().getFullYear()} Tool Box V1 - Todos los derechos reservados</small>
        </footer>
      </div>
    </div>
  );
}

export default App;