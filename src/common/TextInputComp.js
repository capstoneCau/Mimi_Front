import React from 'react';
import {TextInput} from 'react-native';
import {commonStyles} from './style';

export default function TextInputComp({
  name,
  value,
  placeholder,
  maxLength,
  onChange,
  onChangeOne,
  autoFocus,
  width,
  height,
}) {
  if (onChange) {
    return (
      <TextInput
        style={[commonStyles.input, {width: width, height: height}]}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChangeText={(v) => onChange(name, v)}
        autoFocus={autoFocus}
      />
    );
  } else {
    return (
      <TextInput
        style={[commonStyles.input, {width: width, height: height}]}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChangeText={(v) => onChangeOne(v)}
        autoFocus={autoFocus}
      />
    );
  }
}
