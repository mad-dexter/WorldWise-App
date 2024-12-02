import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/FakeAuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isAutheticated } = useAuth();
  const navigation = useNavigate();

  useEffect(
    function () {
      if (!isAutheticated) navigation("/");
    },
    [isAutheticated, navigation]
  );

  return isAutheticated ? children : null;
}

export default ProtectedRoute;
