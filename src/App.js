import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./paginas/Login";
import Presentacion from "./paginas/Presentacion";
import Inventory from "./paginas/Inventory";
import Layout from "./Layout";
import Users from "./paginas/Users";
import UserCreation from "./paginas/UserCreation";
import Client from "./paginas/Client";
import RoutinesPage from "./paginas/Routines";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
      <Layout/>
        <Routes>
          <Route path="/" element={<Presentacion />} />
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/create" element={<UserCreation />} />
          <Route path="/client/:identification" element={<Client />} />
          <Route path="/routines" element={<RoutinesPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
