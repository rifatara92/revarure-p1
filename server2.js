const express = require('express')
const app = express()
const port = 8080
const multer  = require('multer')
const upload = multer({ dest: __dirname+'/uploads' })
const fs = require('fs')
const path = require('path')
const dirPath = path.join(__dirname, "/uploads")
const {
 Aborter,
 BlobURL,
 BlockBlobURL,
 ContainerURL,
 ServiceURL,
 StorageURL,
 SharedKeyCredential,
 uploadStreamToBlockBlob
} = require('@azure/storage-blob');

// const express = require('express');
const router = express.Router();
// const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image');
const getStream = require('into-stream');
const containerName = 'images';
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };
const ONE_MINUTE = 60 * 1000;

const sharedKeyCredential = new SharedKeyCredential(
 'coolguyaccountss',
 'RCdrK9QQ43nJMSWAOi/U6n1bJpOgtcPVi9pzipabddU8mwWvteLzUu9Gk5Z6NT3nP3UBT6xQFT2aoJbkQJ6TUA==');
const pipeline = StorageURL.newPipeline(sharedKeyCredential);
const serviceURL = new ServiceURL(
 `https://coolguyaccountss.blob.core.windows.net`,
 pipeline
);

const getBlobName = originalName => {
 // Use a random number to generate a unique file name,
 // removing "0." from the start of the string.
 const identifier = Math.random().toString().replace(/0\./, '');
 return `${identifier}-${originalName}`;
};

app.post('/profile', uploadStrategy, async (req, res) => {
   const aborter = Aborter.timeout(30 * ONE_MINUTE);
   const blobName = getBlobName(req.file.originalname);
   const stream = getStream(req.file.buffer);
   const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);
   const blockBlobURL = BlockBlobURL.fromContainerURL(containerURL, blobName);


   try {
       await uploadStreamToBlockBlob(aborter, stream,
           blockBlobURL, uploadOptions.bufferSize, uploadOptions.maxBuffers);
           res.redirect("/")

       } catch (err) {
           res.json(err)

 }
});

// app.post('/profile', upload.single('avatar'), function (req, res) {
//     res.redirect("/")
// })

app.get('/images', (req, res) => {
   fs.readdir(dirPath, (err, files) => {
       if(err) {
           res.send("you suck")
       } else {
           res.json(files)
       }
   })
})

app.use(express.static('.'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))