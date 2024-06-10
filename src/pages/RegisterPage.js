import { useContext, useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import logo from "../images/brand-logo.png";
import certificate from "../images/Image(1).png";
import googleIcon from "../images/google-icon.png";

export default function RegisterPage() {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [showLeftDiv, setShowLeftDiv] = useState(false); // State to control visibility of left div
  const { setUserInfo } = useContext(UserContext);

  // Function to check screen size and set showLeftDiv state accordingly
  const checkScreenSize = () => {
    setShowLeftDiv(window.innerWidth >= 1280);
  };

  useEffect(() => {
    // Check screen size when component mounts
    checkScreenSize();
    // Add event listener to listen for screen size changes
    window.addEventListener('resize', checkScreenSize);

    // Cleanup function to remove event listener when component unmounts
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  async function Register(ev) {
    ev.preventDefault();

    // Check if any of the fields are empty
    if (!username || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('https://certgen-backend.vercel.app/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        alert('Registration successful');
        setRedirect(true);
      } else {
        const data = await response.json();
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed. Please try again.');
    }
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
                  <span className="text-white">CER<span className="text-orange-500">TTO</span></span>
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
          <div className={`w-${showLeftDiv ? '1/2' : 'full'} z-10 bg-white text-black h-full flex flex-col justify-center items-center p-6 rounded-lg`} style={{ marginLeft: showLeftDiv ? '-1%' : '0' }} >
            {/* Your existing right side content */}
            <div className='w-full flex flex-col max-w-[500px] bg-transparent md:my-12'>
              <div className="w-full flex flex-col mb-2">
                <h3 className="text-3xl md:text-5xl mb-6 md:mb-10 text-center text-black mt-12 bebas">CREATE AN <span className="text-orange-400">ACCOUNT</span></h3>
              </div>
              {/* <div className="rounded-lg p-4 mb-4 items-center text-center flex justify-center border-2 border-orange-500">
                <img src={googleIcon} alt="Google Icon" className="w-6 h-6 mr-2" />
                <span className="text-white font-urbanist">Sign up with Google</span>
              </div>
              <p className="text-white mb-4 text-center bebas text-3xl">- OR -</p> */}
              <form className="Register" onSubmit={Register}>
                <input
                  type="text"
                  placeholder="Name"
                  value={username}
                  onChange={(ev) => setName(ev.target.value)}
                  className="text-black bg-transparent login-input focus:border-orange-400 font-urbanist mb-4 w-full"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  className="text-black bg-transparent login-input focus:border-orange-400 font-urbanist mb-4 w-full"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(ev) => setConfirmPassword(ev.target.value)}
                  className="text-black bg-transparent login-input focus:border-orange-400 font-urbanist mb-4 w-full"
                />

                <div className='w-full flex items-center justify-between mb-4'>
                  <p className='text-sm md:text-base font-medium whitespace-nowrap cursor-pointer text-black font-urbanist text-wrap'>
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold underline underline-offset-2 cursor-pointer font-urbanist text-orange-500">
                      Log in
                    </Link>
                  </p>
                </div>
                <div className='w-full flex flex-col'>
                  <button
                    type="submit"
                    className='w-full text-black my-2 rounded-md p-3 text-center flex items-center justify-center cursor-pointer'
                    style={gradientBgLeft}>
                    Create Account
                  </button>
                </div>
              </form>
              {redirect && <Navigate to="/login" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
