import { useNavigate } from "react-router-dom";
import "./welcome.css";

export function Welcome() {
  const navigate = useNavigate();

  const handleStartPlanning = () => {
    const existingTripDetails = localStorage.getItem("tripDetails");

    if (existingTripDetails) {
      navigate("/planner");
    } else {
      navigate("/enter-your-plans");
    }
  };

  return (
    <div className="welcome-container">
      <div className="title-container">
        <h1>Welcome to Planora!</h1>
        <p>Create your dream itinerary with ease and style.</p>
      </div>
      <div className="button-container">
        <button onClick={handleStartPlanning}>Start Planning &rarr;</button>
      </div>
    </div>
  );
}
