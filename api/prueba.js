const AWS = require('aws-sdk');
const fs = require("fs");
require('dotenv').config();

// Load environment variables
const accessKeyId = process.env.ACCESO;
const secretAccessKey = process.env.ACCESO_SECRETO;
const bucketName = "practica1-g6-imagenes1";
const filePath = "archivo2.txt";
const uploadKey = "perros"; // Desired key in S3 bucket



// Configure AWS credentials
AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region: 'us-east-2' // Replace with your desired region if different
});

// Create an S3 client
const s3 = new AWS.S3();

// Upload the file
s3.upload({
  Bucket: bucketName,
  Key: uploadKey,
  Body: filePath
})
.on('httpUploadProgress', (progress) => {
  console.log(`Upload progress: ${progress.loaded} / ${progress.total}`);
})
.send((err, data) => {
  if (err) {
    console.error("Error uploading file:", err);
  } else {
    console.log("File uploaded successfully:", data.Location);
  }
});
