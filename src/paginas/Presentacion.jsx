import React, { useEffect } from "react";
import "../estilos/presentacion.css";

const Presentacion = () => {
  useEffect(() => {
    // Aquí puedes agregar cualquier lógica adicional necesaria
  }, []);

  return (
    
    <div className="presentacion-container">
      <div className="header">
      </div>
      <section className="main-section">
        <h1 className="titulo">BIENVENIDO A GIMNASIO POWER HOUSE</h1>
        <h1 className="subtitulo">Tu destino para una vida más saludable y activa</h1>
        <h1 className="subtitulo2">Estamos dedicados a ayudarte a lograr tus objetivos de acondicionamiento físico y bienestar</h1>
        <h1 className="subtitulo2">Ofrecemos una amplia gama de servicios y comodidades para tu beneficio</h1>
      </section>
    </div>
  );
};

export default Presentacion;