import multer from 'multer';

const maxSizeArchive = {
    "1MB": 1024 * 1024, 
    "2MB": 2 * 1024 * 1024,  
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxSizeArchive['2MB']}
})

export { upload }