import axios from 'axios';
// const axios = require('axios');

const NUTRITIONIX_BASE = "https://trackapi.nutritionix.com/v2"
const TEXT_SEARCH_API = "/natural/nutrients"
const INSTANT_API = "/search/instant"
const SEARCH_BY_ID_API = "/search/item"

const headers = {
    "x-app-id": "ae9af963",
    "x-app-key": "ecc4a336ae8fc20271842b8276634b34",
    "x-remote-user-id": "pickymon",
}

const TOTAL_SUGARS_ID = 269;
const ADDED_SUGARS_ID = 539;

const MAX_ITEMS = 5;

export const searchItems = async (weight, unit, name) => { 
    const res = [];
    try{
        const freeSearchRes = await searchByFreeText(`${weight}${unit} ${name}`);
        console.log({freeSearchRes})
        res.push(...freeSearchRes.slice(0,MAX_ITEMS))
    } catch (err) {
        console.error("freeSearchRes err", err)
    }

    if(res.length < MAX_ITEMS) {
        try{
            const instantSearchRes = await searchInstantAndGetSugar(name);
            console.log({instantSearchRes})
            res.push(...instantSearchRes.slice(0,MAX_ITEMS))
        } catch (err) {
            console.error("instantSearchRes err", err)
        }
    }

    return res;

}

const searchByFreeText = async (text) => {
    const response = await axios({
        method: 'post',
        headers,
        url: `${NUTRITIONIX_BASE}${TEXT_SEARCH_API}`,
        data: {
            query: text,
            timezone: "Asia/Taipei",
            line_delimited: false,
            use_raw_foods: false
        
        }
    });
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
    const response = await axios({
        method: 'post',
        headers,
        url: `${NUTRITIONIX_BASE}${INSTANT_API}`,
        data: {
            query: text
        }
    });
    console.log("instant res:", response.data)

    return response.data.branded;
}

const searchByNixId = async (nix_id) => {
    const response = await axios({
        method: 'get',
        headers,
        url: `${NUTRITIONIX_BASE}${SEARCH_BY_ID_API}?nix_item_id=${nix_id}`
    });
    console.log("nix res:", response.data?.foods?.[0])
    return response.data?.foods?.[0];
}

export const getItemTotalSugars = (nut_item) => {
    return nut_item.nf_sugars || nut_item.full_nutrients?.find(i => i.attr_id = TOTAL_SUGARS_ID)
}