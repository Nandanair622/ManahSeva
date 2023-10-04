import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import DisplayBlog from "../components/DisplayBlog";
import { ImSearch } from "react-icons/im";

export default function Blog() {
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
    <div>
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
            {/* <button
              className="bg-blue-500 text-white p-2 rounded-md"
              onClick={handleSearch}
            >
              Search
            </button> */}
          </div>
        </div>
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
        <h2 className="px-3 text-3xl text-center mt-6 font-bold">
          Visual Wellness
        </h2>
        <div class="flex justify-center space-x-8">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/BpzVvUGfJeA?si=tRpuzdKh-WO-QOVA"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/wOGqlVqyvCM?si=mQVGkvuNiWE766zX"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/db3K8b3ftaY?si=fDMsRY3nQFcE0yjv"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div class="flex justify-center space-x-8">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/_5OkC09xP34?si=KX7iZpTYD9yMNZoA"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/7EX1Xnvvk5c?si=XCVZyyitInlmhX5K"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/iNyUmbmQQZg?si=gznugUC45hg1g6yz"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <h2 className="px-3 text-3xl text-center mt-6 font-bold">
          Harmony for the Mind
        </h2>
        <div class="flex justify-center space-x-8">
          <iframe
            class="rounded-lg"
            src="https://open.spotify.com/embed/album/4WJlT8rSyf9nf0YrdKriSO?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
          <iframe
            class="rounded-lg"
            src="https://open.spotify.com/embed/show/2BLdPSFfzWaYKiXYV0Nqvo?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
          <iframe
            class="rounded-lg"
            src="https://open.spotify.com/embed/episode/6Lei7wvK0bDVCajZHkkWqn?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
        <div class="flex justify-center space-x-8">
          <iframe
            class="rounded-lg"
            src="https://open.spotify.com/embed/episode/4BNGWe69Pw8k1Q9EIQtzGI?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
          <iframe
            class="rounded-lg"
            src="https://open.spotify.com/embed/show/2kH3ec1ljTia7VmwYsm8Xt?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
          <iframe
            class="rounded-lg"
            src="https://open.spotify.com/embed/show/4298EkFJWEK6VAxKARB7bS?utm_source=generator&theme=0"
            width="100%"
            height="352"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
        <div></div>
      </div>
    </div>
  );
}
