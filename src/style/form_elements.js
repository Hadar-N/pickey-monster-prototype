import styled from "styled-components";
import { VIEW_HEIGHT, VIEW_WIDTH } from '../utils/consts';

export const FlexFormContainer = styled.form`
    display: flex;
    flex-direction: column;
    color: white;
`

export const LogoConteiner = styled.div`
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 25px;

    img {
        max-width: ${VIEW_WIDTH/2.2}px;
    }
`

export const SubmitButton = styled.button`
    // TODO: import font!
    // @import url('https://fonts.googleapis.com/css2?family=Irish+Grover&display=swap');

    background-color: #C8DE00;
    font-family: "Irish Grover", sans-serif;
    padding: 7px 30px;
    border: none;
    align-self: ${({ centered }) => centered ? ` center `: `flex-end`};
    color: white;
    cursor: pointer;
`