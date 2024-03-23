import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const EmailTemplate = () => {
  const location = useLocation();
  const [view, setView] = useState(null);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const { state } = location;
  const annotations = location.state.annotations || {};
  const uploadedExcelFile = location.state.uploadedExcelFile || {};
  const [resultImages, setResultImages] = useState([]);
  const [resultEmails, setResultEmails] = useState([]);
  const [subLoad, setSubLoad] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);

  useEffect(() => {
    if (Object.keys(annotations).length > 0) {
      let updatedSubject = subject;
      let updatedBody = body;

      // Replace annotations in subject
      Object.keys(annotations).forEach((key) => {
        const annotation = '\\$\\{' + key + '\\}';
        updatedSubject = updatedSubject.replace(new RegExp(annotation, 'g'), annotations[key]);
        updatedBody = updatedBody.replace(new RegExp(annotation, 'g'), annotations[key]);
      });

      setSubject(updatedSubject);
      setBody(updatedBody);
    }
  }, [annotations, subject, body]);

  const handleViewChange = (selectedView) => {
    setView(selectedView);
    setSelectedButton(selectedView); // Set the selected button state
  };

  const handleProceed = async () => {
    try {
      const attachments = [];
      resultImages.forEach((base64String, index) => {
        attachments.push({
          filename: `image_${index + 1}.png`,
          content: base64String,
        });
      });

      const emailData = {
        subject: subject,
        content: body,
        recipients: resultEmails,
        attachments: attachments,
      };

      console.log('Email data:', emailData); // Log email data before sending request

      const response = await axios.post('https://certgen-backend.vercel.app/sendEmails', emailData);

      if (response.status === 200) {
        alert('Emails sent successfully');
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
    border: selectedButton === 'labelled' ? "none" : "1px solid white", // Border color for the button
  };

  const gradientBtnUnlabelled = {
    background: selectedButton === 'unlabelled' ? "linear-gradient(to bottom right, #FB360F, #F28A18)" : "transparent", // Conditional background for unlabelled button
    border: selectedButton === 'unlabelled' ? "none" : "1px solid white", // Border color for the button
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-screen m-5 min-h-screen">
      <h1 className="text-7xl md:text-8xl font-semibold text-white border-b-2 under md:pb-2">CERT GEN</h1>
      <div className="w-full bg-transparent rounded-lg shadow-md mt-10 p-4"> {/* Removed max-w-md class */}
        <div className="flex justify-center mb-8">
          <button onClick={() => handleViewChange('labelled')} className="text-white py-2 px-4 border border-2 rounded cursor-pointer mr-4" style={gradientBtn}>
            Labelled <span className="arrow">&#62;</span>
          </button>
          <button onClick={() => handleViewChange('unlabelled')} className="text-white py-2 border border-2 px-4 rounded cursor-pointer ml-4" style={gradientBtnUnlabelled}>
            Unlabelled <span className="arrow">&#62;</span>
          </button>
        </div>
        {view === 'labelled' && (
          <div className="flex flex-col items-center justify-center mt-4 p-4">
            <p className="text-md text-center font-medium text-white mb-4 font-urbanist">
              Note: Use {'${Annotations}'} in the body to change if the said annotation is there in the body <br></br>For Example: “Congratulations {'${Name}'}” to put in the names.
            </p>
          </div>
        )}
        <div className="flex flex-col items-center justify-center border-2 border-solid border-orange-600 rounded-lg mt-4 p-8">
          <div className="w-full mb-4 pl-8 pr-8">
            <label htmlFor="subject" className="block bg-transparent text-white text-sm">
              Subject:
            </label>
            <input
              type="text"
              id="subject"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline font-urbanist"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="w-full mb-4 pl-8 pr-8">
            <label htmlFor="body" className="block bg-transparent text-white text-sm mb-2">
              Body:
            </label>
            <textarea
              id="body"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-transparent leading-tight focus:outline-none focus:shadow-outline h-32 resize-none font-urbanist"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></textarea>
          </div>
          <button onClick={handleProceed} className="mt-4 bg-orange-500 text-white py-2 px-4 rounded cursor-pointer">
            Proceed <span className="arrow">&#62;</span>
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
