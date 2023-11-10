import styled from 'styled-components';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../utils/consts';

export const CenterChildUsingFlex = styled.div`
  height:100vh;
  width:100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const MainWrapper = styled.div`
  background-color : #E1DB87;
  width : ${VIEW_WIDTH}px;
  height : ${VIEW_HEIGHT}px;
  user-select: none; 
`;
