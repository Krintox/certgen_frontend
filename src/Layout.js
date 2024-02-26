import Header from "./Header";
import Footer from "./pages/Footer";
import {Outlet} from "react-router-dom";
import img from "./images/LandingPage.png";

export default function Layout() {
  return (
    <main>
      <Header />
      <div className=" min-h-[70vh] flex flex-col md:flex-row md:justify-between items-center md:mx-32 mx-5 mt-10">
      <div className=" w-full md:w-2/4">
        <img src={img} alt="img" />
      </div>
      <div className=" md:w-2/4 text-center">
        <h2 className=" text-5xl font-semibold leading-tight">
          EMPOWER YOUR <br></br>
          <span className="text-orange-600"> CERTIFICATE </span>CREATION
          <br></br>PROCESS WITH <br></br>
          <span className="text-orange-600">EASE </span>AND <span className="text-orange-600">EFFICIENCY</span>
        </h2>
      </div>
    </div>
    <div className="mb-10">

    </div>
    <Footer />
    </main>
  );
}