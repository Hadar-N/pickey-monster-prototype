import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { MenuItem } from "@mui/material";
import { InputField, FormTitle, SubmitButton, FlexFormContainer, FormGrid, FormText, SelectField } from "../style/form_elements"
import { FoodSpecBox, FoodsOptionsBox, FoodImage, FoodSpecBoxImg } from '../style/general'
import { useConnection, useUserActions } from "../utils/ConnectionContext";
import { USER_ACTIONS } from "../utils/consts"
import { searchItems, getItemTotalSugars } from '../utils/nutritionixApi'
import MagGlass from '../assets/magnifier-5.png'

export default function ReportPage() {
    const [formContent, setFormContent] = useState({weight: "", measurement: "", total_sugar:"", name: ""})
    const [foodOptions, setFoodOptions] = useState([])
    const [chosenSnack, setChosenSnack] = useState()
    const userActions = useUserActions();
    const user = useConnection();
    const navigate = useNavigate()
    
    const setRelevantInfo = (e) => {
        const contentChange = {};
        contentChange[e.target.name] = e.target.value;
        setFormContent({...formContent, ...contentChange})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await userActions(USER_ACTIONS.REPORT_SNACK, {
                snackName: formContent.name, 
                snackTotalSugar: getItemTotalSugars(foodOptions.find(item => item.food_name === chosenSnack)) || formContent.total_sugar});
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
                <div style={{fontSize: "12px", width: "100%"}}><b style={{fontSize: "14px" }}>{foodItem.food_name}</b><br /><span>{foodItem.brand_name}</span></div>
                <div>{getItemTotalSugars(foodItem)}gr sugar</div>
            </FoodSpecBoxImg>
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
                        <MenuItem value={"gr"}>gr</MenuItem>
                        <MenuItem value={"ml"}>ml</MenuItem>
                    </SelectField>
                </div>
            </div>
            <div>
                <FormText>Snack Name</FormText>
                <div style={{display: "flex"}}>
                    <InputField name="name" onChange={setRelevantInfo}/>
                    <img src={MagGlass} alt="" style={{height: "20px", width: "20px", cursor: "pointer", marginLeft: "5px"}} onClick={searchNutrition}/>
                </div>
            </div>
            {/* <div>
                <FormText>Sugar (gr)</FormText>
                <InputField name="total_sugar" onChange={setRelevantInfo}/>
            </div> */}

        </FormGrid>
        <FoodsOptionsBox>
            {foodOptions.map(getFoodBox)}
        </FoodsOptionsBox>
        {/** TODO: Not on list? */}

        <SubmitButton onClick={handleSubmit} disabled={!chosenSnack}>Report</SubmitButton>
        <SubmitButton back="true" onClick={goBack}>Back</SubmitButton>
        </FlexFormContainer>
    )
    
}