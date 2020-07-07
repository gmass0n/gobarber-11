import React, { useState, useEffect, useCallback, useRef } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
  Keyboard,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import getValidationErrors from '../../utils/getValidationErros';

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText,
} from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const { signUp } = useAuth();

  const [showBackToSignInButton, setShowBackToSignInButton] = useState(true);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () =>
      setShowBackToSignInButton(false)
    );

    Keyboard.addListener('keyboardDidHide', () =>
      setShowBackToSignInButton(true)
    );
  }, []);

  const handlSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('E-mail inválido'),
          password: Yup.string().required('Senha obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { name, email, password } = data;

        await signUp({
          name,
          email,
          password,
        });

        formRef.current?.reset();

        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Você já pode fazer o login na aplicação'
        );

        navigation.navigate('SignIn');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro no cadastro!',
          'Ocorreu um erro ao fazer o cadastro, tente novamente'
        );
      }
    },
    [navigation, signUp]
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handlSignUp}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />

              <Input
                name="email"
                icon="mail"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                ref={emailInputRef}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <Input
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                ref={passwordInputRef}
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Criar conta
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      {showBackToSignInButton && (
        <BackToSignInButton onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#ff9000" />

          <BackToSignInButtonText>Voltar para logon</BackToSignInButtonText>
        </BackToSignInButton>
      )}
    </>
  );
};

export default SignUp;
