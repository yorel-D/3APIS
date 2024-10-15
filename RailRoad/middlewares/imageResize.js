//RailRoad/middlewares/imageResize.js
const sharp = require('sharp');

exports.resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  const { buffer } = req.file;

  // Resize image to 200x200px
  const resizedImage = await sharp(buffer)
    .resize(200, 200)
    .toBuffer();

  req.file.buffer = resizedImage;
  next();
};
