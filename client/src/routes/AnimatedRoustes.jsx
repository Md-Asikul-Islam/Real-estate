import {  AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import ScrollManager from "../components/animation/ScrollManager";

import MainRoutes from "./MainRoutes";
import AuthRoutes from "./AuthRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import PageWrapper from "../components/animation/PageWrapper.jsx";
import NotFound from "../pages/NotFound";




const AnimatedRoutes = () => {
  const location = useLocation();

  return (
<>
      <ScrollManager />

      <AnimatePresence mode="wait">
        <PageWrapper key={location.pathname}>
          <Routes location={location} key={location.pathname}>
            {MainRoutes}
            {AuthRoutes}
            {ProtectedRoutes}
            <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
          </Routes>
        </PageWrapper>
      </AnimatePresence>
    </>
  );
};

export default AnimatedRoutes;
