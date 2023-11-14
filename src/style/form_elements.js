import styled from "styled-components";
import { VIEW_WIDTH } from '../utils/consts';
import { Select } from "@mui/material";

export const FlexFormContainer = styled.form`
    position: relative;
    display: flex;
    flex-direction: column;
    color: white;
    padding: 25px 30px;
    height: calc(100% - 50px);
    width: calc(100% - 60px);
`

export const FormTitle = styled.span.withConfig({
    shouldForwardProp: (prop) => 'secondary' !== prop,
  })`
    text-align: center;

    ${({ secondary }) => secondary ? `
        font-size: 10px;
        font-weight: 400;
    ` : `
        font-size: 13px;
        font-weight: 500;
    `};
`

export const FormGrid = styled.div.withConfig({
    shouldForwardProp: (prop) => 'isOneline' !== prop,
  })`
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr 1fr
    // ${({isOneline}) => !isOneline &&`grid-template-columns: 100px 100px;`}
`

export const FormText = styled.span`
    text-align: center;
    color: black;
    font-size: 10px;
    font-weight: 500;
`

export const LogoConteiner = styled.div`
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
        max-width: ${VIEW_WIDTH/2.2}px;
    }
`

export const InputField = styled.input`
    background-color: #FAC902;
    border: none;
    color: white;
    width: 90px;
    padding: 3px 7px;

    &:focus {
        outline: none;
    }
`

export const SelectField = styled(Select)`
    outline: none;
    border: none;
    height: 1.3em;
    width: 105px;
    background-color: #FAC902;

    .MuiOutlinedInput-notchedOutline { border: 0 };
`

export const SubmitButton = styled.button.withConfig({
    shouldForwardProp: (prop) => 'centered' !== prop,
  })`
    // TODO: import font!
    // @import url('https://fonts.googleapis.com/css2?family=Irish+Grover&display=swap');

    background-color: #C8DE00;
    font-family: "Irish Grover", sans-serif;
    padding: 7px 30px;
    border: none;
    align-self: ${({ centered }) => centered ? ` center `: `flex-end`};
    ${({ centered }) => !centered && `
        position: absolute;
        top: 415px;
        left: 130px;
    `};
    color: white;
    cursor: pointer;
`