const express = require("express");
const authMiddleware = require("../Middlewares/auth-middlewares");
const isAdminUser = require("../Middlewares/admin-middlewares");
const uploadMiddleware = require("../Middlewares/upload-middlewares");
const {
  uploadImageController,
  fetchImagesController,
  deleteImageCloudAndDatabase
} = require("../controllers/image-controller");
const router = express.Router();

//upload the image
router.post(
  "/upload",
  authMiddleware,
  isAdminUser,
  uploadMiddleware.single("image"),
  uploadImageController
);

router.get("/get", authMiddleware, fetchImagesController);

//to get all the images

router.delete("/delete/:id", authMiddleware, deleteImageCloudAndDatabase);


module.exports = router;
