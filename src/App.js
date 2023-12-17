import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import LoginForm from "./pages/Login";
import HomePage from "./pages/Home";
import Machines from "./pages/Machines";
import Layout from "./Layout";
import UserCreation from "./pages/UserCreation";
import Client from "./pages/Client";
import RoutinesPage from "./pages/Routines";
import Transactions from "./pages/Transactions";
import Users from "./pages/Users";
import ExercisesPage from "./pages/Exercises";
import RoutineScheduleDetail from "./pages/RoutineScheduleDetail";
import Maintenance from "./pages/Maintenance";

function App() {
  useEffect(() => {
    document.title = 'Power House';
  }, [])

  return (
    <div className="app">
      <BrowserRouter>
        <Layout />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/machines" element={<Machines />} />
          <Route path="/machines/maintenance/:id" element={<Maintenance />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/transactions/:identification" element={<Transactions />} />
          <Route path="/users/create" element={<UserCreation />} />
          <Route path="/client/:identification" element={<Client />}/>
          <Route path="/client/:identification/routine-schedule/:id" element={<RoutineScheduleDetail />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
