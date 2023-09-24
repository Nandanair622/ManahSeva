import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { FaShareAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

export default function ReadBlog() {
  const auth = getAuth();
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if params.blogsId is defined before proceeding
    if (!params.blogId) {
      // Handle the case where params.blogsId is not defined (e.g., show an error message or redirect)
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
  // If the blog is still loading, you can display a loading indicator.
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
        {/* Display the images */}
        <div className="flex space-x-4 mb-4">
          {blog.imgUrls.map((url, index) => (
            <div
              key={index}
              style={{
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "300px",
                width: "3000px", // Adjust the image dimensions as needed
              }}
            ></div>
          ))}
        </div>

        {/* Display the title */}
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-3">
          {blog.title}
        </h1>

        {/* Display the content */}
        <p className="mt-3 mb-3 text-gray-800">{blog.content}</p>
      </div>
    </main>
  );
}
