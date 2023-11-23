import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { MenuItem } from "@mui/material";
import { InputField, FormTitle, SubmitButton, FlexFormContainer, FormGrid, FormText, SelectField } from "../style/form_elements"
import { FoodSpecBox, FoodsOptionsBox } from '../style/general'
import { useConnection, useUserActions } from "../utils/ConnectionContext";
import { USER_ACTIONS } from "../utils/consts"
import { searchItems, getItemTotalSugars } from '../utils/nutritionixApi'
import MagGlass from '../assets/magnifier-5.png'

export default function HistoryPage() {
    const [foodOptions, setFoodOptions] = useState([])
    const [chosenSnack, setChosenSnack] = useState()
    const userActions = useUserActions();
    const user = useConnection();
    const navigate = useNavigate()
    
    const sortedList = useMemo(() => {
        const allSnackNames = new Set();
        const sorted = user.reports?.sort((a,b) => a.timestamp < b.timestamp? 1 : -1 );
        const res = [];
        for(let item of sorted) {
            if (!allSnackNames.has(item.snack_name)) {
                res.push(item)
                allSnackNames.add(item.snack_name)
            }
        }

        return res;
    }, [user.reports])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const currSnackData = user.reports.find(item => item.timestamp == chosenSnack)
            await userActions(USER_ACTIONS.REPORT_SNACK, {
                snackName: currSnackData.snack_name, 
                snackTotalSugar: currSnackData.snack_total_sugar
            });
            navigate('/home');
        } catch (err) {}
    }
    const goBack = async (e) => {
        e.preventDefault();
        navigate('/home');
    }

    const getFoodBox = (foodItem) => {
        return (
            <FoodSpecBox key={foodItem.timestamp} name={foodItem.timestamp} $isChosen={chosenSnack==foodItem.timestamp} onClick={chooseSpecificSnack}>
                <div style={{fontSize: "12px", width: "100%"}}><b style={{fontSize: "14px" }}>{foodItem.snack_name}</b></div>
                <div>{foodItem.snack_total_sugar}gr sugar</div>
            </FoodSpecBox>
        )
    }

    const chooseSpecificSnack = (e) => {
        setChosenSnack(e.currentTarget.getAttribute('name'))
    }

    return (
        <FlexFormContainer>
            <FormTitle>
                Snack History
            </FormTitle>
            <FormTitle secondary="true">
                user id: {user.uid} <br /> username: {user.uname} 
            </FormTitle>
        <FoodsOptionsBox>
            {sortedList.map(getFoodBox)}
        </FoodsOptionsBox>

        <SubmitButton onClick={handleSubmit} disabled={!chosenSnack}>Report</SubmitButton>
        <SubmitButton back="true" onClick={goBack}>Back</SubmitButton>
        </FlexFormContainer>
    )
    
}