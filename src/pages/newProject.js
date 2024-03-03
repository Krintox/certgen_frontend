import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import logo from "../images/brand-logo.png";
import certificate from "../images/Image(1).png";

export default function NewProject() {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function handleProceed(ev) {
    ev.preventDefault();

    // Here, you can perform actions such as saving the project details

    // Redirect logic
    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  const gradientBgLeft = {
    background: "linear-gradient(to right, #FFA500, #FF6347)",
  };

  const gradientBgRight = {
    background: "linear-gradient(to right, #333333, #666666)",
  };

  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center h-screen w-3/4 ">
        <div className="container mx-auto rounded-lg shadow-md relative flex overflow-hidden h-5/6 w-10/12">
          {/* Left Side */}
          <div className="relative w-1/2 h-full flex flex-col rounded-lg" style={gradientBgLeft}>
            <div className='absolute left-[10%] flex flex-col'>
              <h1 className='text-4xl text-white font-bold mt-6 flex items-center z-10'>
                <img src={logo} alt="logo" className="w-12 h-12 mr-2" />
                <span className="text-white">WEBKITES</span>
              </h1>
              <p className='text-3xl text-white font-urbanist font-normal'>
                The only <br /> certificate <br /> automation <br /> tool you need
              </p>
            </div>
            <div className="absolute w-full bottom-0">
              <img src={certificate} alt="Certificate" className="w-full h-3/5 z-0" />
            </div>
          </div>

          {/* Right Side */}
          <div className="w-1/2 h-full flex flex-col justify-between items-center p-6 rounded-lg" style={gradientBgRight}>

            <div className='w-full flex flex-col max-w-[500px] bg-transparent'>
              <div className="w-full flex flex-col mb-2">
                <h3 className="text-3xl font-semibold mb-2 text-center text-white mt-24">LET'S BEGIN</h3>
              </div>

              <div className="w-full flex flex-col">
                <form onSubmit={handleProceed}>
                  <div className="w-full">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={projectName}
                      onChange={ev => setProjectName(ev.target.value)}
                      className="w-full text-white py-2 my-2 bg-transparent shadow-md outline-none focus:outline-none"
                    />
                  </div>

                  <div className="w-full">
                    <textarea
                      placeholder="Description"
                      value={description}
                      onChange={ev => setDescription(ev.target.value)}
                      className="w-full text-white py-2 my-2 bg-transparent shadow-md border=black outline-none focus:outline-none"
                    />
                  </div>

                  <div className='w-full flex items-center justify-between'>
                    <p className='text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2 text-white'>
                      Forgot Password?
                    </p>
                  </div>

                  <div className='w-full flex flex-col my-4'>
                    <button
                      type="submit"
                      className='w-full text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer'
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
