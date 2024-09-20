import React, { useContext, useEffect, useRef, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { LayoutContext } from "../layout/context/layoutcontext";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import useUser from "../hooks/useUser";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [checked, setChecked] = useState(false);
  const { layoutConfig } = useContext(LayoutContext);
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [resOk, setResOk] = useState(false);

  const toast = useRef(null);
  const navigate = useNavigate();

  // hook useContext UserProvider
  const { loginUser, message, messages, auth, user, getUserById, setMessage, loading, setLoading } = useUser();

  useEffect(() => {
    getUserById(auth.id);
  }, [auth, getUserById]);

  useEffect(() => {
    if (messages.length > 0) {
      setSubmitted(true);
      messages.forEach((m) => {
        if (m.path === "email") {
          setErrorEmail(m.msg);
        }
        if (m.path === "password") {
          setErrorPassword(m.msg);
        }
      });
    }
  }, [messages]);
  
  useEffect(() => {
    
    if (message.type == "error") {
      
      toast.current.show({
        severity: message.type,
        summary: message.title,
        detail: message.msg,
        life: 3000,
      });
      setMessage({})
    }
  }, [message]);

  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig.inputStyle === "filled" }
  );

  const handleLogin = async () => {
    const userPost = {
      email,
      password,
    };

    const res = await loginUser(userPost);
    
    if (res?.ok) {
      console.log(user);
      setResOk(true);
      setPassword("");
      setEmail("");
      setErrorEmail("");
      setErrorPassword("");

      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 3000);
    }
    
  };

  return (
    <div className={containerClassName}>
      <Toast ref={toast} />
      <div className="flex flex-column align-items-center justify-content-center">
        <div
          style={{
            borderRadius: "56px",
            padding: "0.3rem",
            background:
              "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
          }}
        >
          <div
            className="w-full surface-card py-8 px-5 sm:px-8"
            style={{ borderRadius: "53px" }}
          >
            <div className="text-center mb-5">
              {resOk ? (
                <div className="fadein animation-duration-3000 ">
                  <div className="text-900 text-3xl font-medium mb-3">
                    Hola, {user.name}!
                  </div>
                </div>
              ) : (
                <span className="text-600 font-medium">
                  Ingresa tus datos para Iniciar Sesion
                </span>
              )}
            </div>

            <div>
              <div className="flex justify-content-between">
                <label
                  htmlFor="email1"
                  className="block text-900 text-xl font-medium mb-2"
                >
                  Email
                </label>
                {submitted && errorEmail && (
                  <p className="p-error">{errorEmail}</p>
                )}
              </div>
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email1"
                type="text"
                placeholder="Email address"
                style={{ padding: "1rem", width: "100%", marginBottom: "2rem" }}
                className={classNames({
                  "p-invalid": submitted && errorEmail,
                })}
              />
              <div className="flex justify-content-between">
                <label
                  htmlFor="password1"
                  className="block text-900 font-medium text-xl mb-2"
                >
                  Password
                </label>
                {submitted && errorPassword && (
                  <p className="p-error">{errorPassword}</p>
                )}
              </div>
              <Password
                inputId="password1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                toggleMask
                className={classNames({
                  "p-invalid": submitted && errorPassword,
                })}
                inputClassName="w-full p-3 md:w-30rem"
              ></Password>

              <div className="flex align-items-center justify-content-between mt-5 mb-5 gap-5">
                <div className="flex align-items-center">
                  <Checkbox
                    inputId="rememberme1"
                    checked={checked}
                    onChange={(e) => setChecked(e.checked ?? false)}
                    className="mr-2"
                  ></Checkbox>
                  <label htmlFor="rememberme1">Remember me</label>
                </div>
                <Link
                  to="/register"
                  className="font-medium no-underline ml-2 text-right cursor-pointer"
                  style={{ color: "var(--primary-color)" }}
                >
                  No tienes Cuenta? crea una
                </Link>
              </div>
              <Button
                label="Sign In"
                loading={loading}
                className="w-full p-3 text-xl"
                onClick={() => handleLogin()}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
