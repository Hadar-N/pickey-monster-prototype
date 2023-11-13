import React from "react";
import {useNavigate} from 'react-router-dom';
import PickyMonsterText from '../assets/PickyMonster.png'
import PickyMonsterLogo from '../assets/OIG 1.png'
import { LogoConteiner, SubmitButton, FlexFormContainer } from "../style/form_elements"
import styled from "styled-components";
import { useConnection } from "../utils/ConnectionContext";

export default function EntryPage() {
    const user = useConnection();
    // TODO: check if already logged in!
    const navigate = useNavigate();

    const handleSubmit = event => {
        event.preventDefault();
        navigate('/login');
    };
    
    return (
        <FlexFormContainer>
            <LogoConteiner>
                <img src={PickyMonsterLogo} alt=""/>
                <img src={PickyMonsterText} alt=""/>
            </LogoConteiner>
            <MainPageTitle>
                <h2>Build<br />New<br />Habits</h2>
                <span>Reduce<br />your<br />daily<br />sugar<br />intake</span>
            </MainPageTitle>
            <SubmitButton centered="true" onClick={handleSubmit}>Sign In</SubmitButton>
        </FlexFormContainer>
    )
}

const MainPageTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;  

    span {
        font-size: 13px;
        text-align: right;
    }
    
`