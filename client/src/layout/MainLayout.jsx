import React from "react";
import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";


const MainLayout = () => {
  return (
        <>
      <Header />
      <main className="pt-[73px] min-h-screen">
        <Outlet />
      </main>
    
      <Footer />
    </>
  )
}

export default MainLayout