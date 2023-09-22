import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPsw from "./pages/ForgotPsw";
import Header from "./components/Header"
import Profile from "./pages/Profile";
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/CreatePost" element={<CreatePost />}></Route>
        <Route path="/SignIn" element={<SignIn />}></Route>
        <Route path="/SignUp" element={<SignUp />}></Route>
        <Route path="/ForgotPsw" element={<ForgotPsw />}></Route>
        <Route path="/Profile" element={<Profile />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
