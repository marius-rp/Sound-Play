import { Router } from "express"

import adminSystemRoutes from "./admin/admin-system.route"
import adminUserRoutes from "./admin/admin-user.route"
import adminMusicRoutes from "./admin/admin-music.route"
import adminPlaylistRoutes from "./admin/admin-playlist.route"
import adminProxyRoutes from "./admin/admin-proxy.route"
import { authMiddleware } from "../middlewares/auth.middleware"

const router = Router()

router.use(authMiddleware)

// Toutes les requêtes commençant par /api/admin/system iront ici
router.use("/system", adminSystemRoutes)

// Toutes les requêtes commençant par /api/admin/user iront ici
router.use("/users", adminUserRoutes)

// Toutes les requêtes commençant par /api/admin/music iront ici
router.use("/musics", adminMusicRoutes)

// Toutes les requêtes commençant par /api/admin/playlist iront ici
router.use("/playlists", adminPlaylistRoutes)

// Toutes les requêtes commençant par /api/admin/proxy iront ici
router.use("/proxy", adminProxyRoutes)

export default router