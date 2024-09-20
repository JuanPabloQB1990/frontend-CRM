import { createContext, useCallback, useEffect, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [message, setMessage] = useState({ title: "", msg: "", type: "" });
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const [clients, setClients] = useState([]);
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("authentication")) || {});
  const [loading, setLoading] = useState(false);

  const getUsersAll = useCallback(
    async () => {
      setLoading(true);
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
      };
  
      try {
        const res = await fetch("http://localhost:4000/users", options);
        const data = await res.json();
        setClients(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [auth.token],
  )
  
  useEffect(() => {
    if (auth.rol === "admin") {
      getUsersAll();
    }
  }, [auth.rol, getUsersAll]);
  

  const registerUser = async (user) => {

    setLoading(true);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    };

    try {
      const res = await fetch("http://localhost:4000/users", options);
      const data = await res.json();

      if (res.ok) {
        setMessage({});
        setMessage({
          title: data.message,
          msg: "Ya puedes iniciar sesion",
          type: "success",
        });
      }

      if (res.status === 400) {
        setMessages(data);
      }

      if (res.status === 404) {
        setMessage({});
        setMessage({ title: "Error", msg: data.message, type: "error" });
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const postClient = async (token, user) => {

    setLoading(true);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(user),
    };

    try {
      const res = await fetch("http://localhost:4000/users/client", options);
      const data = await res.json();

      if (res.ok) {
        setMessage({});
        setMessage({
          title: data.message,
          msg: "satisfactoriamente",
          type: "success",
        });
      }

      if (res.status === 400) {
        setMessages(data);
      }

      if (res.status === 404) {
        setMessage({});
        setMessage({ title: "Error", msg: data.message, type: "error" });
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const loginUser = async (user) => {
    setLoading(true);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    };

    try {
      const res = await fetch("http://localhost:4000/users/user", options);
      const data = await res.json();
      if (res.ok) {
        setAuth(data);
        localStorage.setItem("authentication", JSON.stringify(data));
        return res;
      }

      if (res.status === 400) {
        setMessages(data);
      }

      if (res.status === 404 || res.status === 406) {
        setMessage({ title: "Error", msg: data.message, type: "error" });
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserById = async (id) => {
    if (auth.token !== undefined) {
      try {
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.token,
          },
        };

        const res = await fetch(
          `http://localhost:4000/users/user/${id}`,
          options
        );
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log(error);
      }
    }
    return null;
  };

  const updateUserByAdmin = async (client) => {
    setLoading(true);
    const clientUpdate = {
      id: client.id,
      name: client.name,
      email: client.email,
    };
    console.log(clientUpdate);
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth.token,
      },
      body: JSON.stringify(clientUpdate),
    };

    try {
      const res = await fetch("http://localhost:4000/users/user", options);
      const data = await res.json();

      if (res.ok) {
        setMessage({})
        setMessage({
          title: data.message,
          msg: "Satisfactoriamente",
          type: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const updateUserByClient = async (client) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("id", client.id);
    formData.append("name", client.name);
    formData.append("email", client.email);
    formData.append("country", client.country);
    formData.append("city", client.city);
    formData.append("image", client.image);

    const options = {
      method: "PUT",
      headers: {
        Authorization: auth.token,
      },
      body: formData,
    };

    try {
      const res = await fetch("http://localhost:4000/users/client", options);
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setMessage({});
        setMessage({
          title: data.message,
          msg: "Satisfactoriamente",
          type: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const deleteClientById = async (id) => {
    const options = {
      method: "DELETE",
      headers: { Authorization: auth.token },
    };

    try {
      const res = await fetch(
        `http://localhost:4000/users/client/${id}`,
        options
      );
      const data = await res.json();

      if (res.ok) {
        setMessage({});
        setMessage({
          title: data.message,
          msg: "Satisfactoriamente",
          type: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteClients = async (ids) => {

    const options = {
      method: "DELETE",
      body: JSON.stringify(ids),
      headers: {
        "Content-Type": "application/json",
        "Authorization": auth.token,
      },
    };

    try {
      const res = await fetch("http://localhost:4000/users", options);
      const data = await res.json();
      if (res.ok) {
        setMessage({});
        setMessage({
          title: data.message,
          msg: "Satisfactoriamente",
          type: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        registerUser,
        loginUser,
        message,
        messages,
        auth,
        getUserById,
        user,
        clients,
        loading,
        updateUserByAdmin,
        deleteClientById,
        deleteClients,
        updateUserByClient,
        getUsersAll,
        setMessage,
        setLoading,
        postClient
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
