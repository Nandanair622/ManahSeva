import { useEffect } from "react";
import Chart from "chart.js/auto";

const PieChart = ({ sentimentData, textData }) => {
  useEffect(() => {
    const pieCtx = document.getElementById("sentimentPieChart");

    let pieChartInstance = null;

    if (pieCtx && sentimentData.length > 0) {
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }

      // Pie Chart
      const positiveCount = sentimentData.filter(
        (data) => data.score > 0
      ).length;
      const neutralCount = sentimentData.filter(
        (data) => data.score === 0
      ).length;
      const negativeCount = sentimentData.filter(
        (data) => data.score < 0
      ).length;

      pieChartInstance = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: ["Positive", "Neutral", "Negative"],
          datasets: [
            {
              label: "Pie Chart",
              data: [positiveCount, neutralCount, negativeCount],
              backgroundColor: ["#0D9488", "#2563EB", "#F43F5E"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            // title: {
            //   display: true,
            //   text: "Sentiment Distribution Pie Chart",
            // },
          },
        },
      });
    }

    return () => {
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }
    };
  }, [sentimentData]);

  return (
    <>
      <canvas id="sentimentPieChart" className="w-800 h-800"></canvas>
    </>
  );
};

export default PieChart;
