import convert from 'convert-units'
import axios from 'axios'

import { useUserActions } from "../utils/ConnectionContext"
import { useMemo, useRef, useState } from 'react'
import { USER_ACTIONS } from './consts'

const NUTRITIONIX_BASE = "https://trackapi.nutritionix.com/v2"
const TEXT_SEARCH_API = "/natural/nutrients"
const INSTANT_API = "/search/instant"
const SEARCH_BY_ID_API = "/search/item"

const TOTAL_SUGARS_ID = 269;
const ADDED_SUGARS_ID = 539;
export const SUPPORTED_UNITS = ['gr', 'ml'];
const NUTRITIONIX_API_AMOUNT = 50;

const ERR_MESSAGES = {
    FOOD_NOT_FOUND : "We couldn't match any of your foods",
    UNSUPPORTED_UNIT_PREFIX: "Unsupported unit",
    INCOMPATIBLE_MEASURES_PREFIX: "Cannot convert incompatible measures",
    UNAUTHORIZED: "Request failed with status code 401"
}

const MAX_ITEMS = 5;

// TODO: force get to 50 (forceFifty)
// TODO: create more nutrition keys

export function useNutritionix() {
    const userActions = useUserActions();
    const [headersData, setHeaders] = useState({});
    const countRef = useRef(0);
    const forceFifty = useRef(false);

    const getHeadersBasedOnCount = useMemo(() => {
        if(!Object.keys(headersData).length) {
            const getData= async() => {
                const res = await userActions(USER_ACTIONS.GET_NUTRITIONIX_DATA)
                setHeaders({...res, count: res.count%NUTRITIONIX_API_AMOUNT});
            }
            getData();    
        } else if ((headersData.count + countRef.current) <= NUTRITIONIX_API_AMOUNT) return headersData.keys[0];
        else return headersData.keys[1]
    }, [headersData, countRef])

    const callApi = async ({method, body, url}) => {
        let response;
        try{
            response = await axios({
                method,
                headers: getHeadersBasedOnCount,
                url: `${NUTRITIONIX_BASE}${url}`,
                data: body
            });
        } catch (err) {
            console.error("callApi", {err, message: err.message})
            response = err;
        }

        return response;
    }

    const searchItems = async (weight, unit, name) => { 
        const res = [];
        try{
            const freeSearchRes = await searchByFreeText(`${weight}${unit} ${name}`);
            console.log({freeSearchRes})
            countRef.current++;
            res.push(...freeSearchRes.slice(0,MAX_ITEMS))
        } catch (err) {
            console.error("freeSearchRes err", err)
        }
    
        if(res.length < MAX_ITEMS) {
            console.log("LENGTH", res.length)
            try{
                const instantSearchRes = await searchInstantAndGetSugar(name);
                countRef.current++;
                console.log({instantSearchRes})
    
                for(let foodItem of instantSearchRes) {
                    matchFoodItemDetailsToWeight(foodItem, weight);
                    countRef.current++;
                }
                res.push(...instantSearchRes.slice(0,MAX_ITEMS))
            } catch (err) {
                console.error("instantSearchRes err", err)
            }
        }
    
        userActions(USER_ACTIONS.ADD_TO_NUTRITIONIX_COUNT, {amountOfCalls: countRef.current})
        return res;
    }
    
    const matchFoodItemDetailsToWeight = (foodItem, weight) => {

        let needToUpdateAmount = false;
        let {currUnit, currWeight} = changeNutUnsopportedUnits(foodItem.serving_unit, foodItem.serving_qty)
        let newUnit;
        let newWeight;

        console.log({currUnit, currWeight, ogUnit: foodItem.serving_unit})

        if (foodItem.serving_unit !== currUnit) {
            needToUpdateAmount = true;
            newUnit = currUnit;
            newWeight = currWeight;
        }
        if (!SUPPORTED_UNITS.includes(currUnit)){
            needToUpdateAmount= true;
            try{
                newUnit = "ml";
                newWeight = convert(currWeight).from(currUnit).to(newUnit);
            } catch (err) {
                if(err.message.startsWith(ERR_MESSAGES.UNSUPPORTED_UNIT_PREFIX)) return; //If unsupported unit- doesn't change sugar data
                if(err.message.startsWith(ERR_MESSAGES.INCOMPATIBLE_MEASURES_PREFIX)) {
                    newUnit = "gr";
                    newWeight = convert(currWeight).from(currUnit).to('g');
                } else {
                    console.error('convert issue', {message: err.message, err})
                }
            }
        }

        if(needToUpdateAmount && newWeight) {
            const proportionsBetweenSizes = weight / newWeight;
            console.log('updating for og unit:',foodItem.serving_unit, 'new unit', newUnit )
    
            Object.keys(foodItem).forEach(key => {
                if(key.startsWith("nf_")) {
                    console.log(key, foodItem[key], proportionsBetweenSizes)
                    foodItem[key] = Number((foodItem[key]*proportionsBetweenSizes).toFixed(2)) || 0
                }
            })
        }
    }

    const changeNutUnsopportedUnits = (unit, weight) => {
        let currUnit = unit;
        let currWeight = weight;

        if (currUnit.startsWith('fl.') || currUnit.startsWith('fl ') ) currUnit= unit.substr(3);
        else if (currUnit.substr(-1) === '.') currUnit = unit.substr(0, unit.length-1)

        switch (unit.toLowerCase()) {
            case "bottle":
                currUnit = 'ml';
                currWeight = weight/750; 
                break;
            case "shake":
                currUnit = 'ml';
                break;
            case "tbsp":
                currUnit = 'Tbs';
                break;
            case "gr":
                currUnit = 'g';
                break;    
            case "Fluid ounce":
                currUnit = 'oz';
                break;
            default:
        }

        return {currUnit, currWeight}
    }
    
    const searchByFreeText = async (text) => {
        let returns = [];
        try{
            const body = {
                        query: text,
                        timezone: "Asia/Taipei",
                        line_delimited: false,
                        use_raw_foods: false
                    }
            const response = await callApi({method: 'post', url: TEXT_SEARCH_API, body})
            returns = response.data?.foods;
            console.log("search res:", returns)
        } catch (err) {
            if(err?.message === ERR_MESSAGES.FOOD_NOT_FOUND) {
                returns= [];
            } else {
                console.error('searchByFreeText', {messaage: err.messaage, err});
            }
        }
        
        return returns;
    }
    
    const searchInstantAndGetSugar = async (text) => {
        try{
            const searchRes = await searchInstant(text);
            const filteredItems = {};
            for (let item of searchRes) {
                if(!filteredItems[item.nix_item_id]) {
                    const itemsNutritions = await searchByNixId(item.nix_item_id);
                    item.nutritions = itemsNutritions?.full_nutrients;
                    item.nf_sugars = itemsNutritions?.nf_sugars;
                    filteredItems[item.nix_item_id] = item;
                }
    
                if(Object.keys(filteredItems).length > MAX_ITEMS) break;
            }
            console.log("filteredItems", Object.values(filteredItems) || [])
            return Object.values(filteredItems) || [];
        } catch(err) {
            console.error("searchInstantAndGetSugar err",{message: err.message, err})
        }
    }
    
    const searchInstant = async (text) => {
        let returns = [];
        try{
            const response = await callApi({method: 'post', url: INSTANT_API, body: {query: text}})
            returns = response.data?.branded;
            console.log("instant res:", returns)
        } catch (err) {
            console.error('searchInstant', {message: err.message, err})
            returns = [];
        }
    
        return returns;
    }
    
    const searchByNixId = async (nix_id) => {
        let returns = [];
        try{
            const response = await callApi({method: 'get', url: `${SEARCH_BY_ID_API}?nix_item_id=${nix_id}`})
            returns = response.data?.foods?.[0]
            console.log("nix res:", returns)
        } catch (err) {
            console.error('searchInstant', err.message, err)
            returns = [];
        }

        return returns;
    }
    
    const getItemTotalSugars = (nut_item) => {
        if (!nut_item) return nut_item;
        return nut_item.nf_sugars || nut_item.full_nutrients?.find(i => i.attr_id = TOTAL_SUGARS_ID)
    }

    return [searchItems, getItemTotalSugars]

}