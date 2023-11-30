import styled from "styled-components"
import { VIEW_WIDTH, VIEW_HEIGHT } from '../utils/consts';

export const OpenCloseDescButton = styled.div`
    position: absolute;
    top: 20px;
    left: ${VIEW_WIDTH - 40}px;

    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;

    cursor: pointer;
    border: 3px solid #333333;
    border-radius: 50%;
    color: #333333;
    line-height: 0;
    font-size: 15px;
    font-weight: 700;

    height: 20px;
    width: 20px;
`

export const DescriptionOutline = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    // height: ${VIEW_HEIGHT - 20}px;
    width: ${VIEW_WIDTH - 20}px;

    border: 1px solid black;
    border-radius: 10px;
    background-color: #ECE79F;

    display: grid;
    justify-items: center;
    height: fit-content;
    padding: 15px 0;

    font-weight: 500;
    font-size: 12px;
    text-align: center;
`

export const ImgsContainer = styled.div`
    width: ${VIEW_WIDTH - 20}px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
`

export const SpecificImg = styled.img`
    width: 100%;
`