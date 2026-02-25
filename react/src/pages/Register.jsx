import React, { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { path } from "../routes/path";
const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [validationErr, setValidationErr] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  function validation(values) {
    const errors = {
      name: "",
      email: "",
      password: "",
    };

    // 1️⃣ Check name first
    if (!values.name || values.name.length < 5) {
      errors.name = "Min 5 characters";
      return errors;
    }

    // 2️⃣ Then email
    if (!values.email || !values.email.includes("@gmail.com")) {
      errors.email = "Gmail is required";
      return errors;
    }

    if (values.email.split("@")[0].length < 5) {
      errors.email = "Email must have at least 5 characters before @";
      return errors;
    }

    // 3️⃣ Then password
    if (!values.password || values.password.length < 6) {
      errors.password = "Min 6 characters is required";
      return errors;
    }

    return errors;
  }
  const [err, setErr] = useState(null);
  function handleChange(e) {
    const { name, value } = e.target;

    const nextForm = { ...form, [name]: value };
    setForm(nextForm);

    const errors = validation(nextForm);

    setValidationErr(errors);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(form);
      navigate(path.dashboard, { replace: true });
    } catch (error) {
      setErr(error.response.data?.message || "Register failed");
    }
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-fit bg-zinc-200 rounded-lg p-5 shadow-lg shadow-red-200 flex flex-col gap-2"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="border-2 border-red-200 text-right px-4 py-1 text-zinc-800  placeholder:text-center placeholder:text-red-700 focus:outline-green-800 focus:shadow-lg focus:shadow-black"
          id=""
          placeholder="Name"
        />

        {validationErr.name ? <p className="text-white bg-red-500 w-full py-1 text-sm rounded-lg">{validationErr.name}</p> : null}
        <input
          type="email"
          name="email"
          value={form.email}
          className="border-2 border-red-200 text-right px-4 py-1 text-zinc-800  placeholder:text-center placeholder:text-red-700 focus:outline-green-800 focus:shadow-lg focus:shadow-black"
          onChange={handleChange}
          required
          placeholder="Email"
          id=""
        />

        {validationErr.email && <p className="text-white bg-red-500 w-full py-1 px-2 text-sm rounded-lg">{validationErr.email}</p>}
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="border-2 border-red-200 text-right px-4 py-1 text-zinc-800  placeholder:text-center placeholder:text-red-700 focus:outline-green-800 focus:shadow-lg focus:shadow-black"
          placeholder="Password"
          id=""
        />

        {validationErr.password && <p className="text-white bg-red-500 w-full py-1 text-sm rounded-lg">{validationErr.password}</p>}
        <button
          className="w-full rounded-full bg-black text-white hover:bg-white hover:text-black py-2 uppercase text-2xl font-bold cursor-pointer"

          type="submit">Register</button>
        {err ? <p className="max-w-[250px] px-2 text-white bg-red-500 w-full py-1 text-sm rounded-lg">{err}</p> : null}
      </form>
    </div>
  );
};

export default Register;
