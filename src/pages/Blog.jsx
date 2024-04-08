import React from "react";
import Footer from "../components/Footer";
import MindPodcast from "../components/MindPodcast";
import MindVideo from "../components/MindVideo";
import MindBlog from "../components/MindBlog";
import { Link } from "react-router-dom";
export default function Blog() {
  return (
    <div>
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        <MindBlog />
        <p className="text-xl  mb-4 text-gray-700 text-center mt-6">
          Want to write your own blog? Go for it! Share your thoughts and let
          your voice be heard.{" "}
          <Link to="/CreateBlog" className="text-blue-500 hover:underline">
            Start Writing!
          </Link>{" "}
        </p>

        <MindVideo />
        <MindPodcast />
        <div> </div>
      </div>

      <Footer />
    </div>
  )
}
