import { Route, Outlet } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import PageWrapper from "../components/animation/PageWrapper";

// ✅ Lazy load all major pages
import { lazy, Suspense } from "react";
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const PropertyList = lazy(() => import("../pages/properties/PropertyList"));
const PropertyDetails = lazy(() => import("../pages/properties/PropertyDetails"));

const MainRoutes = (
  <Route element={<MainLayout />}>
    <Route
      index
      element={
        <Suspense fallback={<div className="p-10 text-center text-gray-400">Loading...</div>}>
          <PageWrapper><Home /></PageWrapper>
        </Suspense>
      }
    />
    <Route path="about" element={<PageWrapper><About /></PageWrapper>} />
    <Route path="contact" element={<PageWrapper><Contact /></PageWrapper>} />
    
    <Route path="properties" element={<Outlet />}>
      <Route index element={<PageWrapper><PropertyList type="all" /></PageWrapper>} />
      <Route path="buy" element={<PageWrapper><PropertyList type="buy" /></PageWrapper>} />
      <Route path="rent" element={<PageWrapper><PropertyList type="rent" /></PageWrapper>} />
      <Route path="sale" element={<PageWrapper><PropertyList type="sale" /></PageWrapper>} />
      <Route path=":id" element={<PageWrapper><PropertyDetails /></PageWrapper>} />
    </Route>
  </Route>
);

export default MainRoutes;
