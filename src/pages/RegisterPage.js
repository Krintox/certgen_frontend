import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import logo from "../images/brand-logo.png";
import certificate from "../images/Image(1).png";
import googleIcon from "../images/google-icon.png";

export default function RegisterPage() {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

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
      const response = await fetch('http://localhost:4000/register', {
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
    background: "linear-gradient(to right, #FFA500, #FF6347)",
  };

  const borderOrange = {
    border: "2px solid #FFA500",
  };

  const gradientBgRight = {
    background: "linear-gradient(to right, #333333, #666666)",
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container mx-auto p-6 rounded-lg shadow-md relative flex overflow-hidden h-5/6 w-10/12">
        {/* Left Side */}
        <div className="relative w-1/2 h-full flex flex-col rounded-lg" style={gradientBgLeft}>
          <div className='absolute top-[10%] left-[10%] flex flex-col'>
            <h1 className='text-4xl text-white font-bold my-4 flex items-center'>
              <img src={logo} alt="logo" className="w-12 h-12 mr-2" />
              <span>WEBKITES</span>
            </h1>
            <p className='text-3xl text-white font-urbanist font-normal'>
              The only <br /> certificate <br /> automation <br /> tool you need
            </p>
          </div>
          <img src={certificate} className="w-full h-full object-cover" />
        </div>

        {/* Right Side */}
        <div className="w-1/2 h-full flex flex-col justify-between items-center p-6 rounded-lg" style={gradientBgRight}>
          {/* Your existing right side content */}
          <div className='w-full flex flex-col max-w-[500px] bg-transparent'>
            <div className="w-full flex flex-col mb-2">
              <h3 className="text-3xl font-semibold mb-2 text-center text-white mt-18">CREATE AN ACCOUNT</h3>
            </div>
            <div className="rounded-lg p-4 mb-4 flex items-center" style={borderOrange}>
              <img src={googleIcon} alt="Google Icon" className="w-6 h-6 mr-2" />
              <span className="text-white ">Sign up with Google</span>
            </div>
            <p className="text-white mb-4 text-center">- OR -</p>
            <form className="Register" onSubmit={Register}>
              <input
                type="text"
                placeholder="Name"
                value={username}
                onChange={(ev) => setName(ev.target.value)}
                className="w-full text-white py-2 my-2 bg-transparent shadow-md outline-none focus:outline-none"
              />


              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className="w-full text-white py-2 my-2 bg-transparent shadow-md outline-none focus:outline-none"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(ev) => setConfirmPassword(ev.target.value)}
                className="w-full text-white py-2 my-2 bg-transparent shadow-md outline-none focus:outline-none"
              />

              <div className='w-full flex items-center justify-between'>
                <p className='text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2 text-white'>
                  Already have an account?{' '}
                  <Link to="/login" className="text-orange font-semibold">
                    Log in
                  </Link>
                </p>
              </div>

              <div className='w-full flex flex-col my-4'>
                <button
                  type="submit"
                  className='w-full text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer'
                  style={gradientBgLeft}>
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
