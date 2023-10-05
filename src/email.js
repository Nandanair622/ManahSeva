// Import Email.js
import emailjs from 'emailjs-com';

// Function to send a warning email
const sendBullyWarningEmail = async (recipientEmail) => {
  const templateParams = {
    to_email: recipientEmail,
  };

  try {
    // Send the email using Email.js
    const response = await emailjs.send('service_20zlxho', 'template_nlfy81w', templateParams, 'JwnwNTXOD1i5OpAj-');
    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendBullyWarningEmail
