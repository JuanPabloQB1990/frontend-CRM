import React, { useContext, useEffect, useRef, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { LayoutContext } from "../layout/context/layoutcontext";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import useUser from "../hooks/useUser";
import { Toast } from "primereact/toast";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  // estados de los inputs del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat_password, setRepeat_password] = useState("");
  const [checked, setChecked] = useState(false);

  //otros estados
  const [submitted, setSubmitted] = useState(false);
  const [errorName, setErrorName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorRepeatPasword, setErrorRepeatPasword] = useState("");

  const { layoutConfig } = useContext(LayoutContext);
  const toast = useRef(null);
  const { registerUser, message, messages, setMessage, loading } =
    useUser();

  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig.inputStyle === "filled" }
  );

  useEffect(() => {
    if (messages.length > 0) {
      setSubmitted(true);
      messages.forEach((m) => {
        if (m.path === "email") {
          setErrorEmail(m.msg);
        }
        if (m.path === "name") {
          setErrorName(m.msg);
        }
        if (m.path === "password") {
          setErrorPassword(m.msg);
        }
        if (m.path === "repeat_password") {
          setErrorRepeatPasword(m.msg);
        }
      });
    }
  }, [messages]);

  useEffect(() => {
    
    if (message.type) {
      toast.current.show({
        severity: message.type,
        summary: message.title,
        detail: message.msg,
        life: 3000,
      });
      setMessage({});

      if (message.type === "success") {
        setName("");
        setEmail("");
        setPassword("");
        setRepeat_password("");

        setSubmitted(false);
      }
    }
  }, [message]);

  const handleRegister = async () => {
    setSubmitted(true);

    const userPost = {
      name,
      email,
      country: "",
      city: "",
      address: "",
      rol: "admin",
      password,
      repeat_password,
    };
    setErrorName("");
    setErrorEmail("");
    setErrorPassword("");
    setErrorRepeatPasword("");

    await registerUser(userPost);

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
              <div className="text-900 text-3xl font-medium mb-3">
                Registrate
              </div>
              <span className="text-600 font-medium">Ingresa los datos</span>
            </div>

            <div>
              <div className="flex justify-content-between">
                <label
                  htmlFor="name"
                  className="block w-6 text-900 text-xl font-medium mb-2"
                >
                  Name
                </label>
                {submitted && errorName && (
                  <p className="p-error">{errorName}</p>
                )}
              </div>
              <InputText
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                type="text"
                placeholder="Name"
                style={{ padding: "1rem", width: "100%", marginBottom: "2rem" }}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && errorName,
                })}
              />
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
                type="email"
                placeholder="Email address"
                style={{ padding: "1rem", width: "100%", marginBottom: "2rem" }}
                required
                autoFocus
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
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && errorPassword,
                })}
                inputClassName="w-full p-3 md:w-30rem"
              ></Password>
              <div className="flex justify-content-between mt-5">
                <label
                  htmlFor="password1"
                  className="block text-900 font-medium text-xl mb-2"
                >
                  Confirm the Password
                </label>
                {submitted && errorRepeatPasword && (
                  <p className="p-error">{errorRepeatPasword}</p>
                )}
              </div>
              <Password
                inputId="repassword1"
                value={repeat_password}
                onChange={(e) => setRepeat_password(e.target.value)}
                placeholder="reapeat Password"
                toggleMask
                inputClassName="w-full p-3 md:w-30rem"
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && errorRepeatPasword,
                })}
              ></Password>

              <div className="flex align-items-center justify-content-between mb-5 mt-5 gap-5">
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
                  to="/login"
                  className="font-medium no-underline ml-2 text-right cursor-pointer"
                  style={{ color: "var(--primary-color)" }}
                >
                  Ya tienes Cuenta?, Ingresa
                </Link>
              </div>
              <Button
                label="Registrar"
                loading={loading}
                className="w-full p-3 text-xl"
                onClick={() => handleRegister()}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
