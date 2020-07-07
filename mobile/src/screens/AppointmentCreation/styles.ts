import styled, { css } from 'styled-components/native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { Platform, FlatList } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';
import { Provider } from '../Dashboard';

interface ProviderContainerProps {
  selected: boolean;
}

interface ProviderNameProps {
  selected: boolean;
}

interface HourProps {
  available: boolean;
  selected: boolean;
}

interface HourTextProps {
  selected: boolean;
}

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;

  ${Platform.OS === 'ios' &&
  css`
    padding-top: ${getStatusBarHeight() + 24}px;
  `}

  background: #28262e;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 20px;
  font-family: 'RobotoSlab-Medium';
  margin-left: 16px;
`;

export const UserAvatar = styled.Image`
  height: 56px;
  width: 56px;
  border-radius: 28px;
  margin-left: auto;
`;

export const Content = styled.ScrollView`
  flex: 1;
`;

export const ProvidersListContainer = styled.View`
  max-height: 112px;
`;

export const ProviderList = styled(
  FlatList as new () => FlatList<Provider>
).attrs({
  contentContainerStyle: {
    paddingVertical: 32,
    paddingLeft: 24,
    paddingRight: 8,
  },
  showsHorizontalScrollIndicator: false,
  horizontal: true,
})``;

export const ProviderContainer = styled(RectButton)<ProviderContainerProps>`
  background: ${({ selected }) => (selected ? '#ff9000' : '#3e3b47')};
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  margin-right: 16px;
  border-radius: 10px;
`;

export const ProviderAvatar = styled.Image`
  height: 32px;
  width: 32px;
  border-radius: 16px;
  margin-right: 12px;
`;

export const ProviderName = styled.Text<ProviderNameProps>`
  font-size: 16px;
  font-family: 'RobotoSlab-Medium';
  color: ${({ selected }) => (selected ? '#232129' : '#f4ede8')};
`;

export const Calendar = styled.View``;

export const CalendarTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  font-size: 24px;
  margin: 0 24px 24px;
`;

export const OpenDatePickerButton = styled(RectButton)`
  height: 46px;
  background: #ff9000;
  border-radius: 10px;
  margin: 0 24px;

  align-items: center;
  justify-content: center;
`;

export const OpenDatePickerButtonText = styled.Text`
  font-size: 16px;
  font-family: 'RobotoSlab-Medium';
  color: #232129;
`;

export const Schedule = styled.View`
  margin: 24px 0;
`;

export const ScheduleTitle = styled.Text`
  font-family: 'RobotoSlab-Medium';
  color: #f4ede8;
  font-size: 24px;
  margin: 0 24px 24px;
`;

export const Section = styled.View`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  color: #999591;
  font-family: 'RobotoSlab-Regular';
  margin: 0 24px 12px;
`;

export const SectionContent = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingLeft: 24,
    paddingRight: 12,
  },
})``;

export const Hour = styled(RectButton)<HourProps>`
  padding: 12px;
  margin-right: 12px;
  border-radius: 10px;
  background: ${({ selected }) => (selected ? '#ff9000' : '#3e3b47')};

  opacity: ${({ available }) => (available ? 1 : 0.3)};
`;

export const HourText = styled.Text<HourTextProps>`
  color: ${({ selected }) => (selected ? '#232129' : '#f4ede8')};
  font-family: 'RobotoSlab-Regular';
  font-size: 15px;
`;

export const CreateAppointmentButton = styled(RectButton)`
  height: 50px;
  background: #ff9000;
  border-radius: 10px;
  margin: 0 24px 24px;

  align-items: center;
  justify-content: center;
`;

export const CreateAppointmentButtonText = styled.Text`
  font-size: 18px;
  font-family: 'RobotoSlab-Medium';
  color: #232129;
`;
