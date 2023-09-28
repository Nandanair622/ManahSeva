import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

const AuthDetails = () => {
  const [authUser, setAuthUser] = useState(null);
    
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
        navigate('/login')
      })
      .catch((error) => console.log(error));
  };

    return (
        <div>
        {authUser ? (
        <div className="flex items-center">
            <div className="mr-5">
            <p className="text-gray-300">{`${authUser.displayName || authUser.email}`}</p>
            </div>
            <br />
            <div className=""> {/* Add margin-top (you can adjust the spacing as needed) */}
            <button
                className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                onClick={userSignOut}
            >
                Logout
            </button>
            </div>
        </div>
) : (
            <div>
                <Link
                to="login"
                className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                Login
                </Link>
                <Link
                to="/signup"
                className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                >
                Signup
                </Link>
            </div>
            
        )}
        </div>
    );
};

export default AuthDetails;