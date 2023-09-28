const checkForBullying = async (message) => {
  try {
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      // Handle non-200 status codes (e.g., 404, 500)
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.prediction === 1;
  } catch (error) {
    console.error('Error checking for bullying:', error);
    return false; // Return false in case of an error
  }
};

export default checkForBullying;