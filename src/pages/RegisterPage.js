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
    background: "linear-gradient(to bottom right, #FB360F, #F28A18)",
  };

  const borderOrange = {
    border: "2px solid #FFA500",
  };

  const gradientBgRight = {
    background: "linear-gradient(to right, #222029, #3B4148)",
  };

  return (
    <div className="flex justify-center items-center mt-12 mb-12">
      <div className="flex justify-center items-center w-3/4 ">
        <div className="container mx-auto rounded-lg shadow-md relative flex w-10/12">
          {/* Left Side */}
          <div className="relative w-1/2 flex flex-col rounded-lg" style={gradientBgLeft}>
            <div className='absolute left-[10%] flex flex-col'>
              <h1 className='text-4xl text-white font-bold mt-8 flex items-center z-10'>
                <img src={logo} alt="logo" className="w-12 h-12 mr-2 mb-1" />
                <span className="text-white">WEBKITES</span>
              </h1>
              <p className='text-3xl text-white font-urbanist font-normal pt-4'>
                The only <br /> certificate <br /> automation <br /> tool you need
              </p>
            </div>
            <div className="absolute w-full bottom-0">
              <img src={certificate} alt="Certificate" className="w-full h-5/6 z-0" />
            </div>
          </div>

          {/* Right Side */}
          <div className="w-1/2 flex flex-col justify-between items-center p-6 rounded-lg" style={{ ...gradientBgRight, flex: '1' }}>
            {/* Your existing right side content */}
            <div className='w-full flex flex-col max-w-[500px] bg-transparent'>
              <div className="w-full flex flex-col mb-2">
                <h3 className="text-5xl mb-10 text-center text-white mt-12 ">CREATE AN <span className="text-orange-500">ACCOUNT</span></h3>
              </div>
              <div className="rounded-lg p-4 mb-4 items-center text-center flex justify-center" style={borderOrange}>
                <img src={googleIcon} alt="Google Icon" className="w-6 h-6 mr-2" />
                <span className="text-white font-urbanist">Sign up with Google</span>
              </div>
              <p className="text-white mb-4 text-center font-urbanist">- OR -</p>
              <form className="Register" onSubmit={Register}>
                <input
                  type="text"
                  placeholder="Name"
                  value={username}
                  onChange={(ev) => setName(ev.target.value)}
                  className="text-white bg-transparent login-input focus:border-orange-400 font-urbanist mb-4"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  className="text-white bg-transparent login-input focus:border-orange-400 font-urbanist mb-4"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(ev) => setConfirmPassword(ev.target.value)}
                  className="text-white bg-transparent login-input focus:border-orange-400 font-urbanist mb-4"
                />

                <div className='w-full flex items-center justify-between mb-4'>
                  <p className='text-sm font-medium whitespace-nowrap cursor-pointer text-white font-urbanist'>
                    Already have an account?{' '}
                    <Link to="/login" className="text-orange font-urbanist">
                      Log in
                    </Link>
                  </p>
                </div>

                <div className='w-full flex flex-col'>
                  <button
                    type="submit"
                    className='w-full text-white my-2 rounded-md p-4 text-center flex items-center justify-center cursor-pointer'
                    style={gradientBgLeft}>
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}