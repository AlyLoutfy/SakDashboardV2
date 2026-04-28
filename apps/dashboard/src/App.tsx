import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import SalesLayout from "./layouts/SalesLayout";
import IntegrationsPage from "./pages/IntegrationsPage";
import DesignsPage from "./pages/DesignsPage";
import ReportsPage from "./pages/ReportsPage";
import PaymentPlansPage from "./pages/PaymentPlansPage";
import ChequesCollectionPage from "./pages/ChequesCollectionPage";
import InventoryDataPage from "./pages/InventoryDataPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import ChequeConfirmationPage from "./pages/ChequeConfirmationPage";
import WalletEditPage from "./pages/WalletEditPage";
import BlockingRequestsPage from "./pages/BlockingRequestsPage";
import ReservationRequestsPage from "./pages/ReservationRequestsPage";
import ComponentLibraryPage from "./pages/ComponentLibraryPage";
import CompoundsPage from "./pages/sales/CompoundsPage";
import CompoundUnitsPage from "./pages/sales/CompoundUnitsPage";
import UnitDetailsPage from "./pages/sales/UnitDetailsPage";
import MyReservationsPage from "./pages/sales/MyReservationsPage";
import EOIsPage from "./pages/sales/EOIsPage";
import AnalyticsPage from "./pages/sales/AnalyticsPage";
import SalesMonitorPage from "./pages/sales/SalesMonitorPage";
import LeadsPage from "./pages/sales/LeadsPage";
import LeadActivitiesPage from "./pages/sales/LeadActivitiesPage";
import NotificationsPage from "./pages/sales/NotificationsPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Dashboard Routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/inventory" replace />} />
          <Route path="inventory" element={<InventoryDataPage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="designs" element={<DesignsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="payment-plans" element={<PaymentPlansPage />} />
          <Route path="cheques" element={<ChequesCollectionPage />} />
          <Route path="cheques/client/:clientId" element={<ClientDetailPage />} />
          <Route path="cheques/confirm/:pendingId" element={<ChequeConfirmationPage />} />
          <Route path="cheques/wallet/:clientId/:unitCode/edit" element={<WalletEditPage />} />
          <Route path="blocking-requests" element={<BlockingRequestsPage />} />
          <Route path="reservation-requests" element={<ReservationRequestsPage />} />
          <Route path="components" element={<ComponentLibraryPage />} />
        </Route>

        {/* Sales Tool Routes */}
        <Route path="/sales" element={<SalesLayout />}>
          <Route index element={<Navigate to="/sales/compounds" replace />} />
          <Route path="compounds" element={<CompoundsPage />} />
          <Route path="compounds/:compoundId" element={<CompoundUnitsPage />} />
          <Route path="compounds/:compoundId/unit/:unitId" element={<UnitDetailsPage />} />
          <Route path="reservations" element={<MyReservationsPage />} />
          <Route path="eois" element={<EOIsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="monitor" element={<SalesMonitorPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="lead-activities" element={<LeadActivitiesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
