/* eslint-disable no-undef */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ImagePicker from 'react-native-image-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { StatusBar } from 'react-native';
import {
  KeyboardAvoidingView,
  Platform,
  View,
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

import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErros';

import {
  Container,
  BackButton,
  UserAvatarButton,
  UserAvatar,
  Title,
  SignOutButton,
  SignOutButtonText,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const { goBack } = useNavigation();

  const { signOut, user, updateUser } = useAuth();

  const [showSignOutButtonText, setShowSignOutButtonText] = useState(true);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () =>
      setShowSignOutButtonText(false)
    );

    Keyboard.addListener('keyboardDidHide', () =>
      setShowSignOutButtonText(true)
    );
  }, []);

  const handleUpdateAvatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Selecione um avatar',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Usar câmera',
        chooseFromLibraryButtonTitle: 'Escolher da galeria',
      },
      (response) => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert('Erro ao alterar seu avatar.');
        }

        const data = new FormData();

        data.append('avatar', {
          type: response.type,
          name: `${user.id}.jpg`,
          uri: response.uri,
        });

        api
          .patch('users/avatar', data)
          .then((apiResponse) => updateUser(apiResponse.data));
      }
    );
  }, [user, updateUser]);

  const handlSignUp = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('E-mail inválido'),
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: (val) => !!val,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          passwordConfirmation: Yup.string()
            .when('oldPassword', {
              is: (val) => !!val,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'As senhas não coincidem'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          password,
          email,
          old_password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                password,
                old_password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('profile', formData);

        updateUser(response.data);

        formRef.current?.reset();

        Alert.alert('Perfil atualizado com sucesso!');

        goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro no alteração do perfil!',
          'Ocorreu um erro ao alterar seu perfil, tente novamente.'
        );
      }
    },
    [goBack, updateUser]
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <Container>
          <StatusBar barStyle="light-content" backgroundColor="#312e38" />

          <BackButton onPress={() => goBack()}>
            <FeatherIcon name="chevron-left" color="#999591" size={24} />
          </BackButton>

          <UserAvatarButton onPress={handleUpdateAvatar}>
            <UserAvatar source={{ uri: user.avatar_url }} />
          </UserAvatarButton>

          <View>
            <Title>Meu perfil</Title>
          </View>

          <Form
            ref={formRef}
            onSubmit={handlSignUp}
            initialData={{ name: user.name, email: user.email }}
          >
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
              onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
            />

            <Input
              name="old_password"
              icon="lock"
              placeholder="Senha atual"
              secureTextEntry
              returnKeyType="next"
              containerStyle={{ marginTop: 24 }}
              ref={oldPasswordInputRef}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />

            <Input
              name="password"
              icon="lock"
              placeholder="Nova senha"
              secureTextEntry
              returnKeyType="next"
              ref={passwordInputRef}
              onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            />

            <Input
              name="password_confirmation"
              icon="lock"
              placeholder="Confirmar senha"
              secureTextEntry
              ref={confirmPasswordInputRef}
              onSubmitEditing={() => formRef.current?.submitForm()}
            />

            <Button onPress={() => formRef.current?.submitForm()}>
              Confirmar mudanças
            </Button>
          </Form>
        </Container>
      </KeyboardAvoidingView>

      {showSignOutButtonText && (
        <SignOutButton onPress={() => signOut()}>
          <FeatherIcon name="log-out" size={20} color="#ff9000" />

          <SignOutButtonText>Encerrar sessão</SignOutButtonText>
        </SignOutButton>
      )}
    </>
  );
};

export default Profile;
