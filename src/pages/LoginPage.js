import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import logo from "../images/Logo.png";
import certificate from "../images/Image(1).png";

export default function LoginPage() {
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

  return (
    <div className="flex flex-col min-h-screen md:flex-row rounded-2xl bg-gray-100">
      <div className="md:w-full md:max-w-sm bg-gradient-to-br from-orange-500 to-yellow-600 rounded-tl-2xl rounded-bl-2xl relative flex flex-col items-center justify-center">
        <div className='mb-8'>
          <img src={logo} alt="logo" className="w-16 h-16 mr-4" />
          <p className='text-lg text-white font-normal'>The only certificate automation tool you need</p>
        </div>
        <img src={certificate} className="absolute bottom-0 left-0 w-32 h-32" alt="certificate" />
      </div>
      <div className="md:w-full md:max-w-md bg-gradient-to-br from-gray-800 to-gray-600 rounded-tr-2xl p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">WELCOME <span className="text-orange-500">BACK</span></h2>
        <div className="w-full">

          <form className="login" onSubmit={login}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={ev => setUsername(ev.target.value)}
              className="w-full text-white py-2 my-2 bg-transparent outline-none focus:outline-none login-input"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={ev => setPassword(ev.target.value)}
              className="w-full text-white py-2 my-2 bg-transparent border-b border-white outline-none focus:outline-none login-input"
            />
            <div className='w-full flex flex-col my-4'>
              <button
                className='w-full text-white my-2 font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer bg-orange-500'
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
