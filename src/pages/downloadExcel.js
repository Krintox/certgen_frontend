import React from 'react';
import { useLocation } from 'react-router-dom';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import { MdOutlineFileDownload } from "react-icons/md";

const ExcelDownload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { annotations, canvasImage, resizedImage } = state || {};

  const createExcelWorkbook = async (annotations) => {
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

    annotations.forEach((annotation, index) => {
      const columnHeader = annotation.word;
      const columnWidth = 20; // Example width, adjust as needed
      const columnIndex = index + 1; // Start column index from 1

      // Adding header for the column
      annoSheet.getColumn(columnIndex).values = [columnHeader];
      annoSheet.getColumn(columnIndex).width = columnWidth;

      // Setting style for header
      annoSheet.getColumn(columnIndex).eachCell(cell => {
        cell.font = { bold: true };
      });
    });

    const emailColumnIndex = annotations.length + 1; // Assuming 1-based indexing
    annoSheet.getColumn(emailColumnIndex).values = ['Email']; // Header
    annoSheet.getColumn(emailColumnIndex).width = 20; // Adjust width as needed

    // Setting style for email column header
    annoSheet.getColumn(emailColumnIndex).eachCell(cell => {
      cell.font = { bold: true };
    });

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const blob = new Blob([buffer], { type: fileType });

      // Make file download in user's browser
      saveAs(blob, `ExcelWorkbook${EXCEL_EXTENSION}`);

      // Conclude function
      console.log("Your file has been downloaded successfully!");
      navigate('/excel', { state: { annotations, canvasImage, resizedImage} })
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <h1 className="text-7xl md:text-8xl font-semibold text-white border-b-2 under md:pb-2 bebas">CERT GEN</h1>
      <p className="text-white text-center font-urbanist text-md md:text-lg lg:text-xl xl:text-2xl m-8"> {/* Increased padding */}
        Download the excel sheet with the columns as the annotations mentioned
      </p>
      <div className="w-3/4 max-w-md bg-transparent rounded-lg shadow-md md:mt-4">
        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg max-md:py-12 md:p-8"> {/* Added padding */}
          <button onClick={() => createExcelWorkbook(annotations)} className="mt-4 bg-blue-500 text-white py-4 px-6 rounded-full"> {/* Increased height */}
            <MdOutlineFileDownload className="md:text-6xl max-md:text:3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExcelDownload;
