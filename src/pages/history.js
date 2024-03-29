import React from "react";
import icon1 from '../images/history_icon_1.png';
import icon2 from '../images/history_icon_2.png';
import icon3 from '../images/history_icon_3.png';
import icon4 from '../images/history_icon_1.png';
import { useNavigate } from 'react-router-dom';

const gradientText = {
  backgroundImage: "linear-gradient(to right, #FFA500, #FF6347)",
  WebkitBackgroundClip: "text",
  color: "transparent",
};

function History() {
  const navigate = useNavigate();

  const handleNewProjectClick = () => {
    // Navigate to the "newproject" page
    navigate('/newproject');
  };

  return (
    <div className="sm:mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
      <div className="flex flex-col md:flex-row mx-auto">
      <div className="relative bg-white bg-opacity-10 p-4 w-full h-40 mx-auto my-4 mr-8 mt-12 rounded-lg text-white shadow-md glassmorphism font-urbanist md:w-72">
        <p className="absolute top-3 right-8 mt-2 mx-4 text-sm font-urbanist" style={{ maxWidth: 'calc(100% - 3rem)' }}>Certificates generated</p>
        <img src={icon1} alt="Icon 1" className="absolute top-3 right-2 mt-2 mx-4" style={{ marginRight: '0.5rem' }} />
        <p className="absolute bottom-0 left-0 text-5xl ml-4 mb-4 font-semibold font-urbanist" style={gradientText}>1800</p>
      </div>

      <div className="relative bg-white bg-opacity-10 p-4 w-full h-40 mx-auto my-4 mr-8 mt-12 rounded-lg text-white shadow-md glassmorphism font-urbanist md:w-72">
        <p className="absolute top-3 right-8 mt-2 mx-4 text-sm font-urbanist" style={{ maxWidth: 'calc(100% - 3rem)' }}>Total Emails sent</p>
        <img src={icon2} alt="Icon 2" className="absolute top-3 right-2 mt-2 mx-4" style={{ marginRight: '0.5rem' }}/>
        <p className="absolute bottom-0 left-0 text-5xl ml-4 mb-4 font-semibold font-urbanist" style={gradientText}>1500</p>
      </div>

      <div className="relative bg-white bg-opacity-10 p-4 w-full h-40 mx-auto my-4 mr-8 mt-12 rounded-lg text-white shadow-md glassmorphism font-urbanist md:w-72">
        <p className="absolute top-3 right-8 mt-2 mx-4 text-sm font-urbanist" style={{ maxWidth: 'calc(100% - 3rem)' }}>Total Competitions</p>
        <img src={icon3} alt="Icon 3" className="absolute top-3 right-2 mt-2 mx-4" style={{ marginRight: '0.5rem' }}/>
        <p className="absolute bottom-0 left-0 text-5xl ml-4 mb-4 font-semibold font-urbanist" style={gradientText}>5</p>
      </div>

      <div className="relative bg-white bg-opacity-10 p-4 w-full h-40 mx-auto my-4 mt-12 rounded-lg text-white shadow-md glassmorphism font-urbanist md:w-72">
        <p className="absolute top-3 right-8 mt-2 mx-4 text-sm font-urbanist" style={{ maxWidth: 'calc(100% - 3rem)' }}>Certificates Downloaded</p>
        <img src={icon4} alt="Icon 4" className="absolute top-3 right-2 mt-2 mx-4" style={{ marginRight: '0.5rem' }}/>
        <p className="absolute bottom-0 left-0 text-5xl ml-4 mb-4 font-semibold font-urbanist" style={gradientText}>1500</p>
      </div>
      </div>
      <div>
        <div className="w-full bg-white bg-opacity-10 p-2 text-white text-center font-semibold mt-5 rounded-t-lg shadow-md mx-auto glassmorphism font-urbanist">
          Total Certifications
        </div>
        <table className="w-full bg-white bg-opacity-10 p-2 rounded-lg text-xs mx-auto glassmorphism font-urbanist">
          <thead className="w-full bg-white bg-opacity-20 text-center font-urbanist">
            <tr>
              <th className="p-2 text-white w-1/4 h-10 font-urbanist">Project name</th>
              <th className="p-2 text-white w-1/4 h-10 font-urbanist">Participants</th>
              <th className="p-2 text-white w-1/4 h-10 font-urbanist">Certificate Generated</th>
              <th className="p-2 text-white w-1/4 h-10 font-urbanist">Mail Sent and Certificate Downloaded</th>
            </tr>
          </thead>
          <tbody className="text-center font-urbanist">
            <tr className="font-urbanist">
              <td className="p-2 text-white font-urbanist">HackOne</td>
              <td className="p-2 text-white font-urbanist">34</td>
              <td className="p-2 text-white font-urbanist">34</td>
              <td className="p-2 text-white font-urbanist">34</td>
            </tr>
          </tbody>
          <tbody className="text-center font-urbanist">
            <tr className="font-urbanist">
              <td className="p-2 text-white font-urbanist">HackOne</td>
              <td className="p-2 text-white font-urbanist">34</td>
              <td className="p-2 text-white font-urbanist">34</td>
              <td className="p-2 text-white font-urbanist">34</td>
            </tr>
          </tbody>
          <tbody className="text-center font-urbanist">
            <tr className="font-urbanist">
              <td className="p-2 text-white font-urbanist">HackOne</td>
              <td className="p-2 text-white font-urbanist">34</td>
              <td className="p-2 text-white font-urbanist">34</td>
              <td className="p-2 text-white font-urbanist">34</td>
            </tr>
          </tbody>
          <tbody className="text-center font-urbanist">
            <tr className="font-urbanist">
              <td className="p-2 text-white font-urbanist">HackOne</td>
              <td className="p-2 text-white font-urbanist">34</td>
              <td className="p-2 text-white font-urbanist">34</td>
              <td className="p-2 text-white font-urbanist">34</td>
            </tr>
          </tbody>
          <tbody className="text-center font-urbanist">
            <tr className="font-urbanist">
              <td className="p-2 text-white font-urbanist">HackOne</td>
              <td className="p-2 text-white font-urbanist">34</td>
              <td className="p-2 text-white font-urbanist">34</td>
              <td className="p-2 text-white font-urbanist">34</td>
            </tr>
          </tbody>
        </table>
        <div className="fixed w-full bottom-0 left-0 bg-white bg-opacity-10 glassmorphism font-urbanist">
          <button className="w-full sm:w-1/2 lg:w-1/5 bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg my-4 mx-auto font-urbanist" onClick={handleNewProjectClick}>
            New Project
          </button>
        </div>
      </div>
    </div>
  );
}

export default History;
