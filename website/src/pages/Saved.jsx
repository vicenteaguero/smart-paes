// website/src/pages/Saved.jsx

import { Link } from "react-router-dom";
import "../styles/ensayos.css";

export default function Saved() {
  return (
    <div className="saved-container">
      <h1 className="page-title saved">Respuestas Guardadas</h1>
      <p className="success-message">
        ✅ Tus respuestas han sido enviadas con éxito. No necesitas hacer nada
        más.
      </p>
      <div className="ensayos-buttons-centered">
        <Link to="/start-ensayo" className="return-button">
          Volver a Ensayos
        </Link>
      </div>
    </div>
  );
}
