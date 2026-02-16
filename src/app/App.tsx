import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { PurchaseProvider } from '@/context/PurchaseContext';
import { Toaster } from '@/app/components/ui/sonner';

import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Home } from '@/pages/Home';
import { CampaignDetail } from '@/pages/CampaignDetail';
import { CampaignEdit } from '@/pages/CampaignEdit';
import { ChooseQuantity } from '@/pages/ChooseQuantity';
import { Checkout } from '@/pages/Checkout';
import { ProcessingPayment } from '@/pages/ProcessingPayment';
import { Result } from '@/pages/Result';
import { MyAccount } from '@/pages/MyAccount';

import { ProtectedRoute } from '@/app/routes/ProtectedRoute';
import { AdminRoute } from '@/app/routes/AdminRoute';

export default function App() {
  useEffect(() => {
    document.title = 'Amigos Premia';
  }, []);

  return (
    <PurchaseProvider>
      <BrowserRouter>
        <div className="dark">
          <Routes>
            {/* públicas */}
            <Route path="/" element={<Login />} />
            <Route path="/criar-conta" element={<Register />} />

            {/* protegidas */}
            <Route
              path="/campanhas"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/campanha/:id"
              element={
                <ProtectedRoute>
                  <CampaignDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/campanhas/editar/:id"
              element={
                <AdminRoute>
                  <CampaignEdit />
                </AdminRoute>
              }
            />

            <Route
              path="/escolher-cotas"
              element={
                <ProtectedRoute>
                  <ChooseQuantity />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/processando-pagamento"
              element={
                <ProtectedRoute>
                  <ProcessingPayment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/resultado"
              element={
                <ProtectedRoute>
                  <Result />
                </ProtectedRoute>
              }
            />

            <Route
              path="/minha-conta"
              element={
                <ProtectedRoute>
                  <MyAccount />
                </ProtectedRoute>
              }
            />
          </Routes>

          <Toaster position="top-center" />
        </div>
      </BrowserRouter>
    </PurchaseProvider>
  );
}
