import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const Presentacion = () => {
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token){
            setLogged(true);
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token');
        setLogged(false);
    }

    return (
        <div>
            {!logged && (
                <Link to='/auth/login'>Iniciar Sesion</Link>
            )

            }
            {logged && (
                <button onClick={handleLogout}>Cerrar Sesión</button>
            )}
            <section >
                <h1 className="titulo"> BIENVENIDO A GIMNASIO POWER HOUSE </h1>
                <h1 className="subtitulo">Tu destino para una vida más saludable y activa</h1>
                <h1 className="subtitulo2">Estamos dedicados a ayudarte a lograr tus objetivos de acondicionamiento físico y bienestar</h1>
                <h1 className="subtitulo2">Ofrecemos una amplia gama de servicios y comodidades para tu beneficio</h1>
            </section>
        </div>
    );
  };
  export default Presentacion;
