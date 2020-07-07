import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';
import Loader from '../Loader';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ loading, children, ...rest }) => (
  <Container type="button" {...rest}>
    {loading ? <Loader /> : children}
  </Container>
);

export default Button;
