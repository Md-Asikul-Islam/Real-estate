import { Route } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import PageWrapper from "../components/animation/PageWrapper";
import { lazy, Suspense } from "react";

const SignUp = lazy(() => import("../pages/auth/SignUp"));
const SignIn = lazy(() => import("../pages/auth/SignIn"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("../pages/auth/VerifyEmail"));
const VerifyOtp = lazy(() => import("../pages/auth/VerifyOtp"));

const AuthRoutes = (
  <Route element={<AuthLayout />}>
    <Route path="sign-up" element={<PageWrapper><SignUp /></PageWrapper>} />
    <Route path="sign-in" element={<PageWrapper><SignIn /></PageWrapper>} />
    <Route path="forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
    <Route path="reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />
    <Route path="verify-email" element={<PageWrapper><VerifyEmail /></PageWrapper>} />
    <Route path="verify-otp" element={<PageWrapper><VerifyOtp /></PageWrapper>} />
  </Route>
);

export default AuthRoutes;
