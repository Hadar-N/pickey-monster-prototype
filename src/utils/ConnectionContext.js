import * as Realm from 'realm-web';
import { createContext, useContext, useState } from 'react';
import { USER_ACTIONS, USER_STATUSES } from './consts';

const LoadingContext = createContext();
const UserContext = createContext();
const UserActionsContext = createContext();

export function useIsLoading() {
  return useContext(LoadingContext)
}
export function useConnection() {
  return useContext(UserContext)
}
export function useUserActions() {
  return useContext(UserActionsContext)
}

export function ConnectionProvider ({children}) {
  const [user, setUser] = useState({});
  const [userInstance, setUserInstance] = useState();
  const [isLoading, setIsLoading] = useState(false)
  const [nutritionixData, setNutData] = useState(); 

  async function userActions (actionType, params = {}) {
    setIsLoading(true);
    switch(actionType) {
      case USER_ACTIONS.LOGIN:
        await connectUser(params.uid)
        break;
      case USER_ACTIONS.ACTIVATE_USER:
        await activateUser(params.sugarAmount)
        break;
      case USER_ACTIONS.REPORT_SNACK:
        await reportSnack(params.snackName, params.snackTotalSugar)
        break;
      case USER_ACTIONS.GET_ALL_BASE_MONSTERS:
        return getBaseMonsters();
      case USER_ACTIONS.CHOOSE_MONSTER:
        await chooseMonster(params.monsterType, params.monsterImg)
        break;
      case USER_ACTIONS.GET_NUTRITIONIX_DATA:
        const returnData = await getNutritionixData();
        setIsLoading(false);
        return returnData;
      case USER_ACTIONS.ADD_TO_NUTRITIONIX_COUNT:
        await addToNutritionixCount(params.amountOfCalls)
        break;
      default:
        alert(`actionType: ${actionType} not supported`)
    }
    setIsLoading(false);
  }

  function getErrMessage(err) {
    console.log({err, mes: err.message})
    return (err.message).includes("Cannot read properties of undefined") ? "error in connection, please retry logging in" : err.error;
    
  }  

  async function activateUser (sugarIntake) {
    try{
      const res = await userInstance.functions.activate_user({uid: user.uid, sugar_amount: sugarIntake})
      setUser({...user, sid:USER_STATUSES.TEST_USER, sugarAmount: sugarIntake})
      console.log(res)
    } catch (err) {
      console.log(err)
      alert(getErrMessage(err))
    }
  }

  async function getBaseMonsters () {
    try{
      const res = await userInstance.functions.get_base_monsters();
      console.log(res);
      return res;
    } catch (err) {
      console.log(err)
      alert(getErrMessage(err))
    }
  }

  async function chooseMonster (monsterType, monsterImg) {
    try{
      console.log(user.uid, monsterType, monsterImg)
      const res = await userInstance.functions.attach_mon_to_user({uid: user.uid, mon_type: monsterType});
      setUser({...user, monsterImg })
      console.log(res, monsterType, monsterImg);
    } catch (err) {
      console.log(err)
      alert(getErrMessage(err))
    }
  }

  async function reportSnack (snackName, snackTotalSugar) {
    try{
      await userInstance.functions.add_report({uid: user.uid, snack_name: snackName, snack_total_sugar: snackTotalSugar})
      const newReporsts = [...user.reports, {
        uid: user.uid, snack_name: snackName, snack_total_sugar: snackTotalSugar, timestamp: new Date().getTime()
    }]
      setUser({...user, reports: newReporsts })
      alert("Snack added successfully!")
    } catch (err) {
      alert(getErrMessage(err))
      throw new Error(err)
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
      if(userData.uid && userData.username) {
        setUser({
          uid: userData.uid,
          sid: userData.sid,
          uname: userData.username,
          sugarAmount: userData.sugar_amount,
          monsterType: userData.mon_type,
          monsterImg: userData.mon_link,
          reports: userData.reports || []
        })
      } else {
        alert('user not found')
      }      
    } catch(err) {
      console.error("Failed to log in", err);
    }
  }

  async function getNutritionixData () {
    let res;

    if(nutritionixData){
      res = nutritionixData;
    } else {
      try{
        res = await userInstance.functions.get_nutrition_keys();
        console.log({res})
        setNutData(res);
      } catch (err) {
        alert(getErrMessage(err))
        throw new Error(err)
      }
    }

    return {count : res.curr_count, keys : res.keys.sort((a,b) => a.loc > b.loc ? 1 : -1)[0]}
  }

  async function addToNutritionixCount (amountOfCalls) {
    try{
      console.log(amountOfCalls)
      const res = await userInstance.functions.add_to_nutrition_count({add_to_count: amountOfCalls});
      setNutData({...nutritionixData, count: nutritionixData.count+amountOfCalls })
      console.log(res);
    } catch (err) {
      console.log(err)
      alert(getErrMessage(err))
    }
  }
    return(
      <LoadingContext.Provider value={isLoading}>
        <UserContext.Provider value={user}>
          <UserActionsContext.Provider value={userActions}>
            {children}
          </UserActionsContext.Provider>
        </UserContext.Provider>
      </LoadingContext.Provider>
  )
}