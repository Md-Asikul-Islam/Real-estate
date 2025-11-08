import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const AuthLayout = () => {
  return (
    <>
      <Header />
      <main className="pt-[73px] min-h-screen">
        <Outlet />
      </main>
      <Footer/>
    </>
  );
};

export default AuthLayout;