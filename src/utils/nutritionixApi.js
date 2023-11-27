import convert from 'convert-units'
import axios from 'axios'

// import SearchRes from '../assets/search_res.json'
// import InstantRes from '../assets/instant_res.json'
// import NixAllRes from '../assets/NixId.json'
import { useUserActions } from "../utils/ConnectionContext"
import { useEffect, useState } from 'react'
import { USER_ACTIONS } from './consts'

const NUTRITIONIX_BASE = "https://trackapi.nutritionix.com/v2"
const TEXT_SEARCH_API = "/natural/nutrients"
const INSTANT_API = "/search/instant"
const SEARCH_BY_ID_API = "/search/item"

const TOTAL_SUGARS_ID = 269;
const ADDED_SUGARS_ID = 539;
export const SUPPORTED_UNITS = ['gr', 'ml'];
const NUTRITIONIX_API_AMOUNT = 50;

const MAX_ITEMS = 5;

// TODO: change credentials by amount of searches! functions name: add_to_nutrition_count({add_to_count}), get_nutrition_keys
// TODO: create more nutrition keys

export function useNutritionix() {
    const userActions = useUserActions();
    const [headers, setHeaders] = useState({})

    useEffect(() => {
        const getData= async() => {
            const res = await userActions(USER_ACTIONS.GET_NUTRITIONIX_DATA)
            setHeaders(res.keys);
        }
        getData();
    } , [userActions, setHeaders])

    const callApi = async ({method, body, url}) => {
        console.log({method, headers, url: `${NUTRITIONIX_BASE}${url}`})
        const response = await axios({
            method,
            headers,
            url: `${NUTRITIONIX_BASE}${url}`,
            data: body
        });

        return response;
    }

    const searchItems = async (weight, unit, name) => { 
        const res = [];
        let amountOfCalls = 0;
        try{
            const freeSearchRes = await searchByFreeText(`${weight}${unit} ${name}`);
            console.log({freeSearchRes})
            amountOfCalls++;
            res.push(...freeSearchRes.slice(0,MAX_ITEMS))
        } catch (err) {
            console.error("freeSearchRes err", err)
        }
    
        if(res.length < MAX_ITEMS) {
            console.log("LENGTH", res.length)
            try{
                const instantSearchRes = await searchInstantAndGetSugar(name);
                amountOfCalls++;
                console.log({instantSearchRes})
    
                for(let foodItem of instantSearchRes) {
                    matchFoodItemDetailsToWeight(foodItem, weight);
                    amountOfCalls++;
                }
                res.push(...instantSearchRes.slice(0,MAX_ITEMS))
            } catch (err) {
                console.error("instantSearchRes err", err)
            }
        }
    
        userActions(USER_ACTIONS.ADD_TO_NUTRITIONIX_COUNT, {amountOfCalls})
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
                newUnit = "gr";
                newWeight = convert(currWeight).from(currUnit).to('g');
                // TODO: don't crush if unit is not on list!
            }
        }

        if(needToUpdateAmount && newWeight) {
            const proportionsBetweenSizes = weight / newWeight;
            console.log('updating for og unit:',foodItem.serving_unit, 'new unit', newUnit )
    
            Object.keys(foodItem).forEach(key => {
                if(key.startsWith("nf_")) foodItem[key] = Number((foodItem[key]*proportionsBetweenSizes).toFixed(2))
            })
        }
    }

    const changeNutUnsopportedUnits = (unit, weight) => {
        let currUnit;
        let currWeight;

        if (unit.startsWith('fl.')) unit= unit.substr(3);

        switch (unit.toLowerCase()) {
            case "bottle":
                currUnit = 'ml';
                currWeight = weight/750; 
                break;
            case "shake":
                currUnit = 'ml';
                currWeight = weight; 
                break;
            case "tbsp":
                currUnit = 'Tbs';
                currWeight = weight; 
                break;
            default:
                currUnit = unit;
                currWeight = weight;
        }

        return {currUnit, currWeight}
    }
    
    const searchByFreeText = async (text) => {
        // const response = {data: SearchRes};
        const body = {
                    query: text,
                    timezone: "Asia/Taipei",
                    line_delimited: false,
                    use_raw_foods: false
                }
        const response = await callApi({method: 'post', url: TEXT_SEARCH_API, body})
        console.log("search res:", response.data?.foods)
    
        /**
         * when not found:
         * data: {
         *   "message": "We couldn't match any of your foods",
         *   "id": "3d9792e0-98da-45bd-b354-90b75e8a254d"
         * }
         */
    
        return response.data?.foods;
        //serving_weight_grams
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
            console.error("searchInstantAndGetSugar err",err)
        }
    }
    
    const searchInstant = async (text) => {
        // const response = {data: InstantRes};
        const response = await callApi({method: 'post', url: INSTANT_API, body: {query: text}})
        console.log("instant res:", response.data)
    
        return response.data?.branded;
    }
    
    const searchByNixId = async (nix_id) => {
        // const response = {data: NixAllRes[nix_id]?.nutritions} || {data: {}}
        const response = await callApi({method: 'get', url: `${SEARCH_BY_ID_API}?nix_item_id=${nix_id}`})
        console.log("nix res:", response.data?.foods?.[0])
        return response?.data?.foods?.[0];
    }
    
    const getItemTotalSugars = (nut_item) => {
        if (!nut_item) return nut_item;
        return nut_item.nf_sugars || nut_item.full_nutrients?.find(i => i.attr_id = TOTAL_SUGARS_ID)
    }

    return [searchItems, getItemTotalSugars]

}