import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import PetMedicines from "./components/PetMedicines.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/medicines/:petId" element={<PetMedicines />} />
      </Routes>
    </Router>
  </StrictMode>
);
