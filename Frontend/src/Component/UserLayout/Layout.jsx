import React from "react";
import Navbar from "../Common/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../Common/Footer";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;