import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DashboardLayout } from './layouts/DashboardLayout';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorksPage } from './pages/WorksPage';
import { WorkDetailPage } from './pages/WorkDetailPage';
import { GisMapPage } from './pages/GisMapPage';
import { AlertsPage } from './pages/AlertsPage';
import { InspectionsPage } from './pages/InspectionsPage';
import { InsightsPage } from './pages/InsightsPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { ReportsPage } from './pages/ReportsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="works" element={<WorksPage />} />
            <Route path="works/:id" element={<WorkDetailPage />} />
            <Route path="map" element={<GisMapPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="inspections" element={<InspectionsPage />} />
            <Route path="insights" element={<InsightsPage />} />
            <Route path="data-quality" element={<DataQualityPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
