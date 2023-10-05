import { useEffect, useState } from "react";
import myImage from "../images/header.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Header() {
  const [pageState, setPageState] = useState("Sign In");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleHomeClick = () => {
    if (isLoggedIn) {
      // User is logged in, navigate to the Profile page
      navigate("/Profile");
    } else {
      // User is not logged in, navigate to the SignIn page
      navigate("/SignIn");
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
        setIsLoggedIn(true);
      } else {
        setPageState("Sign In");
        setIsLoggedIn(false);
      }
    });

    return () => {
      // Unsubscribe from the auth state changes when the component unmounts
      unsubscribe();
    };
  }, [auth]);

  return (
    <div className="bg-213555 border-b shadow-sm sticky top-0 z-40">
      <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
        <div>
          <img
            src={myImage}
            alt="logo"
            className="h-14 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              className={`cursor-pointer py-3 text-xl font-semibold text-D8C4B6 border-b-[3px] ${
                location.pathname === "/" ? "text-D8C4B6 border-b-red-500" : ""
              }`}
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-3 text-xl font-semibold text-D8C4B6 border-b-[3px] ${
                location.pathname === "/Blog"
                  ? "text-D8C4B6 border-b-red-500"
                  : ""
              }`}
              onClick={() => navigate("/Blog")}
            >
              MindHub
            </li>
            {isLoggedIn && (
              <li
                className={`cursor-pointer py-3 text-xl font-semibold text-D8C4B6 border-b-[3px] ${
                  location.pathname === "/Chat"
                    ? "text-D8C4B6 border-b-red-500"
                    : ""
                }`}
                onClick={() => navigate("/Chat")}
              >
                Community
              </li>
            )}
            <li
              className={`cursor-pointer py-3 text-xl font-semibold text-D8C4B6 border-b-[3px] ${
                location.pathname === "/SignIn" ||
                location.pathname === "/Profile"
                  ? "text-D8C4B6 border-b-red-500"
                  : ""
              }`}
              onClick={handleHomeClick}
            >
              {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}