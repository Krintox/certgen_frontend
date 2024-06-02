import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useProject } from '../ProjectContext';
import logo from "../images/brand-logo.png";
import certificate from "../images/Image(1).png";

export default function NewProject() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const [showLeftDiv, setShowLeftDiv] = useState(true); // State to control visibility of left div
  const { setProjectId } = useProject();

  // Function to check screen size and set showLeftDiv state accordingly
  const checkScreenSize = () => {
    if (window.innerWidth >= 1280) {
      setShowLeftDiv(true);
    } else {
      setShowLeftDiv(false);
    }
  };

  useEffect(() => {
    // Check screen size when component mounts
    checkScreenSize();
    // Add event listener to listen for screen size changes
    window.addEventListener('resize', checkScreenSize);

    // Cleanup function to remove event listener when component unmounts
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  async function handleProceed(ev) {
    ev.preventDefault();
  
    // Create a JSON object with title and description
    const projectData = {
      title: projectName,
      description: description
    };
  
    try {
      // Make a POST request to the backend endpoint with credentials
      const response = await fetch('https://certgen-backend.vercel.app/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Include credentials
        body: JSON.stringify(projectData)
      });
  
      if (response.ok) {
        const responseData = await response.json();
        const projectId = responseData.projectId;
        console.log('Project created successfully:', projectId);
        setProjectId(projectId)
        setRedirect(true);
      } else {
        setRedirect(false);
        // Handle error response
        console.error('Failed to create project title and description:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating project title and description:', error);
    }
  }
  

  if (redirect) {
    return <Navigate to={'/upload'} />;
  }

  const gradientBgLeft = {
    background: "linear-gradient(to bottom right, #FB360F, #F28A18)",
  };

  const gradientBgRight = {
    background: "linear-gradient(to right, #222029, #3B4148)",
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center h-screen w-3/4 ">
        <div className={`container mx-auto rounded-lg${showLeftDiv ? ' shadow-md' : ''} relative flex overflow-hidden h-5/6 w-10/12`}>
          {/* Left Side */}
          {showLeftDiv && (
            <div className="relative w-1/2 h-full flex flex-col rounded-lg" style={gradientBgLeft}>
              <div className='absolute left-[10%] flex flex-col'>
                <h1 className='text-4xl text-white font-bold mt-6 flex items-center z-10'>
                  <img src={logo} alt="logo" className="w-12 h-12 mr-2" />
                  <span className="text-white">WEBKITES</span>
                </h1>
                <p className='text-3xl text-white font-urbanist font-normal mt-2'>
                  The only <br /> certificate <br /> automation <br /> tool you need
                </p>
              </div>
              <div className="absolute w-full bottom-0 pt-4">
                <img src={certificate} alt="Certificate" className="w-full h-5/6 z-0" />
              </div>
            </div>
          )}

          {/* Right Side */}
          <div className={`w-${showLeftDiv ? '1/2' : 'full'} h-full flex flex-col justify-center items-center p-6 rounded-lg`} style={gradientBgRight}>
            <div className='w-full flex flex-col max-w-[500px] bg-transparent'>
              <div className="w-full flex flex-col mb-4 mt-12">
                <h3 className="text-5xl mb-2 text-center text-white">LET'S BEGIN</h3>
              </div>

              <div className="w-full mb-4">
                <form onSubmit={handleProceed}>
                  <div className="w-full mb-4">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={projectName}
                      onChange={ev => setProjectName(ev.target.value)}
                      className="w-full text-white py-2 my-2 bg-transparent shadow-md border border-grey-100 font-urbanist"
                    />
                  </div>

                  <div className="w-full mb-4">
                    <input
                      type="text"
                      placeholder="Description"
                      value={description}
                      onChange={ev => setDescription(ev.target.value)}
                      className="w-full text-white py-2 my-2 bg-transparent shadow-md border border-grey-100 font-urbanist"
                    />
                  </div>

                  <div className='w-full'>
                    <button
                      type="submit"
                      className='w-full text-white my-2 font-semibold rounded-md p-3 text-center flex items-center justify-center cursor-pointer'
                      style={gradientBgLeft}
                    >
                      Proceed
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
