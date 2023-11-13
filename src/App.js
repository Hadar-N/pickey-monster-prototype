import {Route, Routes} from 'react-router-dom'
import './App.css';

import {CenterChildUsingFlex, MainWrapper} from './style/main_screen'
import LoginPage from './pages/login';
import HomePage from './pages/homepage';
import EntryPage from './pages/entry'
import { ConnectionProvider } from './utils/ConnectionContext';
import ReportPage from './pages/report';

// TODO: check if user is in. if not-> throw bback to entrypage
function App() {

  return (
    <ConnectionProvider>
      <CenterChildUsingFlex><MainWrapper>
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </MainWrapper></CenterChildUsingFlex>
    </ConnectionProvider>
  );
}

export default App;
