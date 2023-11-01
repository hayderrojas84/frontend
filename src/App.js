import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginForm from "./paginas/Login";
import Presentacion from "./paginas/Presentacion";
import Inventory from "./paginas/Inventory";
import Layout from "./Layout";
import Users from "./paginas/Users";
import UserCreation from "./paginas/UserCreation";

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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
