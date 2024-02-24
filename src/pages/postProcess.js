import React from "react";
import "./postProcess.css";
import TableComponent from "./TableComponent";
import latoCertificate from "../images/lato_certificate.png";

function PostProcess() {
    const data = [
        { slNo: 1, email: "example1@example.com", name: "John Doe" },
        { slNo: 2, email: "example2@example.com", name: "Jane Doe" },
        { slNo: 3, email: "example3@example.com", name: "Alice" },
        { slNo: 4, email: "example4@example.com", name: "Bob" },
        { slNo: 5, email: "example5@example.com", name: "Charlie" },
      ];

    return (
    <div>
      <div className="post-process-head">
        <div className="title">CERT GEN</div>
        <div className="body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mollis aliquam ut porttitor leo a diam sollicitudin. Est velit egestas dui id ornare arcu odio ut sem.
        </div>
      </div>
      <TableComponent data={data} />
    </div>
  );
}

export default PostProcess;
