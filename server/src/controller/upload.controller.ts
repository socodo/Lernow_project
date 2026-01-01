import cloudinary from '@/config/cloudinaryConfig';
import { Request, Response } from 'express';

export const handleImageUpload = async (req: Request, res: Response) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const uploadedFiles = req.files.map((file: Express.Multer.File) => ({
            url: file.path,
            public_id: file.filename,
            size: file.size,
            mimetype: file.mimetype,
            type: file.mimetype.startsWith('video/') ? 'video' :
                file.mimetype.startsWith('image/') ? 'image' : 'document'
        }));
        console.log('Uploaded files info:', uploadedFiles);

        return res.status(200).json({
            success: true,
            message: `${uploadedFiles.length} file(s) uploaded successfully`,
            files: uploadedFiles // ← Đổi từ 'images' thành 'files'
        });

    } catch (error) {
        console.error('Image upload error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }

};

export const handleImageRemove = async (req: Request, res: Response) => {
    try {
        // Lấy public_id từ request body
        const { publicId } = req.body

        console.log('🗑️  DELETE REQUEST RECEIVED')
        console.log('📋 Received public_id from FE:', publicId)
        console.log('📂 Full Cloudinary path:', publicId)

        if (!publicId) {
            console.log('❌ ERROR: No public_id provided')
            return res.status(400).json({
                success: false,
                message: 'No id provided'
            });
        }

        console.log('🔥 Trying to destroy as VIDEO first...')
        
        // Try deleting as video first (most common for this app)
        let results = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
        console.log('📹 Video attempt response:', results)
        
        // If not found as video, try as image
        if (results.result === 'not found') {
            console.log('⚠️ Not found as video, trying as IMAGE...')
            results = await cloudinary.uploader.destroy(publicId)
            console.log('🖼️ Image attempt response:', results)
        }
        
        // If still not found, return error
        if (results.result === 'not found') {
            console.log('❌ File not found in Cloudinary as both video and image')
            return res.status(404).json({
                success: false,
                message: 'File not found in Cloudinary',
                details: results
            });
        }
        
        if (results.result === 'ok') {
            console.log('✅ File deleted successfully from Cloudinary')
        }
        
        return res.status(200).json({
            success: true,
            message: 'Image removed successfully',
            details: results
        });

    } catch (error) {
        console.error('❌ Image removal error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}