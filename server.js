

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); //Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const multer = require('multer'); //Multer adds a body object and a file object to the request object. The body object contains the values of the text fields of the form, the file object contains the files uploaded via the form.
//const upload = multer({ dest: './uploads/' });
const logger = require('morgan');
const port = 8080; // Define port for app to listen on
const app =  express();

const {
   Aborter,
   BlockBlobURL,
   ContainerURL,
   ServiceURL,
   StorageURL,
   SharedKeyCredential,
   uploadStreamToBlockBlob
 } = require('@azure/storage-blob');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('myFile');
const getStream = require('into-stream');
const containerName = 'rblobcontainer';
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
const ONE_MINUTE = 60 * 1000;

const sharedKeyCredential = new SharedKeyCredential(
   process.env.AZURE_STORAGE_ACCOUNT_NAME,
   process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY);
 const pipeline = StorageURL.newPipeline(sharedKeyCredential);
 const serviceURL = new ServiceURL(
   `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
   pipeline
 );

 const getBlobName = originalName => { // Use a random number to generate a unique file name, 
   // removing "0." from the start of the string.
   const identifier = Math.random().toString().replace(/0\./, ''); 
   return `${identifier}-${originalName}`;
 };
 
app.use(logger('dev'));  // Creating a logger (using morgan)
app.use(bodyParser());  // to use bodyParser (for data transfer between client and server)
app.use(express.static('.'));  // making current directory as a static directory
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/upload', uploadStrategy, async (req, res) => {

   const aborter = Aborter.timeout(30 * ONE_MINUTE);
   const blobName = getBlobName(req.file.originalname);
   const stream = getStream(req.file.buffer);
   const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
   const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);
   
   try {
       
       await uploadStreamToBlockBlob(aborter, stream,
       blockBlobURL, uploadOptions.bufferSize, uploadOptions.maxBuffers);
   
       res.redirect('/');   
   
   } catch (err) {
   
       res.json(err); 
   
   }
   });



   app.get('/images', async(req, res) => {
      const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
  
      try {
  
      const listBlobsResponse = await containerURL.listBlobFlatSegment(Aborter.none);
  
      for (const blob of listBlobsResponse.segment.blobItems) {
          console.log(`Blob: ${blob.name}`);
      }
          res.json(listBlobsResponse.segment.blobItems);
  
      } catch (err) {
  
          res.status(500);
  
      }
  });

//app.post('/upload', upload.single('myFile'), (req, res) => {  // POST /upload for single file upload
// res.redirect('/')   // Redirecting back to the home local host:4000/
//});

app.use(express.static('.'));

app.listen(port, () => {   // To make the server live
   console.log(`App is live on port ${port}`);
});


