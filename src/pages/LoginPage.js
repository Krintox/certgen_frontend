import { useContext, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import logo from "../images/brand-logo.png";
import certificate from "../images/Image(1).png";
import googleIcon from "../images/google-icon.png";

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (response.ok) {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert('Wrong credentials');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
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
              <img src={certificate} alt="Certificate" className="w-full h-5/6 z-0" />
            </div>
          </div>

          {/* Right Side */}
          <div className=" w-3/5 h-full flex flex-col justify-between items-center p-6 rounded-lg" style={gradientBgRight}>
            {/* Your existing right side content */}
            <div className='w-full flex flex-col max-w-[500px] bg-transparent'>
              <div className="w-full flex flex-col mb-2">
                <h3 className="text-4xl font-semibold mb-10 text-center text-white mt-12 ">WELCOME <span className="text-orange-500">BACK </span> </h3>
              </div>

              <div className="w-full flex flex-col">
                <form className="login" onSubmit={login}>
                  <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}
                    className="w-full text-white py-2 my-2 bg-transparent shadow-md outline-none focus:outline-none"
                  />

                  <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    className="w-full text-white py-2 my-2 bg-transparent shadow-md outline-none focus:outline-none"
                  />

                  <div className='w-full flex items-center justify-between'>
                    <p className='text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2 text-white'>Forgot Password?</p>
                  </div>

                  <div className='w-full flex flex-col my-4'>
                    <button type="submit"
                      className='w-full text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer'
                      style={gradientBgLeft}
                    >
                      Log in
                    </button>
                  </div>
                </form>

                <div className="w-full flex items-center justify-center">
                  <p className="text-sm font-normal text-white">Don't have an account? <span className="font-semibold underline underline-offset-2 cursor-pointer">Create account</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
