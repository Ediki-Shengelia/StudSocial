import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { path } from "../routes/path";

const Navigation = () => {
  const location = useLocation();

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-500/30 flex items-center justify-center">
              <span className="text-emerald-300 font-bold">S</span>
            </div>
            <span className="text-lg font-semibold text-white">
              StudSocial
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-3">
            <Link
              to={path.login}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition
                ${
                  location.pathname === path.login
                    ? "bg-emerald-600 text-white"
                    : "text-zinc-300 hover:bg-white/10"
                }`}
            >
              Login
            </Link>

            <Link
              to={path.register}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition
                ${
                  location.pathname === path.register
                    ? "bg-emerald-600 text-white"
                    : "text-zinc-300 hover:bg-white/10"
                }`}
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="min-h-screen bg-zinc-950 text-white pt-4">
        <Outlet />
      </div>
    </>
  );
};

export default Navigation;