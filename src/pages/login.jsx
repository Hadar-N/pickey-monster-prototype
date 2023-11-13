import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { InputField, FormTitle, SubmitButton, FlexFormContainer, FormGrid, FormText } from "../style/form_elements"
import { useConnection, useUserActions } from "../utils/ConnectionContext"
import { USER_STATUSES, USER_ACTIONS } from "../utils/consts"
import { calcTotalSugarInGram } from '../utils/general'

export default function LoginPage() {
    const [idInput, setIdInput] = useState("")
    const [formContent, setFormContent] = useState({age:"", gender:"", weight:"", height:"", workouts: ""})
    const user = useConnection();
    const userActions = useUserActions();
    const navigate = useNavigate();

    useEffect(() => {
        if([USER_STATUSES.TEST_USER, USER_STATUSES.MANAGER].includes(user.sid)) {
            // navigate('/home')
            navigate('/report')
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
        contentChange[e.target.getAttribute("field-name")] = e.target.value;
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
                <InputField field-name="age" onChange={setRelevantInfo}/>
            </div>
            <div>
                <FormText>Gender [M/F]</FormText>
                <InputField field-name="gender" onChange={setRelevantInfo}/>
            </div>
            <div>
                <FormText>Weight (kg)</FormText>
                <InputField field-name="weight" onChange={setRelevantInfo}/>
            </div>
            <div>
                <FormText>Height (cm)</FormText>
                <InputField field-name="height" onChange={setRelevantInfo}/>
            </div>
            <div>
                <FormText>Workouts (per week)</FormText>
                <InputField field-name="workouts" onChange={setRelevantInfo}/>
            </div>
            </>
        }
        </FormGrid>

        <SubmitButton onClick={handleSubmit}>Log In</SubmitButton>
        </FlexFormContainer>
    )
    
}