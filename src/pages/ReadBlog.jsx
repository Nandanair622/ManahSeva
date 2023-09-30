import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { FaShareAlt } from "react-icons/fa";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

// Register FontSize and FontStyle modules
const FontSizeStyle = Quill.import("attributors/style/size");
Quill.register(FontSizeStyle, true);

const FontAttributor = Quill.import("attributors/class/font");
Quill.register(FontAttributor, true);
const Size = Quill.import("formats/size");
Size.whitelist = ["10px", "12px", "16px", "18px", "24px", "32px"];
Quill.register(Size, true);// Import Quill styles

export default function ReadBlog() {
  const auth = getAuth();
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.blogId) {
      return;
    }

    async function fetchBlog() {
      const docRef = doc(db, "blogs", params.blogId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBlog(docSnap.data());
        setLoading(false);
      }
    }

    fetchBlog();
  }, [params.blogId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied");
  }

  return (
    <main>
      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-red-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={handleCopyLink}
      >
        <FaShareAlt className="text-lg text-red-400" />
      </div>
      <div className="m-4 max-w-6xl mx-auto p-4 rounded-lg shadow-lg bg-white">
        <div className="flex space-x-4 mb-4">
          {blog.imgUrls.map((url, index) => (
            <div
              key={index}
              style={{
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "500px",
                width: "3000px",
              }}
            ></div>
          ))}
        </div>

        <h1 className="text-3xl font-bold text-blue-900 text-center mb-3">
          {blog.title}
        </h1>

        {/* Display rich text content using React Quill in read-only mode */}
        <ReactQuill
          value={blog.content || ""}
          readOnly={true}
          theme="snow"
          modules={{
            toolbar: false, // Hide the toolbar
          }}
        />
      </div>
    </main>
  );
}
