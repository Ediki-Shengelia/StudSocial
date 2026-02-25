import { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { path } from "../routes/path";
const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "Test@test.com",
    password: "",
  });
  const [err, setErr] = useState("");
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      await login(form);
      navigate(path.dashboard, { replace: true });
    } catch (error) {
      setErr(
        error?.response?.data?.message || error?.message || "Login failed",
      );
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-fit bg-blue-200 rounded-lg p-5 shadow-lg shadow-red-200 flex flex-col gap-2"
      >
        <input
          type="email"
          name="email"
          required
          className="border-2 border-red-200 text-right px-4 py-1 text-zinc-800  placeholder:text-center placeholder:text-red-700 focus:outline-green-800 focus:shadow-lg focus:shadow-black"
          value={form.email}
          placeholder="Email"
          onChange={handleChange}
          id=""
        />

        <input
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          className="border-2 border-red-200 text-center text-yellow-500 px-4 py-1  placeholder:text-center placeholder:text-red-700 focus:outline-green-800 focus:shadow-lg focus:shadow-black"
          onChange={handleChange}
          required
          id=""
        />

        {err ? <p className="text-white bg-red-500 w-full py-1 text-sm rounded-lg">{err}</p> : null}
        <button 
        className="w-full rounded-full bg-black text-white hover:bg-white hover:text-black py-2 uppercase text-2xl font-bold cursor-pointer"
        type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
