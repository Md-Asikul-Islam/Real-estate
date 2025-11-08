import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { fetchCurrentUser } from "../features/auth/authSlice";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated} = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && !isAuthenticated ) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user, isAuthenticated ]);



  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return (
    <>
      <Header />
      <main className="pt-[73px] min-h-screen bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default ProtectedRoute;
