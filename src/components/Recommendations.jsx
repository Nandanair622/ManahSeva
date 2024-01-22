import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";

const Recommendations = ({ monthOverallSentiment }) => {
  const [recommendations, setRecommendations] = useState([]);

  // Function to get recommendations based on sentiment category
  const getRecommendations = (category) => {
    const recommendationMap = {
      Positive: [
        "Practice gratitude daily by listing things you're thankful for.",
        "Engage in regular physical activity to boost your mood and energy levels.",
        "Connect with loved ones through calls, video chats, or social activities.",
        "Explore new hobbies or activities that bring you joy and relaxation.",
        "Consider volunteering or helping others to foster a sense of purpose.",
        "Prioritize self-care, such as getting enough sleep and maintaining a healthy diet.",
      ],
      Negative: [
        "Consider talking to a mental health professional if you're struggling.",
        "Practice mindfulness meditation to manage stress and negative thoughts.",
        "Take short breaks throughout the day to relax and recharge.",
        "Express your feelings through journaling or creative outlets.",
        "Establish a consistent sleep routine to improve overall well-being.",
        "Reach out to friends or family for support during challenging times.",
      ],
      Neutral: [
        "Reflect on your day and identify positive aspects, even in challenging situations.",
        "Try a new hobby or learn something new to add variety to your routine.",
        "Maintain a balanced lifestyle with regular exercise, healthy eating, and sufficient rest.",
        "Set realistic goals and prioritize tasks to reduce stress and enhance productivity.",
        "Practice deep breathing exercises for relaxation and stress relief.",
        "Engage in activities that bring you a sense of calm and tranquility.",
      ],
      "-": ["Please make entries in Diary to receive wellness tips."],
    };

    return recommendationMap[category] || [];
  };

  // Update recommendations whenever monthOverallSentiment changes
  useEffect(() => {
    // Call the function to get recommendations based on the sentiment category
    const currentRecommendations = getRecommendations(
      monthOverallSentiment.category
    );
    setRecommendations(currentRecommendations);
    // // // Display toast message if category is "-"
    // if (monthOverallSentiment.category === "-") {
    //   toast.warning(
    //     "Please make entries in the Diary to review your mental health journey."
    //   );
    // }
  }, [monthOverallSentiment.category]);

  return (
    <div className="text-gray-800 text-center border border-gray-300 rounded bg-white mt-4 p-4 text-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-gray-700">Wellness Tips</h3>
      <ul className="list-inside">
        {recommendations.map((recommendation, index) => (
          <li key={index} className="text-left mb-2">
            <span className="text-blue-700">&#8226;</span> {recommendation}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
