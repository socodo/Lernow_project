import cloudinary from "@/config/cloudinaryConfig";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "demo-folder",
        allowed_formats: [
            "jpg", "png", "jpeg", "gif", "webp", // Image formats
            "mp4", "mov", "avi", // Video formats
            "pdf", "doc", "docx" // Document formats
        ],
        resource_type: "auto" // Tự động nhận diện loại file
    } as any // TypeScript workaround
})

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedMimes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/quicktime', 'video/x-msvideo',
        'application/pdf', 'application/msword',
        'application/octet-stream' // ← Generic binary file (cho video khi curl không detect đúng mimetype)
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
};

export const uploadMiddleware = multer({ 
    storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 }, // Giới hạn kích thước file: 200MB
    fileFilter: fileFilter // ← Thêm validation
});
