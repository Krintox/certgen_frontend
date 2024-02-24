import React from 'react';

const Preview = ({ excelData }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl md:text-5xl font-bold text-white border-b-2 under md:pb-2">CERT GEN - Preview</h1>
      <div className="w-full max-w-md bg-transparent rounded-lg shadow-md mt-20">
        {excelData.length > 0 && (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-white-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    SL No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody>
                {excelData.map((entry) => (
                  <tr key={entry.slNo} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4">{entry.slNo}</td>
                    <td className="px-6 py-4">{entry.email}</td>
                    <td className="px-6 py-4">{entry.name}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="hover:text-indigo-900 bg-orange-600 p-2">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
