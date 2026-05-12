import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { BrowserRouter } from "react-router-dom"

// --- ENREGISTREMENT DU SERVICE WORKER ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW enregistré avec succès : ", registration.scope);
      })
      .catch((error) => {
        console.log("L'enregistrement du SW a échoué : ", error);
      });
  });
}
// ----------------------------------------

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)