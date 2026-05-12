import { Request, Response } from "express"
import fs from "fs"
import { playMusicService } from "../services/playMusic.service"
import { logger } from "../../utils/logger.helper"

const FILE_NAME = "playMusic.controller.ts"

export const streamMusic = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id || "SYSTEM"

  try {
    const musicId = req.params.id
    if (!musicId) {
      return res.status(400).send("ID de musique manquant.")
    }

    // On utilise le service pour trouver le fichier
    const filePath = await playMusicService.getMusicFilePath(musicId as string)
    if (!filePath) {
      return res.status(404).send("Fichier audio introuvable.")
    }

    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    const range = req.headers.range

    // Si le navigateur demande un morceau spécifique (Streaming standard)
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)

      // On envoie des "morceaux" d'environ 1 Mo à la fois
      const CHUNK_SIZE = 10 ** 6 // 1 MB
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : Math.min(start + CHUNK_SIZE, fileSize - 1)

      const chunksize = end - start + 1
      const fileStream = fs.createReadStream(filePath, { start, end })

      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "audio/mpeg", // Tu peux ajuster selon l'extension si besoin
      }

      res.writeHead(206, head)
      fileStream.pipe(res)

      fileStream.on("error", (err) => {
        logger(
          userId,
          FILE_NAME,
          "ERROR",
          `Erreur flux de lecture: ${err.message}`,
        )
        res.end()
      })
    } else {
      // Cas de secours si le navigateur ne gère pas le streaming (rare)
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "audio/mpeg",
      }
      res.writeHead(200, head)
      fs.createReadStream(filePath).pipe(res)
    }
  } catch (error: any) {
    logger(
      userId,
      FILE_NAME,
      "ERROR",
      `Erreur critique streamMusic: ${error.message}`,
    )
    if (!res.headersSent) {
      res.status(500).send("Erreur interne du serveur.")
    }
  }
}
