import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Chat from "./components/Chat";
import {auth} from './firebase';
import {useAuthState} from 'react-firebase-hooks/auth';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  const [user] = useAuthState(auth);
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {user ? (
            <>
              <Route path="/diary" element={<Diary />} />
              <Route path="/community" element={<Chat />} />
            </>
          ) : (
            <Route path="/login" element={<Login />} />
          )}

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
