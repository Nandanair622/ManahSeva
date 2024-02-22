import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import Chart from "chart.js/auto";
import moment from "moment";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Recommendations from "./Recommendations";
import { toast } from "react-toastify";
const Report = () => {
  const [notes, setNotes] = useState([]);
  const auth = getAuth();
  const [sentimentData, setSentimentData] = useState([]);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportContainer, setReportContainer] = useState(null);
  const [sentimentCounts, setSentimentCounts] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const [barChartRef, setBarChartRef] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: auth.currentUser.displayName,
  });
  const [prevMonthSentimentCounts, setPrevMonthSentimentCounts] = useState({
    positive: 0,
    negative: 0,
    neutral: 0,
  });
  const [averageSentiment, setAverageSentiment] = useState(0);
  const [prevMonthSentimentData, setPrevMonthSentimentData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [chartInstances, setChartInstances] = useState({});
  const [monthOverallSentiment, setMonthOverallSentiment] = useState({
    score: 0,
    category: "Neutral",
  });
  useEffect(() => {
    const fetchData = async () => {
      const notesRef = collection(db, "notes");
      const userQuery = query(
        notesRef,
        where("uid", "==", auth.currentUser.uid)
      );
      const unsubscribe = onSnapshot(userQuery, async (snapshot) => {
        const notesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData);

        // Update sentiment and graph data after setting notes
        updateSentimentAndGraph(selectedMonth, selectedYear);

        // Count notes by sentiment
        countNotesBySentiment();

        // Calculate average sentiment asynchronously
        const avgSentiment = await prepareSentimentData(
          selectedMonth,
          selectedYear
        );
        setAverageSentiment(avgSentiment);
      });

      return () => unsubscribe();
    };

    fetchData();
  }, [auth.currentUser.uid]);

  useEffect(() => {
    countNotesBySentiment();
    prepareSentimentData(selectedMonth, selectedYear);
    prepareSentimentData(selectedMonth - 1, selectedYear, true);
  }, [notes, selectedMonth, selectedYear]);

  const updateMonth = (event) => {
    const selectedDate = moment(event.target.value, "YYYY-MM");
    setSelectedMonth(selectedDate.month());
    setSelectedYear(selectedDate.year());
  };

  const countNotesBySentiment = () => {
    const currentMonthCounts = countNotesBySentimentForMonth(
      selectedMonth,
      selectedYear
    );
    setSentimentCounts(currentMonthCounts);

    const prevMonthCounts = countNotesBySentimentForMonth(
      selectedMonth - 1,
      selectedYear
    );
    setPrevMonthSentimentCounts(prevMonthCounts);
  };

  // Function to count notes by sentiment for a specific month
  const countNotesBySentimentForMonth = (month, year) => {
    const counts = { positive: 0, negative: 0, neutral: 0 };
    const filteredNotes = notes.filter((note) => {
      const noteMonth = moment(note.date).month();
      const noteYear = moment(note.date).year();
      return noteMonth === month && noteYear === year;
    });

    filteredNotes.forEach((note) => {
      const sentimentScore = note.sentiment && note.sentiment.score;
      if (sentimentScore > 0) {
        counts.positive++;
      } else if (sentimentScore < 0) {
        counts.negative++;
      } else {
        counts.neutral++;
      }
    });

    return counts;
  };

  // Function to update sentiment and graph data based on selected month
  const updateSentimentAndGraph = () => {
    prepareSentimentData();
    const prevMonthDate = moment().subtract(1, "months");

    const prevMonthNotes = notes.filter((note) =>
      moment(note.date).isSame(prevMonthDate, "month")
    );

    const prevMonthSentimentData = prepareSentimentDataForMonth(prevMonthNotes);

    setPrevMonthSentimentData(prevMonthSentimentData);
  };

  // Function to prepare sentiment data for the line chart
  const prepareSentimentData = async (month, year, isPrevMonth = false) => {
    const daysInMonth = moment([year, month]).daysInMonth();
    const startDate = moment([year, month]).startOf("month");

    let totalSentimentScore = 0;
    let totalNotes = 0;

    const newData = [];
    for (let i = 0; i < daysInMonth; i++) {
      const currentDate = startDate.clone().add(i, "days");
      const formattedDate = currentDate.format("YYYY-MM-DD");

      const existingNote = notes.find(
        (note) =>
          moment(note.date).month() === month &&
          moment(note.date).year() === year &&
          note.date === formattedDate
      );

      const sentimentScore =
        existingNote &&
        existingNote.sentiment &&
        typeof existingNote.sentiment.score !== "undefined"
          ? existingNote.sentiment.score
          : 0;

      totalSentimentScore += sentimentScore;
      totalNotes++;

      newData.push({
        date: formattedDate,
        score: sentimentScore,
      });
    }

    // Calculate average sentiment score
    const averageSentiment =
      totalNotes > 0 ? totalSentimentScore / totalNotes : 0;

    if (isPrevMonth) {
      setPrevMonthSentimentData(newData);
    } else {
      setSentimentData(newData);
    }

    return averageSentiment;
  };

  const prepareSentimentDataForMonth = (notesForMonth) => {
    const daysInMonth = moment(selectedDate)
      .subtract(1, "months")
      .daysInMonth();
    const startDate = moment(selectedDate)
      .subtract(1, "months")
      .startOf("month");

    const newData = [];
    for (let i = 0; i < daysInMonth; i++) {
      const currentDate = startDate.clone().add(i, "days");
      const formattedDate = currentDate.format("YYYY-MM-DD");

      const existingNote = notesForMonth.find(
        (note) => note.date === formattedDate
      );

      console.log("Existing Note for", formattedDate, ":", existingNote); // Add this line

      const sentimentScore =
        existingNote &&
        existingNote.sentiment &&
        typeof existingNote.sentiment.score !== "undefined"
          ? existingNote.sentiment.score
          : 0;

      newData.push({
        date: formattedDate,
        score: sentimentScore,
      });
    }
    return newData;
  };

  useEffect(() => {
    prepareSentimentData();
  }, [notes, selectedDate]);

  const updateChartInfo = useCallback(() => {
    if (pieChartRef.current) {
      const chartData = pieChartRef.current.data;
      const total = chartData.datasets[0].data.reduce(
        (acc, value) => acc + value,
        0
      );

      const content = chartData.labels
        .map((label, i) => {
          const value = chartData.datasets[0].data[i];
          const percentage = ((value / total) * 100).toFixed(2);
          return `${label}: ${percentage}%`;
        })
        .join("<br>");

      document.getElementById("chartInfo").innerHTML = content;
    }
  }, []);

  useEffect(() => {
    // Line Chart for Current Month
    const lineCtx = document.getElementById("sentimentLineChart");
    const lineChartInstance = new Chart(lineCtx, {
      type: "line",
      data: {
        labels: sentimentData.map((data) => data.date.slice(8, 10)),
        datasets: [
          {
            label: "Current Month",
            data: sentimentData.map((data) => data.score),
            borderColor: "blue",
            backgroundColor: "rgba(0, 0, 255, 0.1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        // Add chart options if needed
      },
    });

    // Store the line chart instance in the ref
    lineChartRef.current = lineChartInstance;

    return () => {
      lineChartInstance.destroy();
    };
  }, [sentimentData]);

  useEffect(() => {
    // Double Line Chart for Current and Previous Months
    const doubleLineCtx = document.getElementById("doubleSentimentLineChart");
    const doubleLineChartInstance = new Chart(doubleLineCtx, {
      type: "line",
      data: {
        labels: sentimentData.map((data) => data.date.slice(8, 10)),
        datasets: [
          {
            label: "Current Month",
            data: sentimentData.map((data) => data.score),
            borderColor: "blue",
            backgroundColor: "rgba(0, 0, 255, 0.1)",
            borderWidth: 1,
          },
          {
            label: "Previous Month",
            data: prevMonthSentimentData.map((data) => data.score),
            borderColor: "orange",
            backgroundColor: "rgba(255, 165, 0, 0.1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        // Add chart options if needed
      },
    });

    // Store the double line chart instance in the state
    setChartInstances((prevState) => ({
      ...prevState,
      doubleLineChartInstance,
    }));

    return () => {
      doubleLineChartInstance.destroy();
    };
  }, [sentimentData, prevMonthSentimentData]);

  useEffect(() => {
    // Pie Chart
    const pieCtx = document.getElementById("sentimentPieChart");
    const positiveCount = sentimentData.filter((data) => data.score > 0).length;
    const neutralCount = sentimentData.filter(
      (data) => data.score === 0
    ).length;
    const negativeCount = sentimentData.filter((data) => data.score < 0).length;

    const pieChartInstance = new Chart(pieCtx, {
      type: "pie",
      data: {
        labels: ["Positive", "Neutral", "Negative"],
        datasets: [
          {
            label: "Pie Chart",
            data: [positiveCount, neutralCount, negativeCount],
            backgroundColor: ["green", "yellow", "red"],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    // Store the pie chart instance in the ref
    pieChartRef.current = pieChartInstance;

    return () => {
      pieChartInstance.destroy();
    };
  }, [sentimentData]);

  useEffect(() => {
    updateChartInfo();
  }, [updateChartInfo, sentimentData]);

  useEffect(() => {
    // Bar Chart
    const barCtx = document.getElementById("sentimentBarChart");
    const barChartInstance = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: ["Positive", "Neutral", "Negative"],
        datasets: [
          {
            label: "Current Month",
            data: [
              sentimentCounts.positive || 0,
              sentimentCounts.neutral || 0,
              sentimentCounts.negative || 0,
            ],
            backgroundColor: ["green", "green", "green "],
            borderWidth: 1,
          },
          {
            label: "Previous Month",
            data: [
              prevMonthSentimentCounts.positive || 0,
              prevMonthSentimentCounts.neutral || 0,
              prevMonthSentimentCounts.negative || 0,
            ],
            backgroundColor: ["blue", "blue", "blue"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Store the bar chart instance in the state
    setChartInstances((prevState) => ({
      ...prevState,
      barChartInstance,
    }));

    return () => {
      barChartInstance.destroy();
    };
  }, [sentimentCounts, prevMonthSentimentCounts]);

  const downloadReport = async () => {
  const reportContainer = document.getElementById("report-container");
  const recommendationsContainer = document.getElementById("recommendations");

  if (reportContainer && recommendationsContainer) {
    const canvas = await html2canvas(reportContainer, {
      width: 1920,
      height: 1080,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add the captured canvas as an image to the PDF
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 20, 10, 300, 200); // Adjust as needed

    // Convert HTML content of recommendations to text
    const recommendationsContent = recommendationsContainer.innerText;

    // Include the recommendations in the PDF
    const splitRecommendations = pdf.splitTextToSize(
      recommendationsContent,
      170
    ); // Adjust the width as needed
    pdf.text(20, 230, splitRecommendations); // Adjust the position as needed

    // Save the PDF
    pdf.save("report.pdf");

    // Show success message
    toast.success("Report downloaded successfully!");
  }

  };
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div
          id="report-container"
          ref={setReportContainer}
          className="w-3/4 h-4/5"
        >
          <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
            <h1 className="text-3xl text-center mt-6 font-bold">
              {auth.currentUser.displayName}'s Monthly Analytics
            </h1>
          </section>
          {/* Month Selector */}
          <br></br>
          <div className="mb-5">
            <label htmlFor="monthSelector" className="mr-3">
              Select Month:
            </label>
            <input
              type="month"
              id="monthSelector"
              value={`${selectedYear}-${`0${selectedMonth + 1}`.slice(-2)}`}
              onChange={updateMonth}
            />
          </div>

          <div className="flex">
            <div className="w-3/4">
              <canvas id="sentimentLineChart" width="400" height="200"></canvas>
              <p className="text-center mt-5">Line Chart for Current Month</p>
            </div>
            <div className="w-1/4 pl-10 pt-5">
              <canvas id="sentimentPieChart" width="400" height="200"></canvas>
              <div id="chartInfo" className="text-center mt-5 mb-5"></div>
              <p className="text-center ml-5">Pie Chart for Distribution</p>
            </div>
          </div>
          <div className="flex mt-10 pt-5 ">
            <div className="w-2/5 mr-5">
              <canvas id="sentimentBarChart" width="400" height="200"></canvas>
              <p className="text-center mt-5">Bar Chart Comparison </p>
            </div>
            <div className="w-3/5 ml-5">
              <canvas
                id="doubleSentimentLineChart"
                width="400"
                height="200"
              ></canvas>
              <p className="text-center mt-5">Line Chart Comparison </p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <br />
            <Recommendations
              id="recommendations"
              monthOverallSentiment={monthOverallSentiment}
            />
            <div id="recommendations" style={{ display: "none" }}>
              <Recommendations monthOverallSentiment={monthOverallSentiment} />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4 focus:outline-none"
              onClick={downloadReport}
            >
              Download Report
            </button>
            <br></br>
            <br></br>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
