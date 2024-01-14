import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import DisplayBlog from "../components/DisplayBlog";
import { ImSearch } from "react-icons/im";

export default function MindBlog() {
  const [offerBlogs, setOfferBlogs] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const blogsRef = collection(db, "blogs");
        const q = query(blogsRef, orderBy("timestamp", "desc"));
        const querySnap = await getDocs(q);
        const blogs = [];
        querySnap.forEach((doc) => {
          blogs.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOfferBlogs(blogs);
      } catch (error) {
        console.log(error);
      }
    }
    fetchBlogs();
  }, []);

  // Function to handle search
  const handleSearch = () => {
    // Implement search functionality here
    // Filter the blogs based on the searchTerm
    // Update the offerBlogs state with the filtered blogs
    // You can use JavaScript's filter() function for this purpose
    const filteredBlogs = offerBlogs.filter((blog) =>
      blog.data.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setOfferBlogs(filteredBlogs);
  };

  return (
    <div className="max-w-6xl mx-auto pt-4 space-y-6">
      <h2 className="px-3 text-3xl text-center mt-6 font-bold">Our Blogs</h2>
      {/* Search Bar */}
      <div className="m-2 mb-6">
        <div className="flex items-center justify-center">
          <input
            type="text"
            className="border border-gray-300 rounded-md p-2 mr-2"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ImSearch
            className="text-red-500 h-8 w-8 cursor-pointer hover:text-red-700"
            onClick={handleSearch}
          />
        </div>
      </div>
      <div id="Blogs">
        {offerBlogs && offerBlogs.length > 0 && (
          <div className="m-2 mb-6">
            <br />
            <ul className="px-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
              {offerBlogs.map((blog) => (
                <DisplayBlog key={blog.id} blog={blog.data} id={blog.id} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
