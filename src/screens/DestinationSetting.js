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

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function YourView({navigation}) {
  const [destination, setDestination] = useState();
  return (
    <View style={styles.container}>
      <Postcode
        style={styles.postcode}
        jsOptions={{animated: true}}
        onSelected={(data) => {
          setDestination(data.address);
        }}
      />
      <View style={styles.destination}>
        <Text style={styles.text}>{destination}</Text>
        <FancyButton
          mode="outlined"
          color="#000069"
          onPress={() => {
            navigation.navigate('Setting', {destination});
          }}>
          목적지 설정
        </FancyButton>
      </View>
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
