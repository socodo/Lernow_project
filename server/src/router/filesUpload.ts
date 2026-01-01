import { handleImageRemove } from './../controller/upload.controller';
import { Router } from "express";
import { uploadMiddleware } from "../middlewares/upload.middleware";
import { handleImageUpload } from "../controller/upload.controller";

const routerFiles = Router();

// Upload nhiều ảnh (tối đa 10)
routerFiles.post('/upload', uploadMiddleware.array('files', 10), handleImageUpload);

// Remove image - receive publicId from body instead of URL param
routerFiles.delete('/remove', handleImageRemove);

export default routerFiles;
