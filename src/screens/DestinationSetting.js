import Postcode from 'react-native-daum-postcode';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {FancyButton, FancyFonts, backAction} from '../common/common';
import infoToLocal from '../common/InfoToLocal';
import {getAddressPosition} from '../components/SafeReturn';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function YourView({navigation}) {
  const [destination, setDestination] = useState();
  const syncFunction = (address) => {
    return new Promise((res, rej) => {
      setDestination(address);
      res(address);
    });
  };

  return (
    <View style={styles.container}>
      <Postcode
        style={styles.postcode}
        jsOptions={{animated: true}}
        onSelected={(data) => {
          syncFunction(data.address)
            .then((response) => response)
            .then(async (result) => {
              infoToLocal('destination', await getAddressPosition(result));
              return result;
            })
            .then((result) => {
              navigation.navigate('Setting', {destination: result});
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
