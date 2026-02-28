import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postsApi } from "../posts/temp";
import { path } from "../routes/path";

const RestoreUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await postsApi.checkEmail(email);
      setValidated(res.data.exists);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }

  async function PasswordChangeFunc(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = { email, password };
      const response = await postsApi.restorePassword(payload);

      setPassword("");
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate(path.dashboard);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Restore Password</h2>

        {validated ? (
          <form onSubmit={PasswordChangeFunc} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              readOnly
              className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
            >
              Update Password
            </button>
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
            />
            {!validated && (
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
              >
                Check Email
              </button>
            )}
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default RestoreUser;