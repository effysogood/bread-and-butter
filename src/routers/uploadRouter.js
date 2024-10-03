const express = require('express');
const { upload, bucket } = require('../views/upload/upload'); 
const fs = require('fs');
const uploadRouter = express.Router();

uploadRouter.post('/', upload.single('file'), (req, res, next) => {
    try {
      // 파일이 성공적으로 업로드 되었는지 확인
      if (req.file) {
        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream();
  
        blobStream.on('error', err => {
          console.error(err);
          next(err);
        });
  
        blobStream.on('finish', () => {
          // public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          res.status(200).json({
            message: 'File uploaded successfully',
            fileInfo: req.file,
            url: publicUrl
          });
        });
  
        // 파일 시스템에서 파일을 읽어서 스트림
      fs.createReadStream(req.file.path).pipe(blobStream);
    } else {
      throw new customError(400, 'File upload failed');
    }
  } catch (error) {
    next(error);
  }
});
  
  
  
  
  

module.exports = uploadRouter;