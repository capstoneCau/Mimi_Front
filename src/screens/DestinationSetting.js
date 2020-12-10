import Postcode from 'react-native-daum-postcode';
import React, {useState, useCallback, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {useDispatch} from 'react-redux';
import {FancyFonts} from '../common/common';
import {saveDestination} from '../modules/safeReturn';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function YourView({navigation}) {
  const dispatch = useDispatch();
  const _saveDestination = useCallback(
    (_destination, coordinate) =>
      dispatch(saveDestination(_destination, coordinate)),
    [dispatch],
  );

  return (
    <View style={styles.container}>
      <Postcode
        style={styles.postcode}
        jsOptions={{animated: true}}
        onSelected={(data) => {
          _saveDestination(data.address).then(() => {
            navigation.navigate('Setting');
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postcode: {
    width: width,
    height: height * 0.8,
  },
  destination: {
    alignItems: 'center',
  },
  text: {
    fontSize: 17,
    padding: 15,
    fontFamily: FancyFonts.BMDOHYEON,
  },
});
