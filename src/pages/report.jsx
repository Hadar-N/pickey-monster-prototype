import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { MenuItem } from "@mui/material";
import { InputField, FormTitle, SubmitButton, FlexFormContainer, FormGrid, FormText, SelectField } from "../style/form_elements"
import { FoodSpecBox, FoodsOptionsBox, FoodImage, FoodSpecBoxImg } from '../style/general'
import { useConnection, useUserActions } from "../utils/ConnectionContext";
import { USER_ACTIONS } from "../utils/consts"
import { SUPPORTED_UNITS, useNutritionix } from '../utils/nutritionixApi'
import MagGlass from '../assets/magnifier-5.png'

export default function ReportPage() {
    const [formContent, setFormContent] = useState({weight: "", measurement: "", totalSugar:"", name: ""})
    const [foodOptions, setFoodOptions] = useState([])
    const [chosenSnack, setChosenSnack] = useState()
    const userActions = useUserActions();
    const user = useConnection();
    const navigate = useNavigate()
    const [searchItems, getItemTotalSugars] = useNutritionix()
    const ITEM_NOT_FOUND = "404_item";
    
    const setRelevantInfo = (e) => {
        const contentChange = {};
        contentChange[e.target.name] = e.target.value;
        setFormContent({...formContent, ...contentChange})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const chosenSnackData = foodOptions.find(item => item.food_name === chosenSnack);
            const totalSugar = chosenSnack === ITEM_NOT_FOUND ? Number(formContent.totalSugar) : getItemTotalSugars(chosenSnackData) || 0
            const snackName = chosenSnack === ITEM_NOT_FOUND ? formContent.name : chosenSnackData.food_name;
            await userActions(USER_ACTIONS.REPORT_SNACK, {
                snackName: snackName, 
                snackTotalSugar: totalSugar
            })
            navigate('/home');
        } catch (err) {}
    }
    const goBack = async (e) => {
        e.preventDefault();
        navigate('/home');
    }

    const searchNutrition = async (e) => {
        if(formContent.weight && formContent.measurement && formContent.name) {
            const foundFoods = await searchItems(formContent.weight, formContent.measurement, formContent.name)
            setFoodOptions(foundFoods)
        } else {
            alert("missing data: weight, unit or snack name")
        }
    }

    const getFoodBox = (foodItem) => {
        return (
            <FoodSpecBoxImg key={foodItem.food_name} name={foodItem.food_name} $isChosen={chosenSnack===foodItem.food_name} onClick={chooseSpecificSnack}>
                <FoodImage src={foodItem.photo?.thumb} alt=""/>
                <div style={{fontSize: "12px", width: "100%"}}><b style={{fontSize: "14px" }}>{foodItem.food_name}</b><br /><span>{foodItem.brand_name || ""}</span></div>
                <div>{getItemTotalSugars(foodItem) || 0}<br /><span style={{fontSize: "12px"}}>gr sugar</span></div>
            </FoodSpecBoxImg>
        )
    }

    const getNotOnListBox = () => {
        return (
            <FoodSpecBox key={ITEM_NOT_FOUND} name={ITEM_NOT_FOUND} $isChosen={chosenSnack===ITEM_NOT_FOUND} onClick={chooseSpecificSnack}>
                <div style={{fontSize: "12px", width: "100%"}}><b style={{fontSize: "14px" }}>Can't find item?</b><br /><span>Type in its' total sugars</span></div>
                <div><InputField name="totalSugar" onChange={setRelevantInfo} style={{width: "30px"}}/><br /><span style={{fontSize: "12px"}}>gr sugar</span></div>
            </FoodSpecBox>
        )
    }

    const chooseSpecificSnack = (e) => {
        setChosenSnack(e.currentTarget.getAttribute('name'))
    }

    return (
        <FlexFormContainer>
            <FormTitle>
                Report a Snack
            </FormTitle>
            <FormTitle secondary="true">
                user id: {user.uid} <br /> username: {user.uname} 
            </FormTitle>


        <FormGrid isOneline="True">
            <div style={{display: "flex"}}>
                <div>
                    <FormText>Weight</FormText>
                    <InputField name="weight" type="number" style={{width: "50px"}} onChange={setRelevantInfo}/>
                </div>
                <div>
                    <FormText>Unit</FormText>
                    <SelectField
                        name="measurement"
                        value={formContent.measurement}
                        onChange={setRelevantInfo}
                        style={{color: 'white', width: "30px"}}
                    >
                        {SUPPORTED_UNITS.map(unit => <MenuItem key={unit} value={unit}>{unit}</MenuItem>)}
                    </SelectField>
                </div>
            </div>
            <div>
                <FormText>Snack Name</FormText>
                <div style={{display: "flex"}}>
                    <InputField name="name" onChange={setRelevantInfo} style={{marginTop: "2px", width: "100%"}}/>
                    <img src={MagGlass} alt="" style={{height: "20px", width: "20px", cursor: "pointer", marginLeft: "5px"}} onClick={searchNutrition}/>
                </div>
            </div>

        </FormGrid>
        <FoodsOptionsBox>
            {foodOptions && foodOptions.map(getFoodBox)}
            {getNotOnListBox()}
        </FoodsOptionsBox>

        <SubmitButton onClick={handleSubmit} disabled={!chosenSnack}>Report</SubmitButton>
        <SubmitButton back="true" onClick={goBack}>Back</SubmitButton>
        </FlexFormContainer>
    )
    
}