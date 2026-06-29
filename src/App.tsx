import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { Cadastro } from "@/pages/Cadastro";
import { CustomersPage } from "@/pages/CustomersPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/cadastro" replace />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="*" element={<Navigate to="/cadastro" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
