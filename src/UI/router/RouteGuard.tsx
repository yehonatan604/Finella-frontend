import { Navigate } from "react-router-dom";
import useAuth from "../../Auth/hooks/useAuth";
import PageHolder from "../../UI/components/PageHolder";

const RouteGuard = ({ isLoggedIn = false }: { isLoggedIn?: boolean }) => {
  const { user } = useAuth();

  if (isLoggedIn) {
    return user ? <PageHolder /> : <Navigate to="/auth" />;
  } else {
    return !user ? <PageHolder /> : <Navigate to="/" />;
  }
};

export default RouteGuard;
