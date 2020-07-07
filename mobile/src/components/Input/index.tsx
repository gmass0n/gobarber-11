import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import {
  TextInputProps,
  TextInput as RNTextInput,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
  containerStyle?: StyleProp<ViewStyle>;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, containerStyle = {}, ...rest },
  ref
) => {
  const inputElementRef = useRef<RNTextInput>(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);

  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current?.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(reference, value) {
        inputValueRef.current.value = value;
        inputElementRef.current?.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current?.clear();
      },
    });
  }, [fieldName, registerField]);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputValueRef.current.value);
  }, []);

  const verifyIconColor = useCallback(() => {
    if (isFocused) {
      return '#ff9000';
    }

    if (error) {
      return '#c53030';
    }

    if (isFilled) {
      return '#ff9000';
    }

    return '#666360';
  }, [error, isFilled, isFocused]);

  return (
    <Container isFocused={isFocused} isErrored={!!error} style={containerStyle}>
      <Icon name={icon} size={20} color={verifyIconColor()} />

      <TextInput
        {...rest}
        selectTextOnFocus
        ref={inputElementRef}
        defaultValue={defaultValue}
        placeholderTextColor="#666360"
        keyboardAppearance="dark"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChangeText={(value) => {
          inputValueRef.current.value = value;
        }}
      />
    </Container>
  );
};

export default forwardRef(Input);
