import { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import PageWrapper from "../components/PageWrapper";
import PageSkeleton from "../components/animation/PageSkeleton";
// Main Pages
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));

// Property Pages
const PropertyList = lazy(() => import("../pages/properties/PropertyList"));
const PropertyDetails = lazy(() => import("../pages/properties/PropertyDetails"));

// ===== MainRoutes Component =====
const MainRoutes = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route index element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="contact" element={<PageWrapper><Contact /></PageWrapper>} />

          {/* Property browsing */}
          <Route path="properties" element={<Outlet />}>
            <Route index element={<PageWrapper><PropertyList type="all" /></PageWrapper>} />
            <Route path="buy" element={<PageWrapper><PropertyList type="buy" /></PageWrapper>} />
            <Route path="rent" element={<PageWrapper><PropertyList type="rent" /></PageWrapper>} />
            <Route path="sale" element={<PageWrapper><PropertyList type="sale" /></PageWrapper>} />
            <Route path=":id" element={<PageWrapper><PropertyDetails /></PageWrapper>} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default MainRoutes;
