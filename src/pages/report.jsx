import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { MenuItem } from "@mui/material";
import { InputField, FormTitle, SubmitButton, FlexFormContainer, FormGrid, FormText, SelectField } from "../style/form_elements"
import { useConnection, useUserActions } from "../utils/ConnectionContext";
import { USER_ACTIONS } from "../utils/consts"

export default function ReportPage() {
    const [formContent, setFormContent] = useState({weight: "", measurement: "", total_sugar:"", name: ""})
    const userActions = useUserActions();
    const user = useConnection();
    
    const setRelevantInfo = (e) => {
        const contentChange = {};
        contentChange[e.target.name] = e.target.value;
        setFormContent({...formContent, ...contentChange})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        userActions(USER_ACTIONS.REPORT_SNACK, {snackName: formContent.name, snackTotalSugar: formContent.total_sugar})
    }

    return (
        // TODO: weight of food + nutritionix search
        <FlexFormContainer>
            <FormTitle>
                Report a Snack
            </FormTitle>
            <FormTitle secondary="true">
                user id: {user.uid} <br /> username: {user.uname} 
            </FormTitle>


        <FormGrid isOneline="True">
            <div>
                <FormText>Weight</FormText>
                <InputField name="weight" onChange={setRelevantInfo}/>
            </div>
            <div>
                <FormText>Unit</FormText>
                <SelectField
                    name="measurement"
                    value={formContent.measurement}
                    onChange={setRelevantInfo}
                    style={{color: 'white'}}
                >
                    <MenuItem value={"gr"}>gr</MenuItem>
                    <MenuItem value={"ml"}>ml</MenuItem>
                </SelectField>
            </div>
            <div>
                <FormText>Snack Name</FormText>
                <InputField name="name" onChange={setRelevantInfo}/>
            </div>
            <div>
                <FormText>Sugar (gr)</FormText>
                <InputField name="total_sugar" onChange={setRelevantInfo}/>
            </div>
        </FormGrid>

        <SubmitButton onClick={handleSubmit}>Report</SubmitButton>
        </FlexFormContainer>
    )
    
}