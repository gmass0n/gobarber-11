import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

interface ContainerProps {
  toasttype?: 'info' | 'success' | 'error';
  hasdescription: string;
}

const toastTypeVariations = {
  info: css`
    background: #ebf8ff;
    color: #3172b7;
  `,
  success: css`
    background: #e6fffa;
    color: #2e656a;
  `,
  error: css`
    background: #fddede;
    color: #c53030;
  `,
};

export const Container = styled(animated.button)<ContainerProps>`
  width: 360px;
  position: relative;
  padding: 16px 30px 16px 16px;
  border-radius: 10px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  border: none;

  display: flex;

  ${({ toasttype }) => toastTypeVariations[toasttype || 'info']};

  & + button {
    margin-top: 8px;
  }

  svg {
    margin: 3px 14px 0 0;
  }

  div {
    flex: 1;
    text-align: left;

    p {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      line-height: 20px;
    }
  }

  ${({ hasdescription }) =>
    hasdescription === 'false' &&
    css`
      align-items: center;

      svg {
        margin-top: 0;
      }
    `};
`;
