import React from "react"
import { useConnection } from "../utils/ConnectionContext";
import { useNavigate } from 'react-router-dom';
// import SnackCircle from '../assets/1000_F_227411817_EzyIQ0DJHUc9Fmy1p8U0M8nRXz3ED8jI-removebg-preview 1.png'
import { ImageContainer, MonsterImage, DataRoundContainer } from "../style/general";
import { FlexFormContainer, FormGrid } from "../style/form_elements";

export default function HomePage() {
    const user = useConnection();
    const navigate = useNavigate();

    const handleReport = (e) => {
        navigate('/report')
    }

    return (
        <FlexFormContainer style={{alignItems:"center"}}>
            <ImageContainer>
                {/* <MonsterImage src={SnackCircle} alt="" /> */}
                <MonsterImage src={user.monsterImg} alt="" />
            </ImageContainer>
            <h1 style={{textAlign: "center"}}>
                Welcome back, {user.uname}
            </h1>
            <FormGrid>
                <DataRoundContainer>
                    <div style={{fontSize: '24px', fontWeight: 600}}>{Math.round(user.sugarAmount)}gr</div>
                    <div style={{fontSize: '14px'}}>sugar/day</div>
                </DataRoundContainer>
                <DataRoundContainer style={{cursor: "pointer"}} onClick={handleReport}>
                    <div style={{fontSize: '20px', fontWeight: 600}}>Add Snack</div>
                </DataRoundContainer>
            </FormGrid>
        </FlexFormContainer>
    )
    
}