import { useEffect, useState } from "react";
import myImage from "../images/header.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default function Header() {
  const [pageState, setPageState] = useState("Sign In");
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else {
        setPageState("Sign In");
      }
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, [auth]);
  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-40">
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
              className={`cursor-pointer py-3 text-m font-semibold text-black border-b-[3px]  ${
                pathMatchRoute("/") && "text-black border-b-red-500"
              }`}
              onClick={() => navigate("/")}
            >
              Home
            </li>
            {/* <li
              className={`cursor-pointer py-3 text-m font-semibold text-black border-b-[3px]  ${
                pathMatchRoute("/SignIn") && "text-black border-b-red-500"
              }`}
              onClick={() => navigate("/SignIn")}
            >
              SignIn
            </li>
            <li
              className={`cursor-pointer py-3 text-m font-semibold text-black border-b-[3px]  ${
                pathMatchRoute("/Profile") && "text-black border-b-red-500"
              }`}
              onClick={() => navigate("/Profile")}
            >
              Profile
            </li> */}
            <li
              className={`cursor-pointer py-3 text-m font-semibold  text-black border-b-[3px]  ${
                (pathMatchRoute("/SignIn") && "text-black border-b-red-500") ||
                (pathMatchRoute("/Profile") && "text-black border-b-red-500")
              }`}
              onClick={() => navigate("/Profile")}
            >
              {pageState}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}
