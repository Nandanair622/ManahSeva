import React, { useEffect, useState } from "react";
import { collection, getDocs, where, query } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Bar } from "react-chartjs-2";
import Diary from "./Diary";
import { db } from "../firebase";
import Quote from "../components/Quote";

function Dashboard() {
  const auth = getAuth();

  const [blogs, setBlogs] = useState(null);
  const [diaryEntries, setDiaryEntries] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [blogsByMonth, setBlogsByMonth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserBlogs() {
      const blogRef = collection(db, "blogs");
      const q = query(blogRef, where("userRef", "==", auth.currentUser.uid));
      const querySnap = await getDocs(q);
      let blogs = [];
      querySnap.forEach((doc) => {
        return blogs.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setBlogs(blogs);

      // Count blogs by month
      const blogsByMonthData = {};
      blogs.forEach((blog) => {
        const blogTimestamp = new Date(blog.data.timestamp.seconds * 1000);
        const monthYearKey = blogTimestamp
          .toLocaleDateString("en-US", { month: "short", year: "numeric" })
          .toUpperCase();
        blogsByMonthData[monthYearKey] =
          (blogsByMonthData[monthYearKey] || 0) + 1;
      });

      // Ensure that all months from August 2023 till present are present in the data
      const relevantMonths = getRelevantMonths();
      relevantMonths.forEach((month) => {
        blogsByMonthData[month] = blogsByMonthData[month] || 0;
      });

      // Sort the months
      const sortedMonths = Object.keys(blogsByMonthData).sort(
        (a, b) => new Date(a) - new Date(b)
      );

      // Create a new object with sorted months
      const sortedBlogsByMonthData = {};
      sortedMonths.forEach((month) => {
        sortedBlogsByMonthData[month] = blogsByMonthData[month];
      });

      setBlogsByMonth(sortedBlogsByMonthData);
    }

    async function fetchUserDiaryEntries() {
      const notesRef = collection(db, "notes");
      const userQuery = query(
        notesRef,
        where("uid", "==", auth.currentUser.uid)
      );
      const snapshot = await getDocs(userQuery);
      const entriesCount = snapshot.size;
      setDiaryEntries(entriesCount);
    }

    async function fetchUserMessageCount() {
      const messagesRef = collection(db, "messages");
      const userMessageQuery = query(
        messagesRef,
        where("userRef", "==", auth.currentUser.uid)
      );
      const messageSnapshot = await getDocs(userMessageQuery);
      const messagesCount = messageSnapshot.size;
      setMessageCount(messagesCount);
    }

    async function fetchData() {
      await Promise.all([
        fetchUserBlogs(),
        fetchUserDiaryEntries(),
        fetchUserMessageCount(),
      ]);
      setLoading(false);
    }

    fetchData();
  }, [auth.currentUser.uid]);

  function getRelevantMonths() {
    // Get the current date
    const currentDate = new Date();
    // Set the start date as August 2023
    const startDate = new Date(2023, 7); // Month is 0-based

    const relevantMonths = [];
    // Loop through months from start date till present date
    for (
      let date = new Date(startDate);
      date <= currentDate;
      date.setMonth(date.getMonth() + 1)
    ) {
      const monthYearKey = date
        .toLocaleDateString("en-US", { month: "short", year: "numeric" })
        .toUpperCase();
      relevantMonths.push(monthYearKey);
    }

    return relevantMonths;
  }

  // Prepare data for the Bar Chart
  const chartData = {
    labels: Object.keys(blogsByMonth),
    datasets: [
      {
        label: "Blogs Count",
        backgroundColor: "#E0AED0",
        borderColor: "#756AB6",
        borderWidth: 1,
        hoverBackgroundColor: "#AC87C5",
        hoverBorderColor: "#756AB6",
        data: Object.values(blogsByMonth),
      },
    ],
  };

  // Bar Chart Options
  const chartOptions = {
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          beginAtZero: true, // Start the y-axis at zero
          stepSize: 1, // Set the step size to 1
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">
          {auth.currentUser.displayName}'s Activity Overview
        </h1>
      </section>
      <br />
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && (
          <div className="flex justify-center space-x-6">
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <h2 className=" text-gray-700 text-xl font-semibold mb-1">
                Diary Entries
              </h2>
              <p className="text-gray-600 text-xl">{diaryEntries}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <h2 className=" text-gray-700 text-xl font-semibold mb-1">
                Published Blogs
              </h2>
              <p className="text-gray-600 text-xl">{blogs.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md text-center">
              <h2 className=" text-gray-700 text-xl font-semibold mb-1">
                Community Engagement
              </h2>
              <p className="text-gray-600 text-xl">{messageCount}</p>
            </div>
          </div>
        )}
      </div>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        <div className="flex items-center mb-4">
          <hr className="flex-grow border-b border-gray-300 mr-4" />
          <span className="text-gray-500 font-semibold text-xl">
            Quote Of The Day
          </span>
          <hr className="flex-grow border-b border-gray-300 ml-4" />
        </div>
        <Quote />
      </div>

      {/* Display blogs count by month */}
      {!loading && (
        <div className="max-w-6xl px-3 mt-6 mx-auto">
          <div className="flex items-center mb-4">
            <hr className="flex-grow border-b border-gray-300 mr-4" />
            <span className="text-gray-500 font-semibold text-xl">
              Monthly Blogging Journey
            </span>
            <hr className="flex-grow border-b border-gray-300 ml-4" />
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <Bar
              data={chartData}
              options={chartOptions}
              height={300} // Adjust height as needed
            />
          </div>
        </div>
      )}
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default Dashboard;
