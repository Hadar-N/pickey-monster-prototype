import {Route, Routes} from 'react-router-dom'
import { useState, createContext } from 'react';
import * as Realm from 'realm-web';
import './App.css';

import {CenterChildUsingFlex, MainWrapper} from './style/main_screen'
import LoginPage from './pages/login';
import HomePage from './pages/homepage';
import EntryPage from './pages/entry'

export const UserContext = createContext()

function App() {
  const [userData, setUserData] = useState({uid:"567"});

  const loginUser = async (user_id) => {
      try {
        const app = new Realm.App({ id: "picky-mon-gtvea" });
        const credentials = Realm.Credentials.anonymous();  
        const user = await app.logIn(credentials);
        setUserData({uid: user_id, uinstance: user})
      } catch(err) {
        console.error("Failed to log in", err);
      }
  }


  return (
    <UserContext.Provider value={userData}>
      <CenterChildUsingFlex><MainWrapper>
        <Routes>
          <Route path="/" element={<EntryPage/>} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage LoginFunc={loginUser}/>} />
        </Routes>
      </MainWrapper></CenterChildUsingFlex>
    </UserContext.Provider>
  );
}

export default App;
