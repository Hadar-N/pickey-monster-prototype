import {Route, Routes, useLocation, useNavigate} from 'react-router-dom'
import './App.css';

import { useEffect } from 'react';
import { useConnection } from './utils/ConnectionContext';
import {CenterChildUsingFlex, MainWrapper} from './style/main_screen'

import LoginPage from './pages/login';
import HomePage from './pages/homepage';
import EntryPage from './pages/entry'
import ReportPage from './pages/report';
import ChooseMonster from './pages/choosemonster';

function App() {
  const user = useConnection();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if(!user?.sid && !["/", "/login"].includes(location?.pathname)) {
      navigate('/');
    }
  }, [user] )

  return (
      <CenterChildUsingFlex><MainWrapper>
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/choosemon" element={<ChooseMonster />} />
        </Routes>
      </MainWrapper></CenterChildUsingFlex>
  );
}

export default App;
