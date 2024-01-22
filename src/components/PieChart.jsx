import React, { useEffect, useRef, useCallback } from "react";
import Chart from "chart.js/auto";

const PieChart = ({ sentimentData }) => {
  const pieChartRef = useRef(null);

  const updateChartInfo = useCallback(() => {
    if (pieChartRef.current && pieChartRef.current.data) {
      const chartData = pieChartRef.current.data;
      const total = chartData.datasets[0].data.reduce((acc, value) => acc + value, 0);

      const content = chartData.labels.map((label, i) => {
        const value = chartData.datasets[0].data[i];
        const percentage = ((value / total) * 100).toFixed(2);
        return `${label}: ${percentage}%`;
      }).join('<br>');

      const chartInfoElement = document.getElementById("chartInfo");
      if (chartInfoElement) {
        chartInfoElement.innerHTML = content;
      }
    }
  }, []);

  useEffect(() => {
    // Pie Chart
    const pieCtx = document.getElementById("sentimentPieChart");

    if (typeof Chart !== "undefined" && pieCtx) {
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
              backgroundColor: ["green", "blue", "red"],
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
    }
  }, [sentimentData]);

  useEffect(() => {
    updateChartInfo();
  }, [updateChartInfo, sentimentData]);

  return (
    <div>
      <canvas id="sentimentPieChart" width="400" height="200"></canvas>
      <div id="chartInfo" style={{ textAlign: 'center' }} ></div>
    </div>
  );
};

export default PieChart;
