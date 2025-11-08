import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation,Outlet } from "react-router-dom";

// Layouts
import MainLayout from "../layout/MainLayout";
import AuthLayout from "../layout/AuthLayout";
// import AdminLayout from "../layout/AdminLayout";
import ProtectedRoute from "../layout/ProtectedLayout";

// Pages
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";


import PropertyCreate from "../pages/properties/PropertyCreate";
import PropertyEdit from "../pages/properties/PropertyEdit";
import PropertyList from "../pages/properties/PropertyList";


import Profile from "../pages/Profile";

// Auth Pages
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import VerifyOtp from "../pages/auth/VerifyOtp";

// Wrapper & Others
import PageWrapper from "../components/PageWrapper";
import NotFound from "../pages/NotFound";
import MyProperties from './../pages/properties/MyProperties';
import PropertyDetails from "../pages/properties/PropertyDetails";





const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ===== Main Layout Routes ===== */}
        <Route element={<MainLayout />}>
          <Route index element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          {/* Property browsing */}
          
           <Route path="properties" element={<Outlet />}>
            <Route index element={<PageWrapper><PropertyList type="all" /></PageWrapper>} />        {/* /properties */}
            <Route path="buy" element={<PageWrapper><PropertyList type="buy" /></PageWrapper>} />  {/* /properties/buy */}
            <Route path="rent" element={<PageWrapper><PropertyList type="rent" /></PageWrapper>} />{/* /properties/rent */}
            <Route path="sale" element={<PageWrapper><PropertyList type="sale" /></PageWrapper>} />{/* /properties/sale */}
            <Route path=":id" element={<PageWrapper><PropertyDetails /></PageWrapper>} />
          </Route>
          
        </Route>

        {/* ===== Auth Layout Routes ===== */}
        <Route  element={<AuthLayout />}>
          <Route path="sign-up" element={<PageWrapper><SignUp /></PageWrapper>} />
          <Route path="sign-in" element={<PageWrapper><SignIn /></PageWrapper>} />
          <Route path="forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
          <Route path="reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />
          <Route path="verify-email" element={<PageWrapper><VerifyEmail /></PageWrapper>} />
          <Route path="verify-otp" element={<PageWrapper><VerifyOtp /></PageWrapper>} />
          
        </Route>
         {/*  Protected User Routes */}
        <Route element={<ProtectedRoute />}>
         <Route path="profile" element={<PageWrapper><Profile /></PageWrapper>} />
         <Route path="properties/create" element={<PageWrapper><PropertyCreate /> </PageWrapper>} />
         <Route path="properties/edit/:id" element={<PageWrapper><PropertyEdit /></PageWrapper>} />
         <Route path="my-properties" element={<PageWrapper><MyProperties/></PageWrapper>} />
        </Route>

        {/* <Route element={<AdminLayout />}>
           
        </Route> */}

        {/* ===== Catch-all Route ===== */}
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />

      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
