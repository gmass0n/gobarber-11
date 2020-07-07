import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg) }
  to { transform: rotate(360deg) }
`;

export const Container = styled.div`
  height: 20px;
  width: 20px;
  border: 2px solid #312e38;
  border-radius: 50%;
  border-top: 2px solid #ff9000;
  animation: ${spin} 1s linear infinite;
`;
