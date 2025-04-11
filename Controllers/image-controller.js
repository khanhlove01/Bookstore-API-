const Image = require('../Models/Image')
const {uploadToCloudinary} = require('../Helper/cloudinaryHelper')
const fs = require('fs')
const cloudinary = require('cloudinary')
const uploadImageController = async(req,res) => {
    try {

        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "No file is founded"
            })
        }

        console.log('====================================');
        console.log("User info: in image controller");
        console.log(req.userinfo);
        console.log('====================================');
        const {url, publicId} = await uploadToCloudinary(req.file.path)

        const newUploadImage = new Image({
            url,
            publicId,
            uploadBy: req.userinfo.userId
        })

        await newUploadImage.save()

        fs.unlinkSync(req.file.path)

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: newUploadImage
        })
        
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');

        res.status(500).json({
            success: false,
            message: 'Something wrong'
        })
    }
}

const fetchImagesController = async(req,res) => {
    try {

        const page = parseInt(req.query.page) || 1; ///images?page=3&limit=10
        const limit = parseInt(req.query.limit) || 2; // Gets the limit parameter (how many items per page).
        const skip = (page-1)*limit; //Page 1: (1 - 1) * 5 = 0 → skip 0, Page 2: (2 - 1) * 5 = 5 → skip first 5 items
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const images = await Image.find().limit(limit).skip(skip).sort(sortObj)
        console.log(images);
        

        if(images){
            res.status(200).json({
                success: true,
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                data: images
            })
        }
        
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');

        res.status(500).json({
            success: false,
            message: 'Something wrong'
        })
    }
}

const deleteImageCloudAndDatabase = async(req,res) => {
    try {
        console.log("Iam in delete cloud");
        
        const getCurrentId = req.params.id;
        const userId = req.userinfo.userId;
        const image = await Image.findById(getCurrentId)
        console.log('====================================');
        console.log(userId);
        console.log(image);
        console.log(image.uploadBy.toString());
        console.log('====================================');
        if(!image){
            return res.status(404).json({
                success: false,
                message: "Image not found"
            })
        }

        if(image.uploadBy.toString() !== userId){
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this image'
            })
        }

        await cloudinary.uploader.destroy(image.publicId)

        await Image.findByIdAndDelete(getCurrentId)

        res.status(200).json({
            success: true,
            message: "image deleted successfully"
        })
        
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');

        res.status(500).json({
            success: false,
            message: 'Something wrong'
        })
    }
}

module.exports = {uploadImageController,fetchImagesController,deleteImageCloudAndDatabase}