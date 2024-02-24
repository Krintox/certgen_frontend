import React from "react";
import "./TableComponent.css";

function TableComponent() {
  const data = [
    { slNo: 1, email: "example1@example.com", name: "John Doe" },
    { slNo: 2, email: "example2@example.com", name: "Jane Doe" },
    { slNo: 3, email: "example3@example.com", name: "Alice" },
    { slNo: 4, email: "example4@example.com", name: "Bob" },
    { slNo: 5, email: "example5@example.com", name: "Charlie" },
  ];

  return (
    <table className="custom-table">
      <thead>
        <tr>
          <th>SL No</th>
          <th>Email</th>
          <th>Name</th>
          <th>Click to Remove</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry) => (
          <tr key={entry.slNo}>
            <td>{entry.slNo}</td>
            <td>{entry.email}</td>
            <td>{entry.name}</td>
            <td>
              <button>
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableComponent;
