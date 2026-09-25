import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrizeMotor from './pages/Prizemotor';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import LayoutsAdmin from './layout/layoutAdmin';
import PagesAdmin from './pages/admin/data-perserta';
import Dashboard from './component/dashboard';
import WinnerPage from './pages/admin/data-winner';
import GrandPrize from './pages/GrandPrize';
import Datadoorprize from './pages/admin/data-doorprize';

const App: React.FC = () => {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<PrizeMotor />} />
        <Route path="/gr" element={<GrandPrize />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/admin" element={<LayoutsAdmin />}>
          <Route index element={<Dashboard />} />

          <Route path="data-peserta" element={<PagesAdmin />} />
          <Route path="data-doorprize" element={<Datadoorprize />} />
          <Route path="data-winner" element={<WinnerPage />} />

        </Route>


      </Routes>

      {/* </Layout> */}
      <Routes>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
