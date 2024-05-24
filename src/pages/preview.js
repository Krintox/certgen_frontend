import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import JSZip from 'jszip';
import Modal from 'react-modal';
import LoadingComponent from './LoadingPage';
import './styles/modal.css';
import { IoMdClose } from "react-icons/io";
import * as XLSX from 'xlsx';
import Footer from './Footer';
import QRCode from 'qrcode.react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

Modal.setAppElement('#root');

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const annotations = location.state.annotations || {};
  const resizedImage = location.state.uploadImage || {};
  const uploadedExcelFile = location.state.uploadedExcelFile || {};
  const [resultImages, setResultImages] = useState([]);
  const [resultEmails, setResultEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showProceedButton, setShowProceedButton] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [qrCodes, setQRCodes] = useState([]);

  // AWS S3 Configuration
  const s3Client = new S3Client({
    region: process.env.REACT_APP_AWS_REGION,
    credentials: {
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    },
  });

  useEffect(() => {
    if (!isLoading && resultImages.length > 0 && resultEmails.length > 0) {
      setShowProceedButton(true);
    }
  }, [isLoading, resultImages, resultEmails]);

  const generateImageUrl = (fileName) => {
    return `https://${process.env.REACT_APP_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
  };

  const uploadToS3 = async (file, fileName) => {
    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read',
    };

    const command = new PutObjectCommand(params);
    return s3Client.send(command);
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    if (annotations && resizedImage && uploadedExcelFile) {
      try {
        const response = await fetch(resizedImage);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', { type: blob.type });

        const formData = new FormData();
        formData.append('coordinates', JSON.stringify(annotations));
        formData.append('image', file);
        formData.append('excel', uploadedExcelFile);

        const apiResponse = await axios.post('https://aliws.pythonanywhere.com/api', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Response from server:', apiResponse.data);
        const { result_images, result_emails } = apiResponse.data;
        setResultImages(result_images);
        setResultEmails(result_emails);

        const qrCodeUrls = result_images.map((_, index) => {
          const fileName = `image_${index + 1}.png`;
          return generateImageUrl(fileName);
        });

        const generatedQRCodes = qrCodeUrls.map((url, index) => (
          <QRCode value={url} key={index} />
        ));

        setQRCodes(generatedQRCodes);

        const uploadPromises = result_images.map(async (base64String, index) => {
          const byteCharacters = atob(base64String);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/png' });
          const fileName = `image_${index + 1}.png`;

          return uploadToS3(blob, fileName);
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error('Error fetching preview:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Missing Values');
      setIsLoading(false);
    }
  };

  const handleBulkDownload = () => {
    const zip = new JSZip();
    const imagesFolder = zip.folder('images');

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const firstColumnValues = [];

      XLSX.utils.sheet_to_json(sheet, { header: 1 }).forEach((row) => {
        firstColumnValues.push(row[0]);
      });

      resultImages.forEach((base64String, index) => {
        const name = firstColumnValues[index + 1] || `name`;
        const fileName = `${name}_${index + 1}.png`;
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        imagesFolder.file(fileName, blob);
      });

      zip.generateAsync({ type: 'blob' }).then((content) => {
        const blobUrl = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `images_${new Date().toISOString()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      });
    };
    reader.readAsArrayBuffer(uploadedExcelFile);
  };

  const handleProceed = async () => {
    setIsLoading(true);
    const presignedUrls = await Promise.all(
      resultImages.map((_, index) => generatePresignedUrl(`image_${index + 1}.png`))
    );
    console.log('Presigned URLs:', presignedUrls);
    setIsLoading(false);
  };
  
  return (
    <div>
      <h1>Preview Page</h1>
      {isLoading && <LoadingComponent />}
      {resultImages.length > 0 && (
        <div>
          <h2>Generated Images</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {resultImages.map((base64String, index) => (
              <div key={index} style={{ margin: '10px' }}>
                <img
                  src={`data:image/png;base64,${base64String}`}
                  alt={`Result ${index + 1}`}
                  style={{ width: '200px', height: 'auto' }}
                  onClick={() => setSelectedImage(`data:image/png;base64,${base64String}`)}
                />
                <div>{qrCodes[index]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showProceedButton && (
        <button onClick={handleBulkDownload}>Bulk Download</button>
      )}
      <Footer />
      <Modal
        isOpen={!!selectedImage}
        onRequestClose={() => setSelectedImage(null)}
        contentLabel="Image Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <button onClick={() => setSelectedImage(null)} className="Modal-close">
          <IoMdClose />
        </button>
        {selectedImage && <img src={selectedImage} alt="Selected" style={{ width: '100%' }} />}
      </Modal>
    </div>
  );
};

export default PreviewPage;
