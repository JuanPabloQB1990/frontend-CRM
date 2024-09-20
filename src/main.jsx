import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { PrimeReactProvider } from "primereact/api";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { BrowserRouter } from "react-router-dom";
import { LayoutProvider } from "./layout/context/layoutcontext.jsx";
import "../styles/layout/layout.scss";
import "../styles/demo/Demos.scss";
import UserProvider from "./context/UserProvider.jsx";
import ProductProvider from "./context/ProductProvider.jsx";
import OrderProvider from "./context/OrderProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>
    <ProductProvider>
      <OrderProvider>
        <BrowserRouter>
          <PrimeReactProvider>
            <LayoutProvider>
              <App />
            </LayoutProvider>
          </PrimeReactProvider>
        </BrowserRouter>
      </OrderProvider>
    </ProductProvider>
  </UserProvider>
);
