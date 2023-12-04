import React, { useState, useEffect } from "react"
import { useUserActions } from "../utils/ConnectionContext";
import { VIEW_HEIGHT, VIEW_WIDTH } from '../utils/consts';
import { OpenCloseDescButton, DescriptionOutline, ImgsContainer, SpecificImg } from "../style/desc_box"
import { USER_ACTIONS, DESCBOX_TYPE } from "../utils/consts";
import styled from "styled-components";

import SugarIntakeExplanation from '../assets/Frame 8.png'

export default function DescriptionBox({descType = DESCBOX_TYPE.GENERAL, isPositionRelative = false}) {
    const [isOpen, setIsOpen] = useState(false)
    const [imgs,setImgs] = useState([])
    const userActions = useUserActions();

    useEffect(() => {
        const getMons = async() => {
            const res= await userActions(USER_ACTIONS.GET_ALL_STAGES_SAME_MONSTER)
            setImgs(res);
        }
        getMons();
    }, [])

    const handleOpenClose = (e) => {
        setIsOpen(!isOpen);
    }

    const OpenCloseBtn = () => {
        return(
            <OpenCloseDescButton onClick={handleOpenClose} $second={isPositionRelative && !isOpen}>{isOpen ? "X" : <>{isPositionRelative ? "!" : "?"}</>}</OpenCloseDescButton>
        )
    }

    const getBoxContent = () => {
        return (
            <DescriptionOutline>
                {descType === DESCBOX_TYPE.SUGAR_INTAKE_CALC ? SugarIntakeDescription() : DescriptionBoxContent()}
            </DescriptionOutline>
        )
    }

    const DescriptionBoxContent = () => {
        return(
            <>
                Clarifications:
                <p />
                instructions: <Link href="https://www.youtube.com/watch?v=TL2cDD80XwQ" target="_blank">YouTube</Link>
                <p />
                <ImgsContainer>
                    {imgs.map(item => ImgRender(item.mon_class, item.link))}
                </ImgsContainer>
                <span style={{padding: "10px"}}>
                <br />
                Eat less sugar, monster will become cuter
                <br />
                Eat more sugar, monster will become ugly
                <p />
                Feed your monster wisely!
                </span>
                <p />
            
            </>
        )
    }

    const SugarIntakeDescription = () => {
        return (
                <img src={SugarIntakeExplanation} alt=""
                style={{height: `${VIEW_HEIGHT - 50}px`, width: `${VIEW_WIDTH - 30}px`}}
                />
        )
    }

    const ImgRender = (imgStage, imgLink) => <SpecificImg src={imgLink} name={imgStage} key={imgStage}/>

    return (
        <div style={{position: "absolute", zIndex: 1}}>
            {OpenCloseBtn()}
            {isOpen && getBoxContent()}
        </div>
    )
    
}

const Link = styled.a`
:link,
:visited,
:hover,
:active {
  text-decoration: none; 
  color: #000;
}
color: #000
`