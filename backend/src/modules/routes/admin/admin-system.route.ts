import { Router } from "express"
import { getStats, getLogs, clearCache, clearPreviews, getDownloadSettings, updateDownloadSetting, updateBinaries } from "../../controllers/admin/admin-system.controller"

const router = Router()

// Statistiques et logs
router.get("/getAllStats", getStats)
router.get("/getLogs", getLogs)

// Nettoyage des caches
router.post("/clearCache", clearCache)
router.post("/clearPreviews", clearPreviews)

// Gestion des téléchargements et binaires
router.get("/getDownloadSettings", getDownloadSettings)
router.put("/updateDownloadSetting", updateDownloadSetting)
router.post("/updateBinarie", updateBinaries)

export default router