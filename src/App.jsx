import { Routes, Route, Navigate } from "react-router-dom";
import WhiskersEstimator from "../WhiskersEstimator.jsx";

export default function App() {
  return (
    <Routes>
      {/* Main estimator route */}
      <Route path="/estimator" element={<WhiskersEstimator />} />

      {/* Redirect root to /estimator */}
      <Route path="/" element={<Navigate to="/estimator" replace />} />

      {/* Catch-all: also redirect to /estimator */}
      <Route path="*" element={<Navigate to="/estimator" replace />} />
    </Routes>
  );
}
