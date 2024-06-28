import React from 'react';
import { useLocation } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import { MdOutlineFileDownload } from "react-icons/md";
import Footer from './Footer';

const ExcelDownload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { annotations, canvasImage, resizedImage, numberOfCertificates } = state || {};

  const createExcelWorkbook = async (annotations, numberOfCertificates) => {
    if (!annotations) return;

    // Creating and setting up Excel Workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'YourPlatformName';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.views = [
      {
        x: 0, y: 0, width: 10000, height: 20000,
        firstSheet: 0, activeTab: 0, visibility: 'visible'
      }
    ];

    const annoSheet = workbook.addWorksheet('Data', {});

    // Add unique ID column as the first column
    const idColumnIndex = 1;
    annoSheet.getColumn(idColumnIndex).values = ['Unique ID'];
    annoSheet.getColumn(idColumnIndex).width = 20;

    // Adding other headers
    annotations.forEach((annotation, index) => {
      const columnHeader = annotation.word;
      const columnWidth = 20; // Example width, adjust as needed
      const columnIndex = index + 2; // Start column index from 2 because 1 is for Unique ID

      // Adding header for the column
      annoSheet.getColumn(columnIndex).values = [columnHeader];
      annoSheet.getColumn(columnIndex).width = columnWidth;

      // Setting style for header
      annoSheet.getColumn(columnIndex).eachCell(cell => {
        cell.font = { bold: true };
      });
    });

    // Add email column as the last column
    const emailColumnIndex = annotations.length + 2;
    annoSheet.getColumn(emailColumnIndex).values = ['Email'];
    annoSheet.getColumn(emailColumnIndex).width = 20;

    // Generate rows and capture unique IDs
    const uniqueIDs = [];
    for (let i = 0; i < numberOfCertificates; i++) {
      const uniqueID = Math.floor(10000000 + Math.random() * 90000000).toString(); // 8-digit unique ID
      uniqueIDs.push(uniqueID);

      const row = [uniqueID];
      annotations.forEach(() => row.push('')); // Adjust as per your requirement
      row.push(''); // Placeholder for email
      annoSheet.addRow(row);
    }

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const blob = new Blob([buffer], { type: fileType });

      // Make file download in user's browser
      saveAs(blob, `ExcelWorkbook${EXCEL_EXTENSION}`);

      // Conclude function
      console.log("Your file has been downloaded successfully!");
      navigate('/excel', { state: { annotations, canvasImage, resizedImage, uniqueIDs } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <h1 className="text-7xl md:text-8xl font-semibold text-black border-b-2 under md:pb-2 bebas mt-10">CERTTO</h1>
      <p className="text-black text-center font-urbanist text-md md:text-lg lg:text-xl xl:text-2xl m-8">
        Download the excel sheet with the columns as the annotations mentioned
      </p>
      <div className="w-3/4 max-w-md bg-transparent rounded-lg shadow-md md:mt-4 mb-20">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-black rounded-lg max-md:py-12 md:p-8">
          <button onClick={() => createExcelWorkbook(annotations, numberOfCertificates)} className="bg-blue-500 text-black py-4 px-6 rounded-full">
            <MdOutlineFileDownload className="md:text-3xl max-md:text:3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelDownload;
