import React, { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { FormTitle, SubmitButton, FlexFormContainer, FormGrid } from "../style/form_elements"
import { useUserActions } from "../utils/ConnectionContext"
import { USER_ACTIONS, MONSTER_TYPES } from "../utils/consts"
import { MonsterImage, ImageContainer } from "../style/general";

export default function ChooseMonster() {
    const [chosenMon, setChosenMon] = useState(MONSTER_TYPES.YELLOW)
    const [allMons, setAllMons] = useState([])
    const userActions = useUserActions();
    const navigate = useNavigate();

    useEffect(() => {
        const getMons = async() => {
            const res = await userActions(USER_ACTIONS.GET_ALL_BASE_MONSTERS);
            setAllMons(res)
        }
        getMons();
    }, [userActions])

    const handleSubmit = async (e) => {
        e.preventDefault();
        await userActions(USER_ACTIONS.CHOOSE_MONSTER, {monsterType: chosenMon, monsterImg: allMons.find(mon => mon.mon_type === chosenMon).link});
        navigate('/home')
    }

    return (
        <FlexFormContainer>
            <FormTitle style={{ fontSize: "24px"}}>
                Pick Your Avatar!
            </FormTitle>
        <FormGrid>
            {
                allMons && allMons.map((mon) => 
                    <ImageContainer $is_chosen={mon?.mon_type === chosenMon} key= {mon?.mon_type}>
                        <MonsterImage src={mon?.link} alt={mon?.mon_type} onClick={e => setChosenMon(e.target.alt)} style={{cursor: "pointer"}}/>
                    </ImageContainer>
                )
            }
        </FormGrid>

        <SubmitButton onClick={handleSubmit}>Continue</SubmitButton>
        </FlexFormContainer>
    )
    
}