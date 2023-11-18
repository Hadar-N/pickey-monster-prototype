import styled from "styled-components"

export const MonsterImage = styled.img`
    height: 120px;
`

export const ImageContainer = styled.div.withConfig({
    shouldForwardProp: (prop) => '$is_chosen' !== prop,
  })`
    height: 150px;
    width: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    ${({$is_chosen}) => $is_chosen && 'border: 3px dashed white;'}
`

export const DataRoundContainer = styled.div`
    background-color: #C8DE00;
    font-family: "Irish Grover", sans-serif;
    border-radius: 50%;
    height: 80px;
    width: 80px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center; 
`