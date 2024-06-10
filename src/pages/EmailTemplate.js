import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const EmailTemplate = () => {
  const location = useLocation();
  const [view, setView] = useState(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const { state } = location;
  const { uploadedExcelFile, annotations, resultImages, resultEmails } = location.state;
  const [subLoad, setSubLoad] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);

  const handleViewChange = (selectedView) => {
    setView(selectedView);
    setSelectedButton(selectedView); // Set the selected button state
  };

  const handleProceed = async () => {
    try {
      setSubLoad(true);

      const emailData = {
        subject: subject,
        content: body,
        recipients: resultEmails.map((email, index) => ({
          email: email,
          attachment: {
            filename: `image_${index + 1}.png`,
            content: resultImages[index],
          },
        })),
      };

      console.log('Email data:', emailData); // Log email data before sending request

      const response = await axios.post('https://certgen-backend.vercel.app/email/sendEmails', emailData);

      if (response.status === 200) {
        setSubLoad(false);
        alert('Emails sent successfully');
        window.location.href = '/';
        console.log('Emails sent successfully');
      } else {
        console.error('Failed to send emails');
      }
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  };

  const gradientBtn = {
    background: selectedButton === 'labelled' ? "linear-gradient(to bottom right, #FB360F, #F28A18)" : "transparent", // Conditional background for labelled button
    border: selectedButton === 'labelled' ? "none" : "1px solid black", 
  };

  const gradientBtnUnlabelled = {
    background: selectedButton === 'unlabelled' ? "linear-gradient(to bottom right, #FB360F, #F28A18)" : "transparent", // Conditional background for unlabelled button
    border: selectedButton === 'unlabelled' ? "none" : "1px solid black", 
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-screen m-5 min-h-screen">
      <h1 className="text-4xl md:text-6xl font-semibold text-black border-b-2 pb-2 text-center">CERTGEN</h1>
      <div className="w-full max-w-2xl bg-transparent rounded-lg shadow-md mt-10 p-4">
        <div className="flex flex-col items-center justify-center border-2 border-solid border-orange-600 rounded-lg mt-4 p-4 md:p-8">
          <div className="w-full mb-4 px-4">
            <label htmlFor="subject" className="block bg-transparent text-black text-sm">
              Subject:
            </label>
            <input
              type="text"
              id="subject"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-transparent leading-tight focus:outline-none focus:shadow-outline font-urbanist"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="w-full mb-4 px-4">
            <label htmlFor="body" className="block bg-transparent text-black text-sm mb-2">
              Body:
            </label>
            <textarea
              id="body"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-transparent leading-tight focus:outline-none focus:shadow-outline h-32 resize-none font-urbanist"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
          </div>
          <button onClick={handleProceed} className="mt-4 bg-orange-500 text-black py-2 px-4 rounded cursor-pointer">
            Proceed
          </button>
        </div>
      </div>
      <style>
        {`
          .arrow {
            font-size: 1.5rem;
            margin-left: 0.5rem; 
          }
        `}
      </style>
    </div>
  );
};

export default EmailTemplate;
