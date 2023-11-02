import React, { useState } from "react";
import "../estilos/presentacion.css";
import { useNavigate } from "react-router-dom";

const Presentacion = () => {

  const [identification, setIdentification] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/client/${identification}`)

  }

  const handleInputChange = (event) => {
    const { value } = event.target;
    setIdentification(value);
  };
  

  return (
    
    <div className="presentacion-container">
      <div className="header">
      </div>
      {/* <div>
        <h2 className="user-main">Bienvenido {user.people.names}</h2>
        {user?.people?.image && (
          <img src={user.people.image} alt={user.people.names} width={150}/>
        )}
      </div> */}
      <section className="main-section">
        <h1 className="titulo">BIENVENIDO A GIMNASIO POWER HOUSE</h1>
        <h1 className="subtitulo">Tu destino para una vida más saludable y activa</h1>
        <h1 className="subtitulo2">Estamos dedicados a ayudarte a lograr tus objetivos de acondicionamiento físico y bienestar</h1>
        <h1 className="subtitulo2">Ofrecemos una amplia gama de servicios y comodidades para tu beneficio</h1>
      </section>

      <form onSubmit={handleSubmit}>
        <label htmlFor="identification_id">Ingrese su identificación para consultar:</label>
        <input
          type="text"
          name="identification"
          id="identification_id"
          placeholder="Identificación"
          onChange={handleInputChange}
          />
        <button>Consultar</button>
      </form>
    </div>
  );
};

export default Presentacion;