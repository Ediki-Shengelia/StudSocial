import { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { path } from "../routes/path";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [err, setErr] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErr(""); // clear error while typing
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    try {
      await login(form);
      navigate(path.dashboard, { replace: true });
    } catch (error) {
      setErr(error?.response?.data?.message || error?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-500/30 flex items-center justify-center">
            <span className="text-emerald-300 font-bold text-lg">S</span>
          </div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Log in to continue to StudSocial
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30 space-y-4"
        >
          {/* Email */}
          <div>
            <label className="text-xs text-zinc-400">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="mt-1 w-full rounded-xl bg-zinc-950/60 px-3 py-2 text-sm text-white
                         ring-1 ring-white/10 placeholder:text-zinc-500
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-zinc-400">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              className="mt-1 w-full rounded-xl bg-zinc-950/60 px-3 py-2 text-sm text-white
                         ring-1 ring-white/10 placeholder:text-zinc-500
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
            />
          </div>

          {/* Error */}
          {err ? (
            <div className="text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {err}
            </div>
          ) : null}

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white
                       hover:bg-emerald-500 active:scale-[0.99] transition"
          >
            Login
          </button>

          {/* Footer */}
          <p className="text-center text-xs text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link
              to={path.register}
              className="text-emerald-300 hover:text-emerald-200 underline underline-offset-4"
            >
              Register
            </Link>
          </p>
         <Link to={path.restoreuser}>
            Restore your Account
         </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;