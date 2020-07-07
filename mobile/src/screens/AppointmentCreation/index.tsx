import React, { useCallback, useEffect, useState, useMemo } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import { Platform, Alert } from 'react-native';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import { Provider } from '../Dashboard';

import {
  Container,
  BackButton,
  Header,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersListContainer,
  ProviderList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  CalendarTitle,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  ScheduleTitle,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles';

interface RouteParams {
  providerId: string;
}

interface DayAvailability {
  hour: number;
  available: boolean;
  formattedHour: string;
}

const AppointmentCreation: React.FC = () => {
  const { params } = useRoute();
  const { user } = useAuth();
  const { goBack, navigate } = useNavigation();

  const routeParams = params as RouteParams;

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);

  const [dayAvailability, setDayAvailability] = useState<DayAvailability[]>([]);

  useEffect(() => {
    api.get(`providers`).then((response) => setProviders(response.data));
  }, []);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then((response) => setDayAvailability(response.data));
  }, [selectedDate, selectedProvider]);

  const handleNavigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((prevState) => !prevState);
  }, []);

  const handleChangeDate = useCallback((event, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour - 1);
      date.setMinutes(0);
      date.setSeconds(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (error) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente.'
      );
    }
  }, [selectedDate, selectedHour, selectedProvider, navigate]);

  const morningAvailability = useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [dayAvailability]);

  const afternoonAvailability = useMemo(() => {
    return dayAvailability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          formattedHour: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [dayAvailability]);

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="#28262e" />

      <Header>
        <BackButton onPress={handleNavigateBack}>
          <FeatherIcon name="chevron-left" color="#999591" size={24} />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <Content>
        <ProvidersListContainer>
          <ProviderList
            data={providers}
            keyExtractor={(provider) => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id === selectedProvider}
                onPress={() => handleSelectProvider(provider.id)}
              >
                {provider.avatar_url && (
                  <ProviderAvatar source={{ uri: provider.avatar_url }} />
                )}

                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <CalendarTitle>Escolha a data</CalendarTitle>

          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              textColor="#f4ede8"
              minimumDate={new Date()}
              onChange={handleChangeDate}
            />
          )}
        </Calendar>

        <Schedule>
          <ScheduleTitle>Escolha o horário</ScheduleTitle>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability &&
                morningAvailability.map(
                  ({ formattedHour, available, hour }) => (
                    <Hour
                      enabled={available}
                      key={formattedHour}
                      available={available}
                      selected={selectedHour === hour}
                      onPress={() => handleSelectHour(hour)}
                    >
                      <HourText selected={selectedHour === hour}>
                        {formattedHour}
                      </HourText>
                    </Hour>
                  )
                )}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability &&
                afternoonAvailability.map(
                  ({ formattedHour, available, hour }) => (
                    <Hour
                      key={formattedHour}
                      available={available}
                      enabled={available}
                      selected={selectedHour === hour}
                      onPress={() => handleSelectHour(hour)}
                    >
                      <HourText selected={selectedHour === hour}>
                        {formattedHour}
                      </HourText>
                    </Hour>
                  )
                )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default AppointmentCreation;
