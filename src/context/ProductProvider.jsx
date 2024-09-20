import { createContext, useState } from "react";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState({ title: "", msg: "", type: "" });
  const [loading, setLoading] = useState(false);

  
  
  const postProduct = async (product, token) => {
    
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(product)
    };

    try {
      const res = await fetch("http://localhost:4000/products", options);
      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const getProducts = async (token) => {
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    };

    try {
      const res = await fetch("http://localhost:4000/products", options);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProductById = async (id, token) => {
    const options = {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: token },
    };

    try {
      const res = await fetch(
        `http://localhost:4000/products/product/${id}`,
        options
      );
      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const updateProductById = async (product, token) => {
    
    const options = {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(product)
    };

    try {
      const res = await fetch(
        "http://localhost:4000/products/product",
        options
      );
      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProducts = async (ids, token) => {
    const options = {
      method: "DELETE",
      body: JSON.stringify(ids),
      headers: { "Content-Type": "application/json", Authorization: token },
    };

    try {
      const res = await fetch("http://localhost:4000/products/", options);
      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const getProductsByCategory = async (id, token) => {
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    };

    try {
      const res = await fetch(`http://localhost:4000/products/${id}`, options);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        postProduct,
        getProducts,
        deleteProductById,
        updateProductById,
        deleteProducts,
        getProductsByCategory,
        products,
        message,
        setMessage,
        loading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
