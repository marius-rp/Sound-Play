export const formatDateTime = (dateInput?: string | Date | null): string => {
  if (!dateInput) return "Non disponible"

  try {
    const date = new Date(dateInput)

    if (isNaN(date.getTime())) return "Date invalide"

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (error) {
    return "Erreur"
  }
}

export const formatDuration = (
  seconds: number | string | undefined | null,
): string => {
  // 1. Si la valeur est invalide, vide, ou non numérique, on renvoie le format par défaut
  if (seconds === undefined || seconds === null || seconds === "") {
    return "--:--"
  }

  // On s'assure d'avoir un nombre entier positif
  const totalSeconds = Math.max(0, Number(seconds))

  if (isNaN(totalSeconds)) {
    return "--:--"
  }

  // 2. Calcul des minutes et des secondes restantes
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = Math.floor(totalSeconds % 60)

  // 3. Formatage avec des zéros au début si nécessaire (ex: "5" devient "05")
  const paddedMinutes = String(minutes).padStart(2, "0")
  const paddedSeconds = String(remainingSeconds).padStart(2, "0")

  // 4. On retourne la chaîne finale
  return `${paddedMinutes}:${paddedSeconds}`
}
