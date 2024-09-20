import AdminProducts from "./pages/AdminProducts";
import { Route, Routes } from "react-router-dom";
import ClientProducts from "./pages/ClientProducts";
import CartProducts from "./pages/OrderProducts";
import AdminClients from "./pages/AdminClients";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRouters from "./security/ProtectedRoutes";
import ProtectedRoutersAdmin from "./security/ProtectedRoutesAdmin";

function App() {

  return (
    <Routes>
      <Route path="/" element={<ProtectedRouters><Home/></ProtectedRouters>}/>
      <Route path="/admin-products" element={<ProtectedRoutersAdmin><AdminProducts/></ProtectedRoutersAdmin>}/>
      <Route path="/admin-clients" element={<ProtectedRoutersAdmin><AdminClients/></ProtectedRoutersAdmin>}/>
      {/* <Route path="/admin-orders" element={<ProtectedRoutersAdmin><AdminOrders/></ProtectedRoutersAdmin>}/> */}
      <Route path="/client-products/:id" element={<ProtectedRouters><ClientProducts/></ProtectedRouters>}/>
      <Route path="/client-products-cart" element={<ProtectedRouters><CartProducts/></ProtectedRouters>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
    </Routes>
  );
}

export default App;
