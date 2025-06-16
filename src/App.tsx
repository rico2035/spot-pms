import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import MainLayout from '@/layouts/MainLayout';

// Pages
import Dashboard from '@/pages/Dashboard';
import Buildings from '@/pages/Buildings';
import LayoutManagement from '@/pages/LayoutManagement';
import CarManagement from '@/pages/CarManagement';
import SpotManagement from '@/pages/SpotManagement';
import ApiDocumentation from '@/pages/ApiDocumentation';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

// Context Providers
import { BuildingsProvider } from '@/contexts/BuildingsContext';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { CarManagementProvider } from '@/contexts/CarManagementContext';
import { SpotManagementProvider } from '@/contexts/SpotManagementContext';

function App() {
  return (
    <>
      <BuildingsProvider>
        <LayoutProvider>
          <CarManagementProvider>
            <SpotManagementProvider>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="buildings" element={<Buildings />} />
                  <Route path="layout-management" element={<LayoutManagement />} />
                  <Route path="car-management" element={<CarManagement />} />
                  <Route path="spot-management" element={<SpotManagement />} />
                  <Route path="api-documentation" element={<ApiDocumentation />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </SpotManagementProvider>
          </CarManagementProvider>
        </LayoutProvider>
      </BuildingsProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;