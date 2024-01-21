import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const LineChart = ({ sentimentData }) => {
  const lineChartRef = useRef(null);

  useEffect(() => {
    const ctx = lineChartRef.current;
    let chartInstance = null;

    if (ctx && sentimentData.length > 0) {
      // Destroy existing chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: sentimentData.map((data) => data.date.slice(8, 10)),
          datasets: [
            {
              label: "Sentiment Score",
              data: sentimentData.map((data) => data.score),
              borderColor: (context) => {
                const score = context.dataset.data[context.dataIndex];
                return score > 0 ? "green" : score < 0 ? "red" : "black";
              },
              backgroundColor: (context) => {
                const score = context.dataset.data[context.dataIndex];
                const alpha = Math.abs(score) / 100; // Adjust alpha based on score magnitude
                return score > 0
                  ? `rgba(0, 255, 0, ${alpha})`
                  : score < 0
                  ? `rgba(255, 0, 0, ${alpha})`
                  : `rgba(255, 255, 0, ${alpha})`;
              },
              borderWidth: 1,
            },
          ],
        },
        options: {
          // Add chart options if needed
        },
      });
    }

    // Return a cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [sentimentData]);

  return (
    <div>
      <canvas id="sentimentChart" ref={lineChartRef} width="400" height="200"></canvas>
    </div>
  );
};

export default LineChart;
