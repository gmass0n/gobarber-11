import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;

  padding: 24px;
`;

export const Title = styled.Text`
  font-size: 32px;
  text-align: center;
  margin-top: 24px;
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
`;

export const Description = styled.Text`
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
  color: #999591;
  margin-top: 12px;
  text-align: center;
`;

export const OkButton = styled(RectButton)`
  background: #ff9000;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  padding: 12px 24px;
  border-radius: 10px;
`;

export const OkButtonText = styled.Text`
  font-size: 18px;
  font-family: 'RobotoSlab-medium';
  color: #312e38;
`;
