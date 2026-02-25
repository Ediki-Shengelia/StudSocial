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

  const [err, setErr] = useState(null);

  function validation(values) {
    const errors = { name: "", email: "", password: "" };

    if (!values.name || values.name.length < 5) {
      errors.name = "Min 5 characters";
      return errors;
    }

    if (!values.email || !values.email.includes("@gmail.com")) {
      errors.email = "Gmail is required";
      return errors;
    }

    if (values.email.split("@")[0].length < 5) {
      errors.email = "Email must have at least 5 characters before @";
      return errors;
    }

    if (!values.password || values.password.length < 6) {
      errors.password = "Min 6 characters is required";
      return errors;
    }

    return errors;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    const nextForm = { ...form, [name]: value };
    setForm(nextForm);

    const errors = validation(nextForm);
    setValidationErr(errors);

    // clear server error when user types
    setErr(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(form);
      navigate(path.dashboard, { replace: true });
    } catch (error) {
      setErr(error?.response?.data?.message || "Register failed");
    }
  }

  const hasErrors =
    !!validationErr.name || !!validationErr.email || !!validationErr.password;

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-500/30 flex items-center justify-center">
            <span className="text-emerald-300 font-bold text-lg">S</span>
          </div>
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Join StudSocial and start posting
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/30 space-y-4"
        >
          {/* Name */}
          <div>
            <label className="text-xs text-zinc-400">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your name"
              className="mt-1 w-full rounded-xl bg-zinc-950/60 px-3 py-2 text-sm text-white
                         ring-1 ring-white/10 placeholder:text-zinc-500
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
            />
            {validationErr.name ? (
              <p className="mt-2 text-xs text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {validationErr.name}
              </p>
            ) : null}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs text-zinc-400">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@gmail.com"
              className="mt-1 w-full rounded-xl bg-zinc-950/60 px-3 py-2 text-sm text-white
                         ring-1 ring-white/10 placeholder:text-zinc-500
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
            />
            {validationErr.email ? (
              <p className="mt-2 text-xs text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {validationErr.email}
              </p>
            ) : null}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-zinc-400">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Min 6 characters"
              className="mt-1 w-full rounded-xl bg-zinc-950/60 px-3 py-2 text-sm text-white
                         ring-1 ring-white/10 placeholder:text-zinc-500
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
            />
            {validationErr.password ? (
              <p className="mt-2 text-xs text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {validationErr.password}
              </p>
            ) : null}
          </div>

          {/* Server error */}
          {err ? (
            <div className="text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {err}
            </div>
          ) : null}

          {/* Submit */}
          <button
            type="submit"
            disabled={hasErrors}
            className="w-full rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white
                       hover:bg-emerald-500 active:scale-[0.99] transition
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Register
          </button>

          {/* Small footer */}
          <p className="text-center text-xs text-zinc-500">
            By registering, you agree to our basic terms.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;