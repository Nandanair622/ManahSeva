import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import Chart from "chart.js/auto";
import moment from "moment";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Report = () => {
  const [notes, setNotes] = useState([]);
  const auth = getAuth()
  const [sentimentData, setSentimentData] = useState([]);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null); 
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [monthOverallSentiment, setMonthOverallSentiment] = useState({
    score: 0,
    category: "Neutral",
  });
  const [reportContainer, setReportContainer] = useState(null);
  const [mostFrequentEmotion, setMostFrequentEmotion] = useState("");
  const [prevMonthAverageSentiment, setPrevMonthAverageSentiment] = useState(0);
  const [sentimentCounts, setSentimentCounts] = useState({ positive: 0, negative: 0, neutral: 0 });
  const [prevMonthNotes, setPrevMonthNotes] = useState([]);
  const [barChartRef, setBarChartRef] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: auth.currentUser.displayName,
    
  });
  const [prevMonthSentimentCounts, setPrevMonthSentimentCounts] = useState({
  positive: 0,
  negative: 0,
  neutral: 0,
});
  const [prevMonthSentimentData, setPrevMonthSentimentData] = useState([]);
  const [chartInstances, setChartInstances] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const notesRef = collection(db, "notes");
      const userQuery = query(
        notesRef,
        where("uid", "==", auth.currentUser.uid)
      );
      const unsubscribe = onSnapshot(userQuery, (snapshot) => {
        const notesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(notesData);

        // Update sentiment and graph data after setting notes
        updateSentimentAndGraph();

        // Count notes by sentiment
        countNotesBySentiment();

      });

      return () => unsubscribe();
    };

    fetchData();
  }, []);

  const countNotesBySentiment = () => {
  const currentMonthCounts = countNotesBySentimentForMonth(selectedDate);
  setSentimentCounts(currentMonthCounts);

  const prevMonthDate = moment(selectedDate).subtract(1, 'months');
  const prevMonthCounts = countNotesBySentimentForMonth(prevMonthDate);
  setPrevMonthSentimentCounts(prevMonthCounts);
};

// Function to count notes by sentiment for a specific month
const countNotesBySentimentForMonth = (date) => {
  const counts = { positive: 0, negative: 0, neutral: 0 };
  const selectedMonth = moment(date).month();
  const selectedYear = moment(date).year();
  const filteredNotes = notes.filter((note) => {
    const noteMonth = moment(note.date).month();
    const noteYear = moment(note.date).year();
    return noteMonth === selectedMonth && noteYear === selectedYear;
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

  const prevMonthDate = moment().subtract(1, 'months');

  const prevMonthNotes = notes.filter((note) =>
    moment(note.date).isSame(prevMonthDate, 'month')
  );

  const prevMonthSentimentData = prepareSentimentDataForMonth(prevMonthNotes);
  
  setPrevMonthSentimentData(prevMonthSentimentData);
};

  // Function to prepare sentiment data for the line chart
  const prepareSentimentData = () => {
  const selectedMonth = moment(selectedDate).month(); // Get selected month (0-11)
  const selectedYear = moment(selectedDate).year(); // Get selected year
  const daysInMonth = moment(selectedDate).daysInMonth(); // Get the number of days in the selected month
  const startDate = moment(selectedDate).startOf("month");

  const newData = [];
  for (let i = 0; i < daysInMonth; i++) {
    const currentDate = startDate.clone().add(i, "days");
    const formattedDate = currentDate.format("YYYY-MM-DD");

    const existingNote = notes.find(
      (note) =>
        moment(note.date).month() === selectedMonth &&
        moment(note.date).year() === selectedYear &&
        note.date === formattedDate
    );

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
  setSentimentData(newData);
};


  const prepareSentimentDataForMonth = (notesForMonth) => {
  const daysInMonth = moment(selectedDate).subtract(1, 'months').daysInMonth();
  const startDate = moment(selectedDate).subtract(1, 'months').startOf("month");

  const newData = [];
  for (let i = 0; i < daysInMonth; i++) {
    const currentDate = startDate.clone().add(i, "days");
    const formattedDate = currentDate.format("YYYY-MM-DD");

    const existingNote = notesForMonth.find(
      (note) => note.date === formattedDate
    );

    console.log('Existing Note for', formattedDate, ':', existingNote); // Add this line

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
      const total = chartData.datasets[0].data.reduce((acc, value) => acc + value, 0);

      const content = chartData.labels.map((label, i) => {
        const value = chartData.datasets[0].data[i];
        const percentage = ((value / total) * 100).toFixed(2);
        return `${label}: ${percentage}%`;
      }).join('<br>');

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

  return () => {
    doubleLineChartInstance.destroy();
  };
}, [sentimentData, prevMonthSentimentData]);


  useEffect(() => {
    // Pie Chart
    const pieCtx = document.getElementById("sentimentPieChart");
    const positiveCount = sentimentData.filter((data) => data.score > 0).length;
    const neutralCount = sentimentData.filter((data) => data.score === 0).length;
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
  setBarChartRef(barChartInstance);

  return () => {
    barChartInstance.destroy();
  };
}, [sentimentCounts, prevMonthSentimentCounts]);
  
  const downloadReport = async () => {
  const reportContainer = document.getElementById('report-container');

  if (reportContainer) {
    const canvas = await html2canvas(reportContainer, { width: 1920, height: 1080 });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add the captured canvas as an image to the PDF
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 20, 10, 300, 200); // Adjust as needed

    // Save the PDF
    pdf.save('report.pdf');
  }
};
  
  return (
    <div className="flex justify-center items-center h-screen">
    <div id="report-container" ref={setReportContainer} className="w-3/4 h-4/5">
      <h1 className="text-center mb-10">Name: {userInfo.name}</h1>
      
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
          <canvas id="doubleSentimentLineChart" width="400" height="200"></canvas>
            <p className="text-center mt-5">Line Chart Comparison </p>
        </div>
    </div>
    <div className="flex flex-col items-center">
        <br />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 "
          onClick={downloadReport}
        >
          Download Report
        </button>
    </div>
    </div>
    </div>
  );
};

export default Report;
