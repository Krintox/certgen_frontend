import React from 'react';

const PreviewPage = () => {
  // Example hardcoded data
  const hardcodedData = [
    { slNo: 1, email: 'john@example.com', name: 'John Doe' },
    { slNo: 2, email: 'jane@example.com', name: 'Jane Doe' },
    { slNo: 3, email: 'jane@example.com', name: 'Jane Doe' },
    { slNo: 4, email: 'jane@example.com', name: 'Jane Doe' },
    // Add more data as needed
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl md:text-5xl font-bold text-white border-b-2 under md:pb-2">CERT GEN - Preview</h1>
      <div className="w-full max-w-2xl bg-transparent rounded-lg shadow-md mt-20">
        {hardcodedData.length > 0 && (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
            <table className="w-full text-sm text-left rtl:text-right text-white border-separate border border-white">
              <thead className="text-xs text-white uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3 border-b border-r text-white">
                    SL No
                  </th>
                  <th scope="col" className="px-6 py-3 border-b text-white">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 border-b text-white">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 border-b text-white">
                    Click to Preview
                  </th>
                </tr>
              </thead>
              <tbody>
                {hardcodedData.map((entry) => (
                  <tr key={entry.slNo} className="border-b">
                    <td className="px-6 py-4 text-white">{entry.slNo}</td>
                    <td className="px-6 py-4 text-white">{entry.email}</td>
                    <td className="px-6 py-4 text-white">{entry.name}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="hover:text-indigo-900 bg-green-600 p-2">Preview</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-between mt-4 p-4">
          <button className="bg-orange-500 text-white py-2 px-4 rounded mr-2">Download as ZIP format</button>
          <button className="bg-orange-500 text-white py-2 px-4 rounded ml-2">Start mailing</button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
