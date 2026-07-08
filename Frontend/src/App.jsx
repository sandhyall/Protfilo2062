import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./Component/UserLayout/Layout";
import ScrollToTop from "./Component/ui/ScrollToTop";
import Landing from "./Component/UserLayout/Landing";
import Aboutus from "./Component/Common/Aboutus";
import ContactUsPage from "./Pages/Contactuspage";
import OurServices from "./Pages/OurServices";
import Project from "./Pages/Project";
import NotFound from "./Pages/NotFound";
import ChatbotWidget from "./Component/Chat/ChatbotWidget";
import { ChatProvider } from "./context/ChatContext.jsx";
import { trackVisit } from "./utils/trackVisits.jsx" // ← add this import

// Paths where the chat widget IS allowed to appear.
// Keep this in sync with the <Route path="..."> values below.
const VALID_PATHS = ["/", "/about", "/contact", "/services", "/projects"];

// Renders the widget only if the current path matches one of VALID_PATHS.
const ChatWidgetGate = () => {
  const { pathname } = useLocation();
  const isValidPath = VALID_PATHS.includes(pathname);

  if (!isValidPath) return null;
  return <ChatbotWidget />;
};

// Fires a visit-tracking request every time the route changes.
// Renders nothing — must sit inside <BrowserRouter> to use useLocation().
// const VisitTracker = () => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     trackVisit(pathname);
//   }, [pathname]);

//   return null;
// };

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ChatProvider>
          <ScrollToTop />
          {/* <VisitTracker /> */}
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="/about" element={<Aboutus />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/services" element={<OurServices />} />
              <Route path="/projects" element={<Project />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>

          <ChatWidgetGate />
        </ChatProvider>
      </BrowserRouter>
    </>
  );
};

export default App;