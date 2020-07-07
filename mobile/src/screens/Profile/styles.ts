import styled from 'styled-components/native';
import { getBottomSpace } from 'react-native-iphone-x-helper';

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    justifyContent: 'center',
    padding: 24,
  },
})`
  flex: 1;
`;

export const BackButton = styled.TouchableOpacity`
  z-index: 10;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: -22px;
`;

export const UserAvatar = styled.Image`
  height: 186px;
  width: 186px;
  border-radius: 98px;
  align-self: center;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
  text-align: left;
`;

export const SignOutButton = styled.TouchableOpacity`
  margin-top: 24px;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  background: #312e38;
  border-top-width: 1px;
  border-color: #232129;
  padding: 16px 0 ${16 + getBottomSpace()}px;

  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const SignOutButtonText = styled.Text`
  color: #ff9000;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular';
  margin-left: 16px;
`;
