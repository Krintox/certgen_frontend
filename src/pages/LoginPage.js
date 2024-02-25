import {useContext, useState} from "react";
import {Navigate} from "react-router-dom";
import {UserContext} from "../UserContext";
import logo from "../images/brand-logo.png"
import certificate from "../images/Image(1).png"

export default function LoginPage() {
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [redirect,setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);
  async function login(ev) {
    ev.preventDefault();
    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
    });
    if (response.ok) {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
        setRedirect(true);
      });
    } else {
      alert('wrong credentials');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }

  const gradientBgLeft = {
    background: "linear-gradient(to right, #FFA500, #FF6347)",
  };

  const gradientBgRight = {
    background: "linear-gradient(to right, #333333, #666666)",
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md relative">
    <div className="flex h-full overflow-hidden">
      <div className="relative w-1/2 h-full flex flex-col" style={gradientBgLeft}>
        <div className='absolute top-[10%] left-[10%] flex flex-col'>
          <h1 className='text-4xl text-white font-bold my-4 flex items-center'>
            <img src={logo} alt="logo" className="w-12 h-12 mr-2" />
            <span>WEBKITES</span>
          </h1>
          <p className='text-xl text-white font-normal'> The only certificate automation tool you need </p>
        </div>
          <img src={certificate} className="w-full h-full object-cover" />
      </div>
      <div className="w-1/2 h-full flex flex-col p-20 justify-between items-center" style={gradientBgRight}>
      
        <div className='w-full flex flex-col max-w-[500px] bg-transparent'>
          <div className="w-full flex flex-col mb-2">
            <h3 className="text-3x1 font-semibold mb-2 text-center text-white">WELCOME BACK</h3>
          </div>

          <div className="w-full flex flex-col">
            <form className="login" onSubmit={login}>
              <input type="text"
                placeholder="username"
                value={username}
                onChange={ev => setUsername(ev.target.value)}
                className="w-full text-white py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none" />

              <input type="password"
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)} 
                className="w-full text-white py-2 my-2 bg-transparent border-b border=black outline-none focus:outline-none" />

              <div className='w-full flex items-center justify-between'>    
                <p className='text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2 text-white'>Forgot Password?</p>
              </div>
            
              <div className='w-full flex flex-col my-4'>
                <button className='w-full text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer' style={gradientBgLeft}>
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
  );
}