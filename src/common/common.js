import * as React from 'react';
import {Button} from 'react-native-paper';
import {StyleSheet} from 'react-native';

export function FancyButton(props) {
  return <Button {...props}>{props.children}</Button>;
}
export const CONST_VALUE = {
  WEEK: ['일', '월', '화', '수', '목', '금', '토'],
  SORT_COLOR: [
    '#497649',
    '#1EAAAA',
    '#FF6E6E',
    '#AAFA82',
    '#C65FF9',
    '#FF0000',
    '#FFB432',
    '#800080',
    '#0064CD',
    '#0A6E0A',
    '#3CB371',
    '#CEBEE1',
    '#282828',
    '#FF8E99',
    '#3C5A91',
    '#D2691E',
  ],
};


export const FancyFonts = {
  BMDOHYEON: 'BMDOHYEON',
};

export const SERVER_DOMAIN = 'https://mimi-server-akuui.run.goorm.io/';
// export const SERVER_DOMAIN = 'http://192.168.0.8:8000/';