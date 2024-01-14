import React, { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import Footer from "../components/Footer";

// Register FontSize and FontStyle modules
const FontSizeStyle = Quill.import("attributors/style/size");
Quill.register(FontSizeStyle, true);

const FontAttributor = Quill.import("attributors/class/font");
Quill.register(FontAttributor, true);
const Size = Quill.import("formats/size");
Size.whitelist = ["10px", "12px", "16px", "18px", "24px", "32px"];
Quill.register(Size, true);
export default function EditBlog() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: {},
  });
  const { title, content, images } = formData;

  const params = useParams();

  useEffect(() => {
    if (blog && blog.userRef !== auth.currentUser.uid) {
      toast.error("You can't edit this blog");
      navigate("/");
    }
  }, [auth.currentUser.uid, blog, navigate]);

  useEffect(() => {
    setLoading(true);
    async function fetchBlog() {
      const docRef = doc(db, "blogs", params.blogId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBlog(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Blog does not exist");
        setLoading(false); // Handle loading state when blog doesn't exist
      }
    }
    fetchBlog();
  }, [navigate, params.blogId]);

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (images.length > 1) {
      setLoading(false);
      toast.error("maximum 1 image is allowed");
      return;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;

    const docRef = doc(db, "blogs", params.blogId);

    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Blog Edited");
    navigate(`/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Edit Blog</h1>
      <form onSubmit={onSubmit}>
        <p className="text-lg mt-6 font-semibold">Blog Title</p>
        <input
          type="text"
          id="title"
          value={title}
          onChange={onChange}
          placeholder="title"
          maxLength="32"
          minLength="10"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Blog Content</p>
        <ReactQuill
          value={content}
          onChange={(value) =>
            setFormData((prevState) => ({
              ...prevState,
              content: value,
            }))
          }
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ list: "bullet" }, { list: "ordered" }],
              ["bold", "italic", "underline"],
              ["link"],
              [{ size: ["10px", "12px", "16px", "18px", "24px", "32px"] }], // Font size options
            ],
          }}
          placeholder="Type Content here"
          style={{
            minHeight: "300px",
            fontSize: "18px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "100%",
            padding: "10px",
            color: "#333",
            backgroundColor: "#fff",
            transition:
              "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          }}
        />

        <div className="mb-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600">Thumbnail Image (max 1)</p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
          />
        </div>
        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Edit Blog
        </button>
      </form>
      <Footer/>
    </main>
  );
}
