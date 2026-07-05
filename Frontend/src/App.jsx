import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Component/UserLayout/Layout";
import Landing from "./Component/UserLayout/Landing";
import Aboutus from "./Component/Common/Aboutus";
import ContactUsPage from "./Pages/Contactuspage";
import OurServices from "./Pages/OurServices";
import Project from "./Pages/Project";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="/about" element={<Aboutus/>}/>
          <Route path="/contact" element={<ContactUsPage/>}/>
          <Route path="/services" element={<OurServices/>}/>
          <Route path="/projects" element={<Project/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
