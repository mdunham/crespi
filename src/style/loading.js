import styled from 'styled-components';
import { fadeIn, fadeOut } from './animations';
export const Container = styled.div`
  position: absolute;
  visibility: ${props => (props.status ? 'visible' : 'hidden')};
<<<<<<< HEAD
  animation: ${props => (props.status ? fadeIn : fadeOut)} 1s ease-out;
  transition: visibility 0.25s;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(255, 255, 255);
  z-index: 6;
`;
export const Element = styled.div`
  position: absolute;
=======
  animation: ${fadeOut} 1s linear;
  transition: visibility 1s linear;
>>>>>>> 03d2b473717304eb575c5825895ef11c3c3ca3b7
  top: 50%;
  left: 50%;
  transform: translateY(-50%);
  transform: translateX(-50%);
  font-family: helvetica;
  font-size: 3.5rem;
  font-weight: bold;
  text-background: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(45deg, #fbda61 0%, #ff5acd 100%);
<<<<<<< HEAD
=======
  z-index: 6;
>>>>>>> 03d2b473717304eb575c5825895ef11c3c3ca3b7
`;
