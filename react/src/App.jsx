import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navigation from "./nav/Navigation";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Route, Routes } from "react-router-dom";
import { path } from "./routes/path";
import ShowPost from "./pages/ShowPost";
import ProtectedRoute from "./auth/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
function App() {
  return (
    <Routes>
      {/* ✅ Guest pages WITH navigation */}
      <Route
        path={path.login}
        element={
          <>
            <Navigation />
            <GuestRoute>
              <Login />
            </GuestRoute>
          </>
        }
      />

      <Route
        path={path.register}
        element={
          <>
            <Navigation />
            <GuestRoute>
              <Register />
            </GuestRoute>
          </>
        }
      />
      <Route
        path={path.show}
        element={
          <ProtectedRoute>
            <ShowPost />
          </ProtectedRoute>
        }
      />

      {/* ✅ Dashboard WITHOUT navigation */}
      <Route
        path={path.dashboard}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
