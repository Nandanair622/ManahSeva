import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreateBlog";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPsw from "./pages/ForgotPsw";
import Header from "./components/Header";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateBlog from "./pages/CreateBlog";
import Blog from "./pages/Blog";
import PrivateRoute from "./components/PrivateRoute";
import EditBlog from "./pages/EditBlog";
import ReadBlog from "./pages/ReadBlog";
import Footer from "./components/Footer";
import ChatContainer from "./components/ChatContainer";
import ContactUs from "./pages/ContactUs";
import Diary from "./pages/Diary";
import Report from "./components/Report";
import MindPodcast from "./components/MindPodcast";
import MindVideo from "./components/MindVideo";
import MindBlog from "./components/MindBlog";
import Dashboard from "./pages/Dashboard";
import Quote from "./components/Quote";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/CreatePost" element={<CreatePost />}></Route>
          <Route path="/SignIn" element={<SignIn />}></Route>
          <Route path="/SignUp" element={<SignUp />}></Route>
          <Route path="/ForgotPsw" element={<ForgotPsw />}></Route>
          <Route path="/Profile" element={<Profile />}></Route>
          <Route path="/Blog" element={<Blog />}></Route>
          <Route path="/MindPodcast" element={<MindPodcast />}></Route>
          <Route path="/MindVideo" element={<MindVideo />}></Route>
          <Route path="/MindBlog" element={<MindBlog />}></Route>
          <Route path="/Quote" element={<Quote />}></Route>

          <Route path="/ContactUs" element={<ContactUs />}></Route>
          {/* <Route path="/EditBlog/:blogId" element={<EditBlog />}></Route> */}
          <Route path="/:blogId" element={<ReadBlog />}></Route>
          <Route path="/CreateBlog" element={<PrivateRoute />}>
            <Route path="/CreateBlog" element={<CreateBlog />}></Route>
          </Route>
          <Route path="/EditBlog" element={<PrivateRoute />}>
            <Route path="/EditBlog/:blogId" element={<EditBlog />}></Route>
          </Route>

          <Route path="/Chat" element={<PrivateRoute />}>
            <Route path="/Chat" element={<ChatContainer />}></Route>
          </Route>

          <Route path="/Diary" element={<PrivateRoute />}>
            <Route path="/Diary" element={<Diary />}></Route>
          </Route>

          <Route path="/Dashboard" element={<PrivateRoute />}>
            <Route path="/Dashboard" element={<Dashboard />}></Route>
          </Route>

          <Route path="/Report" element={<PrivateRoute />}>
            <Route path="/Report" element={<Report />}></Route>
          </Route>
        </Routes>
        {/* <Footer /> */}
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
