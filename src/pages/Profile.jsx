import { getAuth, updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";
import { BsPencilSquare } from "react-icons/bs";
import { Link } from "react-router-dom";
import DisplayBlog from "../components/DisplayBlog";
import Footer from "../components/Footer";
export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);

  const [formData, setFormData] = useState({
  name: auth.currentUser.displayName,
  email: auth.currentUser.email,
  });
  
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setFormData((prevData) => ({
            ...prevData,
            age: userData.age || "",
            gender: userData.gender || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }

    fetchUserDetails();
  }, [auth.currentUser.uid]);

  const { name, email, age, gender } = formData;
  function onLogOut() {
    auth.signOut();
    navigate("/");
  }
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  function onChange(e) {
  setFormData((prevState) => ({
    ...prevState,
    [e.target.id]: e.target.value,
  }));
  }
  //update details in firebase
  async function onSubmit() {
  try {
    // update in firebase authentication
    if (
      auth.currentUser.displayName !== name ||
      auth.currentUser.age !== age ||
      auth.currentUser.gender !== gender
    ) {
      await updateProfile(auth.currentUser, {
        displayName: name,
        age: age,
        gender: gender,
      });
    }
    // update details in firestore
    const docRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(docRef, { name, age, gender });
    toast.success("Profile details updated");
  } catch (error) {
    toast.error("Could not update profile details");
  }
}

  useEffect(() => {
    async function fetchUserBlogs() {
      const blogRef = collection(db, "blogs");
      const q = query(
        blogRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let blogs = [];
      querySnap.forEach((doc) => {
        return blogs.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setBlogs(blogs);
      setLoading(false);
    }
    fetchUserBlogs();
  }, [auth.currentUser.uid]);
  async function onDelete(blogsID) {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "blogs", blogsID));
      const updatedBlogs = blogs.filter((blog) => blog.id !== blogsID);
      setBlogs(updatedBlogs);
      toast.success("Successfully deleted the blog");
    }
  }
  function onEdit(blogsID) {
    navigate(`/EditBlog/${blogsID}`);
  }
  return (
    <>
      <section className="max-w-6xl mx-auto flex justify center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full :w-[50%] mt-6 px-3">
          <form>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            />
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">
              Email:
            </label>
            <input
              type="text"
              id="email"
              value={email}
              disabled
              className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
            />
            <label htmlFor="age" className="block text-sm font-medium text-gray-600 mb-1">
              Age:
            </label>
            <input
              type="text"
              id="age"
              value={age}
              disabled={!changeDetail}
              onChange={onChange}
              className={`mb-6 w-1/3 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            />
            <label htmlFor="gender" className="block text-sm font-medium text-gray-600 mb-1">
              Gender:
            </label>
            <input
              type="text"
              id="gender"
              value={gender}
              disabled={!changeDetail}
              onChange={onChange}
              className={`mb-6 w-1/3 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            />
            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
              <p className="flex items-center mb-6 ">
                Do you want to update your details?
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
                >
                  {changeDetail ? "Save changes" : "Edit"}
                </span>
              </p>
              <p
                onClick={onLogOut}
                className="text-blue-600 hover:text-blue-800 transition-200 ease-in-out cursor-pointer"
              >
                Sign out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800"
          >
            <Link to="/CreateBlog" className="flex justify-center items-center">
              <BsPencilSquare className="mr-2 text-2xl" />
              Create Blog
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && blogs.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              My Blogs
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {blogs.map((blog) => (
                <DisplayBlog
                  key={blog.id}
                  id={blog.id}
                  blog={blog.data}
                  onDelete={() => onDelete(blog.id)}
                  onEdit={() => onEdit(blog.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div>
      <div><br /></div>
      <Footer/>
    </>
  );
}
