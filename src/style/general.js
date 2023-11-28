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
    border: 3px dashed ${({$is_chosen}) => $is_chosen ? 'white' : '#E1DB87'};
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

export const FoodsOptionsBox = styled.div`
  width: 230px;
  height: 270px;
  margin-top: 20px;
  border: 2px solid gray;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  overflow-y: scroll;
  color: black
`

export const FoodSpecBox = styled.div`
  width: 98%;
  border: 2px solid ${({$isChosen}) => $isChosen ? 'black' : 'darkgray'};
  ${({$isChosen}) => $isChosen && 'background-color: rgba(0,0,0,0.1)'};
  display: grid;
  grid-gap: 2px;
  align-content: center;
  justify-items: center;
  cursor: pointer;
  
  div{
      align-self: center;
   }


   grid-template-columns: 1fr 50px;
`
export const FoodSpecBoxImg = styled(FoodSpecBox)`
  grid-template-columns: 50px 1fr 50px;
`



export const FoodImage = styled.img`
    max-height: 50px;
    max-width: 50px;
    align-self: center;
`