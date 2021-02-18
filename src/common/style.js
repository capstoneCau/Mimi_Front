import {StyleSheet, Dimensions} from 'react-native';
import {FancyFonts} from './common';
import styled from 'styled-components';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export const commonStyles = StyleSheet.create({
  input: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 8,
  },
  nextButton: {
    width: width * 0.9,
    borderRadius: 8,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontFamily: FancyFonts.BMDOHYEON,
  },
});

export const BlankContainer = styled.View`
  flex: ${(props) => props.flexSize};
`;
