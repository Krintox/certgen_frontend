import Header from "./Header";
import Footer from "./pages/Footer";
import img from "./images/LandingPage.png";
import iconCertificate from "./images/iconCertificate.png";
import rocketImage from "./images/rocket.png";
import signup from "./images/login.png";
import upload from "./images/upload.png";
import data from "./images/extract.png";
import generate from "./images/generate.png";
import download from "./images/export.png";

export default function Layout() {
  return (
    <main>
      <Header />
      <div className="min-h-[70vh] flex flex-col md:flex-row md:justify-between items-center md:mx-32 mx-5 mt-10">
        <div className="w-full md:w-2/4">
          <img src={img} alt="img" />
        </div>
        <div className="md:w-2/4 text-center">
          <h2 className="text-5xl font-semibold leading-tight">
            EMPOWER YOUR <br/>
            <span className="text-orange-600">CERTIFICATE </span>CREATION
            <br /> PROCESS WITH <br />
            <span className="text-orange-600">EASE </span>AND <span className="text-orange-600">EFFICIENCY</span>
          </h2>
        </div>
      </div>
      <p className="w-full h-20 bg-amber-600 bg-opacity-20 rounded-lg border-transparent text-white flex items-center text-xl align-middle justify-center mt-10 leading-tight font-semibold">
        CHOOSE US FOR AUTOMATED, CUSTOMIZABLE CERTIFICATE CREATION WITH SEAMLESS DATA INTEGRATION,
        USER- <br/> FRIENDLY INTERFACE, AND TOP-NOTCH SECURITY.
      </p>
      <div className="text-left ml-10 mr-10 mb-10">
        <h2 className="text-5xl font-semibold leading-tight flex items-center">
          <img src={iconCertificate} alt="Icon Certificate" className="mr-4 mt-3" />
          <p className="text-left text-orange-500">HOW TO USE</p>
          <img src={rocketImage} alt="Rocket" className="ml-4" />
        </h2>

        {/* Four Divs Section */}
        <div className="flex flex-col ml-20 mr-29 mb-20">
          {/* First Row */}
          <div className="flex flex-row items-start w-full mb-6">
            <img src={signup} alt="SignUp" className="mr-4 mt-3" />
            <div className=" w-full text-orange p-4 rounded-md text-orange-500 text-5xl font-semibold leading-tight mb-5">
              SIGN UP
            </div>
            <div className="w-full text-white mt-4 text-3xl">
              Create your account by providing your details.
            </div>
          </div>

          {/* Second Row */}
          <div className="flex flex-row items-start mt-8 md:mt-0">
            <div className="w-full text-white mt-4 text-3xl">
              Upload your certificate templates and <br/> an excel sheet containing the details of the participants and other necessary deets.
            </div>
            <img src={upload} alt="upload" className="mr-4 mt-4" />
            <div className="w-full text-orange p-4 rounded-md text-orange-500 text-5xl font-semibold leading-tight">
              UPLOAD <br /> YOUR <br /> TEMPLATES
            </div>
          </div>

          {/* Third Row */}
          <div className="flex flex-row items-start mt-8 w-full">
            <img src={data} alt="extraction" className="mr-4 mt-4" />
            <div className="w-full text-orange p-4 rounded-md text-orange-500 text-5xl font-semibold leading-tight">
              DATA <br />EXTRACTION
            </div>
            <div className="w-full text-white mt-4 text-3xl">
              The ML model will do all the automation while you sit back and watch it all happen in a matter of seconds.
            </div>
          </div>

          {/* Fourth Row */}
          <div className="flex flex-row items-start mt-8 w-full">
            <div className="w-full text-white mt-5 text-3xl">
              Generate certificates dynamically filled <br/> with the deets provided in the excel.
            </div>
            <img src={generate} alt="generate" className="mr-4 mt-4" />
            <div className="w-full text-orange p-4 rounded-md text-orange-500 text-5xl font-semibold leading-tight">
              GENERATE <br /> CERTIFICATES
            </div>
          </div>

          {/* Fifth Row */}
          <div className="flex flex-row items-start mt-8 w-full">
            <img src={download} alt="download" className="mr-4 mt-4" />
            <div className="w-full text-orange p-4 rounded-md text-orange-500 text-5xl font-semibold leading-tight">
              DOWNLOAD <br /> THE <br /> CERTIFICATES
            </div>
            <div className="w-full text-white mt-4 text-3xl">
              Download the dynamically generated certificates in a .ZIP format.
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
