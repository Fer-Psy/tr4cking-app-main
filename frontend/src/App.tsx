import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Usuarios from "./pages/admin/Usuarios";
// import PrivateRoute from "./components/PrivateRoute";
import Login from "./auth/Login";
import EmpLayout from "./layouts/EmpLayout";
import Facturacion from "./pages/admin/Facturacion";
import Empresas from "./pages/admin/Empresas";
import Agencias from "./pages/admin/Agencias";
import Localidades from "./pages/admin/Localidades";
import Rutas from "./pages/admin/Rutas";
import Horarios from "./pages/admin/Horarios";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="facturacion" element={<Facturacion />} />
          <Route path="empresas" element={<Empresas />} />
          <Route path="agencias" element={<Agencias />} />
          <Route path="localidades" element={<Localidades />} />
          <Route path="rutas" element={<Rutas />} />
          <Route path="horarios" element={<Horarios />} />
        </Route>

        <Route path="/empleado" element={<EmpLayout />}>

        </Route>
      </Routes>
    </Router>
  )
}

export default App
