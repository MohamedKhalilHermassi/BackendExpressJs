const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      const uploadPath = 'uploads/coursesImages';

      if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
      }
            cb(null, 'uploads/coursesImages');
      },
    filename: function(req, file, cb) {
      cb(null, `${new Date().getTime()}--${file.originalname}`);
    }
  });
  
  const upload = multer({ storage: storage });

  module.exports = upload;