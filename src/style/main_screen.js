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

export const Loader = styled.div`
  background-color: rgba(0,0,0,0.4);
  display: ${({$is_loading}) => $is_loading ? 'block' : 'none'};
  position: absolute;
  width : ${VIEW_WIDTH}px;
  height : ${VIEW_HEIGHT}px;
  z-index: 5;

  img{
    width : ${VIEW_WIDTH / 3}px;
    position: relative;
    top:  ${VIEW_HEIGHT / 2.5}px;
    left:  ${(VIEW_WIDTH / 2) - 50}px;
  }
`
