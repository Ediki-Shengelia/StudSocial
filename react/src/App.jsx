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
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import RestoreUser from './pages/RestoreUser'
function App() {
  return (
    <Routes>
      {/* Guest pages */}
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

      {/* Protected pages */}
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
      <Route
        path={path.EditProfile}
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path={path.profile}
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path={path.restoreuser} element={
        <GuestRoute>
         <RestoreUser/>
        </GuestRoute>
      }/>
    </Routes>
  );
}

export default App;
