const cloudinary = require('../Config/cloudinary')

const uploadToCloudinary = async(filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        return {
            url: result.secure_url,
            publicId: result.public_id
            //Secure_url and public_id are default attributes in cloudinary.
            //Url and publicId are defined in image schema.
        }
    } catch (error) {
        console.log(error, 'error while uploading to cloudinary');
        // throw new Error('Error')
    }
}

module.exports = {
    uploadToCloudinary
}