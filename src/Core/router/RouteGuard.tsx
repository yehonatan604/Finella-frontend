import { Navigate } from "react-router-dom";
import PageHolder from "../../Common/components/layout/PageHolder";

const RouteGuard = ({ isLoggedIn = false }: { isLoggedIn?: boolean }) => {
  const token = localStorage.getItem("token");

  if (isLoggedIn) {
    return token ? <PageHolder /> : <Navigate to="/auth" />;
  } else {
    return !token ? <PageHolder /> : <Navigate to="/" />;
  }
};

export default RouteGuard;
