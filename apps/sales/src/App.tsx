import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import SalesLayout from "./layouts/SalesLayout";
import UnitDetailsPage from "./pages/UnitDetailsPage";
import MyReservationsPage from "./pages/MyReservationsPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SalesLayout />}>
          <Route index element={<Navigate to="/unit" replace />} />
          <Route path="unit" element={<UnitDetailsPage />} />
          <Route path="reservations" element={<MyReservationsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
