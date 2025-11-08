import { Route } from "react-router-dom";
import ProtectedLayout from "../layout/ProtectedLayout";
import PageWrapper from "../components/animation/PageWrapper";
import { lazy, Suspense } from "react";

const Profile = lazy(() => import("../pages/Profile"));
const PropertyCreate = lazy(() => import("../pages/properties/PropertyCreate"));
const PropertyEdit = lazy(() => import("../pages/properties/PropertyEdit"));
const MyProperties = lazy(() => import("../pages/properties/MyProperties"));

const ProtectedRoutes = (
  <Route element={<ProtectedLayout />}>
    <Route path="profile" element={<PageWrapper><Profile /></PageWrapper>} />
    <Route path="properties/create" element={<PageWrapper><PropertyCreate /></PageWrapper>} />
    <Route path="properties/edit/:id" element={<PageWrapper><PropertyEdit /></PageWrapper>} />
    <Route path="my-properties" element={<PageWrapper><MyProperties /></PageWrapper>} />
  </Route>
);

export default ProtectedRoutes;
