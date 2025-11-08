import React, { useEffect, useRef } from "react";
import { useDispatch} from "react-redux";
import { Toaster } from "react-hot-toast";
import AnimatedRoutes from "./routes/AnimatedRoustes";
import { fetchCurrentUser } from "./features/auth/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AnimatedRoutes />
    </>
  );
};

export default App;