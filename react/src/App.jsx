import "./App.css";
import { Route, Routes } from "react-router-dom";
import Navigation from "./nav/Navigation";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ShowPost from "./pages/ShowPost";
import ProtectedRoute from "./auth/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import { path } from "./routes/path";

function App() {
  return (
    <Routes>
      {/* ✅ Guest pages inside Navigation layout */}
      <Route element={<Navigation />}>
        <Route
          path={path.login}
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path={path.register}
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
      </Route>

      {/* ✅ Protected pages without Navigation */}
      <Route
        path={path.dashboard}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
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
    </Routes>
  );
}

export default App;