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

export const testChecks = () => {
    // searchInstant("15gr maltesers");
    // searchByNixId("5e26a269fc833a895edf76d4");
}

const convertListToFreeSearch = (items = []) => {

}

const searchByFreeText = async (weight, name) => {
    //serving_weight_grams
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
    //nix_item_id

}

const searchByNixId = async (nix_id) => {
    const response = await axios({
        method: 'get',
        headers,
        url: `${NUTRITIONIX_BASE}${SEARCH_BY_ID_API}?nix_item_id=${nix_id}`
    });
    console.log("nix res:", response.data)
    // const response = await axios.get(`${NUTRITIONIX_BASE}${SEARCH_BY_ID_API}?nix_item_id=${nix_id}`)
}

const get_total_sugars = (nut_item) => {
    return nut_item['nf_sugars'] || nut_item.full_nutrients?.find(i => i.attr_id = TOTAL_SUGARS_ID)
}