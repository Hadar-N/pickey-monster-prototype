import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { InputField, FormTitle, SubmitButton, FlexFormContainer, FormGrid, FormText, SelectField } from "../style/form_elements"
import { useConnection, useUserActions } from "../utils/ConnectionContext"
import { USER_STATUSES, USER_ACTIONS } from "../utils/consts"
import { calcTotalSugarInGram } from '../utils/general'
import { MenuItem } from "@mui/material";
import { testChecks } from '../utils/nutritionixApi'

export default function LoginPage() {
    const [idInput, setIdInput] = useState("")
    const [formContent, setFormContent] = useState({age:'', gender:'', weight:'', height:'', workouts: ''})
    const user = useConnection();
    const userActions = useUserActions();
    const navigate = useNavigate();

    useEffect(() => {
        if([USER_STATUSES.TEST_USER, USER_STATUSES.MANAGER].includes(user.sid)) {
            // navigate('/home')
            navigate('/report')
            testChecks();
        }
    }, [user.sid, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user.sid === USER_STATUSES.INACTIVE) {
            const total_sugar = calcTotalSugarInGram(formContent)
            console.log({total_sugar})
            if(total_sugar) {
                userActions(USER_ACTIONS.ACTIVATE_USER, {sugar_amount: total_sugar})
            } else {
                alert('error sugar calculation')
            }
        } else {
            userActions(USER_ACTIONS.LOGIN, {uid: idInput})
        }
    }

    const setRelevantInfo = (e) => {
        const contentChange = {};
        contentChange[e.target.name] = e.target.value;
        setFormContent({...formContent, ...contentChange})
    }

    return (
        <FlexFormContainer>
            <FormTitle>
                Before we start...<br />We just need to know a few things about you first
            </FormTitle>
            <FormTitle secondary="true">
                Your personal information won’t be shared outside of this study
            </FormTitle>

        <FormGrid>
            <div>
                <FormText>User ID</FormText>
                <InputField onChange={(e) => setIdInput(e.target.value)} disabled={user.sid === USER_STATUSES.INACTIVE}/>
            </div>
            <div />
            {user.sid === USER_STATUSES.INACTIVE &&<>
            <div>
                <FormText>Age</FormText>
                <InputField name="age" onChange={setRelevantInfo}/>
            </div>
            <div>
                <FormText>Gender</FormText>
                <SelectField
                    name="gender"
                    value={formContent.gender}
                    onChange={setRelevantInfo}
                    style={{color: 'white'}}
                >
                    <MenuItem value={"M"}>Male</MenuItem>
                    <MenuItem value={"F"}>Female</MenuItem>
                </SelectField>

            </div>
            <div>
                <FormText>Weight (kg)</FormText>
                <InputField name="weight" onChange={setRelevantInfo}/>
            </div>
            <div>
                <FormText>Height (cm)</FormText>
                <InputField name="height" onChange={setRelevantInfo}/>
            </div>
            <div>
                <FormText>Workouts (per week)</FormText>
                <InputField name="workouts" onChange={setRelevantInfo}/>
            </div>
            </>
        }
        </FormGrid>

        <SubmitButton onClick={handleSubmit}>Log In</SubmitButton>
        </FlexFormContainer>
    )
    
}