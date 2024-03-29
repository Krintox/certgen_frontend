import img from "../images/LandingPage.png";
import iconCertificate from "../images/iconCertificate.png";
import rocketImage from "../images/rocket.png";
import signup from "../images/login.png";
import upload from "../images/upload.png";
import data from "../images/extract.png";
import generate from "../images/generate.png";
import download from "../images/export.png";
import Footer from "./Footer";
import smallRocket from "../images/small-rocket.png";

export default function LandingPage() {

  const rows = [
    {
      image: signup,
      alt: "SignUp",
      heading: "SIGN UP",
      text: "Create your account by providing your details.",
    },
    {
      image: upload,
      alt: "upload",
      heading: "UPLOAD YOUR TEMPLATES",
      text: "Upload your certificate templates and an excel sheet containing the details of the participants and other necessary details.",
    },
    {
      image: data,
      alt: "extraction",
      heading: "DATA EXTRACTION",
      text: "The ML model will do all the automation while you sit back and watch it all happen in a matter of seconds.",
    },
    {
      image: generate,
      alt: "generate",
      heading: "GENERATE CERTIFICATES",
      text: "Generate certificates dynamically filled with the details provided in the excel.",
    },
    {
      image: download,
      alt: "download",
      heading: "DOWNLOAD THE CERTIFICATES",
      text: "Download the dynamically generated certificates in a .ZIP format.",
    },
  ];

  

  return (
    <main>
      <div className="min-h-[70vh] flex flex-col md:flex-row md:justify-between items-center md:mx-32 mx-5 mt-10">
        <div className="w-full md:w-2/4">
          <img src={img} alt="img" className="w-full" />
        </div>
        <div className="md:w-2/4">
          <h2 className="text-4xl md:text-7xl leading-tight text-center md:text-right">
            <img src={smallRocket} alt="smallRocket" className="inline mr-2" />
            EMPOWER YOUR <span className="text-orange-600 underline underline-offset-4">CERTIFICATE </span>CREATION PROCESS WITH <span className="text-orange-600 underline underline-offset-4">EASE </span>AND <span className="text-orange-600 underline underline-offset-4">EFFICIENCY</span>
            <img src={smallRocket} alt="smallRocket" className="inline ml-2" />
          </h2>
        </div>
      </div>
      <p className="w-full h-auto bg-amber-600 bg-opacity-20 rounded-lg border-transparent text-white flex items-center text-lg md:text-3xl align-middle justify-center mt-10 leading-tight text-center border" style={{ borderColor: "#7D7263", padding: "1rem" }}>
        CHOOSE US FOR AUTOMATED, CUSTOMIZABLE CERTIFICATE CREATION WITH SEAMLESS DATA INTEGRATION,
        USER- <br/> FRIENDLY INTERFACE, AND TOP-NOTCH SECURITY.
      </p>

      <div className="text-left mx-5 md:ml-10 md:mr-10 mb-10" id="how-to-use">
        <h2 className="text-2xl md:text-6xl font-semibold leading-tight flex items-center text-center md:text-left">
          <img src={iconCertificate} alt="Icon Certificate" className="mr-4 mt-3" />
          <span style={{ color: "#F66714" }}>HOW TO USE</span>
          <img src={rocketImage} alt="Rocket" className="ml-4" />
        </h2>

        {/* Five Divs Section */}
        <div className="flex flex-col mx-5 md:ml-20 md:mr-20 mb-20">
          {/* Mapping through rows */}
          {rows.map((row, index) => (
            <div key={index} className={`flex flex-col items-start w-full mb-8 md:flex-row md:mb-12 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
              <img src={row.image} alt={row.alt} className="self-center mt-3 md:mr-6 md:ml-6" />
              <div className="text-orange self-center p-4 rounded-md text-lg md:text-5xl leading-tight mt-8 md:mt-0 md:p-4 md:ml-4" style={{ color: "#F66714" }}>
                {row.heading}
              </div>
              <div className="text-white text-md md:text-3xl font-urbanist text-center md:text-left mt-8 md:mt-0 md:p-4 md:mr-4">
                {row.text}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
