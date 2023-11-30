import React, { useState } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import FormComponent from "../components/Forms/FormComponent";
import FormField from "../components/Forms/FormField";
import image1 from '../assets/gym_01.jpg';

const HomePage = () => {
  document.title = 'Power House';
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

    <div className="home_page_container">
      <div className="home_main">
        <h1 className="home_title text-center">BIENVENIDO A POWER HOUSE</h1>
        <div className="home_content">
          <section className="main_section">
            <p>Tu destino para una vida más saludable y activa. Estamos dedicados a ayudarte a lograr tus objetivos de acondicionamiento físico y bienestar, ofreciendo una amplia gama de servicios y comodidades para tu beneficio</p>
            <div className="home_search">
              <div className="home_search_form">
                <FormComponent handleSubmit={handleSubmit} operation="Consultar" model={'por identificación'}>
                  <FormField label={'Identificación'} spanClass={'span_in'}>
                    <input
                      type="text"
                      name="identification"
                      placeholder="Identificación"
                      onChange={handleInputChange}
                      required
                    />
                  </FormField>
                </FormComponent>
              </div>
            </div>
          </section>
          <img src={image1} alt="Gimnasio Power House" className="home_image" />
        </div>
      </div>


    </div>
  );
};

export default HomePage;