// backend/src/middlewares/upload.middleware.ts
import multer from "multer"
import path from "path"
import fs from "fs"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Pointe vers le dossier storage à la racine de ton backend
    const dir = path.join(process.cwd(), "storage/cover_playlist")

    // Crée le dossier s'il n'existe pas
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    // Récupère l'extension originale (.jpg, .png, etc.)
    const ext = path.extname(file.originalname)
    // Renomme le fichier avec l'ID de la playlist passé dans l'URL
    cb(null, `${req.params.id}${ext}`)
  },
})

export const uploadCoverMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Seules les images sont autorisées."))
    }
  },
})
