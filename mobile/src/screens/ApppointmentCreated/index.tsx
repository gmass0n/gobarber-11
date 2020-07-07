import React, { useCallback, useMemo } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { StatusBar } from 'react-native';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from './styles';

interface RouteParams {
  date: number;
}

const ApppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();

  const routeParams = params as RouteParams;

  const handlePressOk = useCallback(() => {
    reset({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    });
  }, [reset]);

  const formattedDate = useMemo(() => {
    const weekDay = format(routeParams.date, 'EEEE', {
      locale: ptBR,
    });

    if (weekDay === 'sábado' || weekDay === 'domingo') {
      return format(
        routeParams.date,
        "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
        {
          locale: ptBR,
        }
      );
    }

    return format(
      routeParams.date,
      "EEEE'-feira, dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm'h'",
      {
        locale: ptBR,
      }
    );
  }, [routeParams]);

  return (
    <Container>
      <StatusBar barStyle="light-content" backgroundColor="#312e38" />

      <FeatherIcon name="check" size={80} color="#04d361" />

      <Title>Agendamento concluído</Title>

      <Description>{formattedDate}</Description>

      <OkButton onPress={handlePressOk}>
        <OkButtonText>OK</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default ApppointmentCreated;
