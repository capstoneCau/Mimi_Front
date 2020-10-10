import * as React from 'react';
import {Button} from 'react-native-paper';

export function FancyButton(props) {
  return <Button {...props}>{props.children}</Button>;
}

export const CONST_VALUE = {
  WEEK: ['일', '월', '화', '수', '목', '금', '토'],
};
