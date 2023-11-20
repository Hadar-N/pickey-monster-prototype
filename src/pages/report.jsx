import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { MenuItem } from "@mui/material";
import { InputField, FormTitle, SubmitButton, FlexFormContainer, FormGrid, FormText, SelectField } from "../style/form_elements"
import { useConnection, useUserActions } from "../utils/ConnectionContext";
import { USER_ACTIONS } from "../utils/consts"
import { searchItems } from '../utils/nutritionixApi'
import MagGlass from '../assets/magnifier-5.png'

export default function ReportPage() {
    const [formContent, setFormContent] = useState({weight: "", measurement: "", total_sugar:"", name: ""})
    const userActions = useUserActions();
    const user = useConnection();
    const navigate = useNavigate()
    
    const setRelevantInfo = (e) => {
        const contentChange = {};
        contentChange[e.target.name] = e.target.value;
        setFormContent({...formContent, ...contentChange})
    }

    const handleSubmit = async (e) => {
        // TODO: check if disabled
        e.preventDefault();
        try{
            await userActions(USER_ACTIONS.REPORT_SNACK, {snackName: formContent.name, snackTotalSugar: formContent.total_sugar});
            navigate('/home');
        } catch (err) {}
    }
    const goBack = async (e) => {
        e.preventDefault();
        navigate('/home');
    }

    const searchNutrition = async (e) => {
        console.log(formContent)
        if(formContent.weight && formContent.measurement && formContent.name) {
            const foundFoods = searchItems(formContent.weight, formContent.measurement, formContent.name)
            console.log({foundFoods})
        } else {
            alert("missing data: weight, unit or snack name")
        }
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
            <div>
                <FormText>Sugar (gr)</FormText>
                <InputField name="total_sugar" onChange={setRelevantInfo}/>
            </div>

            {/** res list */}
            {/** Not on list? */}
        </FormGrid>

        <SubmitButton onClick={handleSubmit} $disabled={true}>Report</SubmitButton>
        <SubmitButton back="true" onClick={goBack}>Back</SubmitButton>
        </FlexFormContainer>
    )
    
}