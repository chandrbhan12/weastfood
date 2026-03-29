import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    // Redirect back to home immediately to match previous behavior
    navigate("/", { replace: true });
  }, [location.pathname, navigate]);

  return null;
};

export default NotFound;
