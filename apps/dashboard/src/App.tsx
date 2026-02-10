import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import SalesLayout from "./layouts/SalesLayout";
import IntegrationsPage from "./pages/IntegrationsPage";
import DesignsPage from "./pages/DesignsPage";
import ReportsPage from "./pages/ReportsPage";
import PaymentPlansPage from "./pages/PaymentPlansPage";
import BlockingRequestsPage from "./pages/BlockingRequestsPage";
import ReservationRequestsPage from "./pages/ReservationRequestsPage";
import ComponentLibraryPage from "./pages/ComponentLibraryPage";
import UnitDetailsPage from "./pages/sales/UnitDetailsPage";
import MyReservationsPage from "./pages/sales/MyReservationsPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Dashboard Routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/integrations" replace />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="designs" element={<DesignsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="payment-plans" element={<PaymentPlansPage />} />
          <Route path="blocking-requests" element={<BlockingRequestsPage />} />
          <Route path="reservation-requests" element={<ReservationRequestsPage />} />
          <Route path="components" element={<ComponentLibraryPage />} />
        </Route>

        {/* Sales Tool Routes */}
        <Route path="/sales" element={<SalesLayout />}>
          <Route index element={<Navigate to="/sales/unit" replace />} />
          <Route path="unit" element={<UnitDetailsPage />} />
          <Route path="reservations" element={<MyReservationsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
