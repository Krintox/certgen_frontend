import { useContext, useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useProject } from '../ProjectContext';
import logo from "../images/brand-logo.png";
import certificate from "../images/Image(1).png";
import googleIcon from "../images/google-icon.png";
import { HiEye, HiEyeOff } from "react-icons/hi"; // Import eye icons from react-icons library

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const { setUserInfo } = useContext(UserContext);
  const { setUserId } = useProject(); // Fix context usage
  const [showLeftDiv, setShowLeftDiv] = useState(true);

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

  async function login(ev) {
    ev.preventDefault();
    try {
      const response = await fetch('https://certgen-backend.vercel.app/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        const responseData = await response.json();
        const userId = responseData.id;
        console.log('login successful:', userId);
        setUserId(userId);
        setUserInfo(responseData);
        setRedirect(true);
      } else {
        alert('Wrong credentials');
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('An error occurred while logging in');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  const gradientBgLeft = {
    background: "linear-gradient(to bottom right, #FB360F, #F28A18)",
  };

  const gradientBgRight = {
    background: "linear-gradient(to right, #222029, #3B4148)",
  };

  return (
    <div className="flex justify-center items-center mt-12 mb-12">
      <div className="lg:w-3/4 md:w-3/4 flex justify-center items-center">
        <div className={`container mx-auto rounded-lg${showLeftDiv ? ' shadow-md' : ''} relative flex overflow-hidden h-5/6 w-10/12`}>
          {/* Left Side */}
          {showLeftDiv && (
            <div className="relative w-1/2 flex flex-col rounded-lg" style={gradientBgLeft}>
              <div className='absolute left-[10%] flex flex-col'>
                <h1 className='text-4xl text-white font-semibold mt-6 flex items-center z-10'>
                  <img src={logo} alt="logo" className="w-12 h-12 mr-2" />
                  <span className="text-white">WEBKITES</span>
                </h1>
                <p className='text-3xl text-white font-urbanist font-normal p-4'>
                  The only <br /> certificate <br /> automation <br /> tool you need
                </p>
              </div>
              <div className="absolute w-full bottom-0 pr-20">
                <img src={certificate} alt="Certificate" className="w-full md:5/6" />
              </div>
            </div>
          )}

          {/* Right Side */}
          <div className={`w-${showLeftDiv ? '1/2' : 'full'} h-full flex flex-col justify-center items-center p-6 rounded-lg`} style={gradientBgRight}>
            {/* Your existing right side content */}
            <div className='w-full flex flex-col max-w-[500px] bg-transparent md:my-12'>
              <div className="w-full flex-col mb-2 ">
                <h3 className="text-6xl mb-10 text-center text-white mt-12 bebas">WELCOME <span className="text-orange-400">BACK </span> </h3>
              </div>

              <div className="w-full flex flex-col">
                <form className="login" onSubmit={login}>
                  <input
                    type="text"
                    placeholder=" Username"
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}
                    className="text-white bg-transparent login-input focus:border-orange-400 font-urbanist"
                  /><br/>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder=" Password"
                      value={password}
                      onChange={ev => setPassword(ev.target.value)}
                      className="text-white bg-transparent login-input focus:border-orange-400 font-urbanist pr-12"
                    />
                    {/* Eye button to toggle password visibility */}
                    <button
                      type="button"
                      className="absolute top-1/2 transform -translate-y-1/2 right-3 text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <HiEyeOff /> : <HiEye />}
                    </button>
                  </div>

                  {/* <div className='w-full text-right'>
                    <p className='text-sm font-medium whitespace-nowrap cursor-pointer text-white font-urbanist mr-10 mt-4'>Forgot Password?</p>
                  </div> */}

                  <div className='w-full flex flex-col my-4'>
                    <button
                      type="submit"
                      className='w-full text-white my-2 rounded-md p-3 text-center flex items-center justify-center cursor-pointer'
                      style={gradientBgLeft}
                    >
                      Log in
                    </button>
                  </div>
                </form>

                <div className="w-full flex items-center justify-center">
                  <p className="text-sm font-normal text-white font-urbanist">Don't have an account? <Link to="/register" className="font-semibold underline underline-offset-2 cursor-pointer font-urbanist">Create account</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
