import * as Realm from 'realm-web';
import { createContext, useContext, useState } from 'react';
import { USER_ACTIONS, USER_STATUSES } from './consts';

const UserContext = createContext();
const UserActionsContext = createContext();

export function useConnection() {
  return useContext(UserContext)
}
export function useUserActions() {
  return useContext(UserActionsContext)
}

// TODO: add loader!
export function ConnectionProvider ({children}) {
  const [user, setUser] = useState({});
  const [userInstance, setUserInstance] = useState();

  async function userActions (actionType, params = {}) {
    switch(actionType) {
      case USER_ACTIONS.LOGIN:
        await connectUser(params.uid)
        break;
      case USER_ACTIONS.ACTIVATE_USER:
        await activateUser(params.sugar_amount)
        break;
      case USER_ACTIONS.REPORT_SNACK:
        await reportSnack(params.snackName, params.snackTotalSugar)
        break;
      default:
        alert(`actionType: ${actionType} not supported`)
    }

  }

  async function activateUser (sugarIntake) {
    const res = await userInstance.functions.activate_user({uid: user.uid, sugar_amount: sugarIntake})
    setUser({...user, sid:USER_STATUSES.TEST_USER, sugar_amount: sugarIntake})
    console.log(res)
  }

  async function reportSnack (snackName, snackTotalSugar) {
    try{
      await userInstance.functions.add_report({uid: user.uid, snack_name: snackName, snack_total_sugar: snackTotalSugar})
      alert("Snack added successfully!")
    } catch (err) {
      alert(err)
    }
  }

  async function connectUser (userId) {
    try {
      // connect to userinstance
      let userConnect = userInstance;
      if(!userConnect) {
        const app = new Realm.App({ id: "picky-mon-gtvea" });
        const credentials = Realm.Credentials.anonymous();  
        userConnect = await app.logIn(credentials);
        setUserInstance(userConnect)
      }

      //get and analyze user data
      const userData = await userConnect.functions.get_user_data({uid: Number(userId)})
      switch (userData.length){
        case 0:
          alert('user not found')
          break;
        case 1:
          setUser({
            uid: userData[0].uid,
            sid: userData[0].sid,
            uname: userData[0].username,
            sugar_amount: userData[0].sugar_amount,
            monster_type: userData[0].monster_type
  
          })
          break;
          default:
            alert('multiple users, please contact us')
      }
      
    } catch(err) {
      console.error("Failed to log in", err);
    }
  }

    return(
      <UserContext.Provider value={user}>
        <UserActionsContext.Provider value={userActions}>
          {children}
        </UserActionsContext.Provider>
      </UserContext.Provider>
  )
}