import React from "react";
import { Outlet, Link } from "react-router-dom";
import { path } from "../routes/path";
const Navigation = () => {
  return (
    <>
      <nav className="fixed top-0 left-0 px-4 py-2 bg-green-500 text-xl text-center flex gap-4 text-white">
        <Link to={path.login} className="px-4 y-2 hover:bg-red-200 hover:scale-105 hover:text-black">Login</Link>
        <Link to={path.register} className="px-4 y-2 hover:bg-red-200 hover:scale-105 hover:text-black">Register</Link>
      </nav>
      <Outlet />
    </>
  );
};

export default Navigation;
