import { Router } from "express"
import { streamMusic } from "../controllers/playMusic.controller"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = Router()

router.use(authMiddleware)

// Route pour écouter la musique en streaming
router.get("/:id", streamMusic)

export default router