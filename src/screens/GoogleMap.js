import React, {useState, useEffect} from 'react';
import {
  View,
  PermissionsAndroid,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Avatar,
  TextInput,
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  Portal,
  Dialog,
  useTheme,
  RadioButton,
} from 'react-native-paper';
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from 'react-native-geolocation-service';
import {google, naver, odysay} from '../../apiKey.json';
import {FancyButton, FancyFonts} from '../common/common';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

function GoogleMap() {
  // console.log(google, naver)
  const [orgLocation, setOrgLocation] = useState({
    "latitude" : 0.0,
    "longitude" : 0.0
  })
  const [desLocation, setDesLocation] = useState({
    "latitude" : 0.0,
    "longitude" : 0.0
  })
  
  const [orgLatitude, setOrgLatitude] = useState(0.0);
  const [orgLongitude, setOrgLongitude] = useState(0.0);
  
  const [desLatitude, setDesLatitude] = useState(0.0);
  const [desLongitude, setDesLongitude] = useState(0.0);

  const [duration, setDuration] = useState(0);

  const [_watchId, setWatchId] = useState(null);
  let watchId = null;
  const [testLocation, setTestLocation] = useState('');
  const [googleTime, setGoogleTime] = useState({
    hour: 0,
    min: 0,
  });
  const [naverTime, setNaverTime] = useState({
    hour: 0,
    min: 0,
  });
  const [odysayTime, setOdysayTime] = useState({
    hour: 0,
    min: 0,
  });

  useEffect(() => {
    getCurrentPosition();
  }, []);

  // const getDistanceTimeByGoogle = async (desLatitude, desLongitude) => {
  //   const APP_KEY = google.distance;
  //   const BASE_URL =
  //     'https://maps.googleapis.com/maps/api/distancematrix/json?';
  //   const params = `units=metric&mode=transit&origins=${orgLatitude},${orgLongitude}&destinations=${desLatitude},${desLongitude}&region=KR&key=${APP_KEY}`;

  //   const res = await fetch(BASE_URL + params);
  //   const json = await res.json();

  //   const time = parseInt(json.rows[0].elements[0].duration.value);
  //   const hour = parseInt(time / 3600);
  //   const min = parseInt((time - hour * 3600) / 60);

  //   return {hour, min};
  // };


  const getDistanceTimeByNaver = async (desLatitude, desLongitude) => {
    const CLIENT_ID = naver.client_id;
    const CLIENT_SECRET = naver.client_secret;
    const BASE_URL =
      'https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?';
    const params = `start=${orgLongitude},${orgLatitude}&goal=${desLongitude},${desLatitude}`;

    const headers = {
      'X-NCP-APIGW-API-KEY-ID': CLIENT_ID,
      'X-NCP-APIGW-API-KEY': CLIENT_SECRET,
    };

    const res = await fetch(BASE_URL + params, {
      headers: headers,
    });
    const json = await res.json();
    const time = parseInt(json.route.traoptimal[0].summary.duration);
    const hour = parseInt(time / 1000 / 3600);
    const min = parseInt((time / 1000 - hour * 3600) / 60);
    return {hour, min};
  };

  const getDistanceTimeByOdySay = async (desLatitude, desLongitude) => {
    const SERVER = odysay.server;
    const WEB = odysay.web;
    const ANDROID = odysay.android;
    const BASE_URL = 'https://api.odsay.com/v1/api/searchPubTransPathT?';
    const params = `SX=${orgLongitude}&SY=${orgLatitude}&EX=${desLongitude}&EY=${desLatitude}&apiKey=${SERVER}`;

    const res = await fetch(BASE_URL + params);
    const json = await res.json();
    const min = parseInt(json.result.path[0].info.totalTime);
    const hour = parseInt(min / 60);
    return {hour, min};
  };

  const getCurrentPosition = async () => {
    await requestLocationPermission();
    Geolocation.getCurrentPosition((position) => {
      setOrgLocation(position.coords)
    });
  };

  const getCurrentPositionWatch = async () => {
    await requestLocationPermission();
    if(_watchId == null && (desLocation.latitude > 0.0 && desLocation.longitude > 0.0)) {
      watchId = Geolocation.watchPosition((position) => {
        setOrgLocation(position.coords);
        const distance = getDistanceTwoPosition();
        console.log("위치와의 거리 : ", distance, "m");
        if (distance < 100) {
          console.log("목적지에 도착하였습니다.")
          Geolocation.clearWatch(watchId);
          watchId = null;
          setWatchId(null);
          console.log("종료");
        }
      },(error) => {
        // console.log(error);
      },{
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 5000,
        fastestInterval: 2000,
      })
      setWatchId(watchId)      
    }
  };

  const stopGetPosition = () => {
    if (_watchId !== null) {
      Geolocation.clearWatch(_watchId);
      setWatchId(null);
      watchId = null;
    }
  };

  const getDistanceTwoPosition = () => {
    const theta = orgLocation.longitude - desLocation.longitude;
    const dist = rad2deg(Math.acos(Math.sin(deg2rad(orgLocation.latitude)) * Math.sin(deg2rad(desLocation.latitude)) + Math.cos(deg2rad(orgLocation.latitude))
          * Math.cos(deg2rad(desLocation.latitude)) * Math.cos(deg2rad(theta))))* 60 * 1.1515 * 1.609344;

    return Number(dist*1000).toFixed(2);   // 단위 : m
  }

  const deg2rad = (deg) => {
    return (deg * Math.PI / 180);
  }
  const rad2deg = (rad) => {
    return (rad * 180 / Math.PI);
  }

  const getAddressPosition = async (address) => {
    const APP_KEY = google.geocoding;
    const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?';
    const params = `address=${address}&key=${APP_KEY}`;

    const res = await fetch(BASE_URL + params);
    const json = await res.json();
    console.log(json);
    return json.results[0].geometry.location;
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Mimi',
          message:
            'To use the safe home service, you need to obtain location information.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // alert("You can use the location");
      } else {
        console.log('location permission denied');
        // alert("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  return (
    <View style={{flex: 1}}>
      {/* <MapView style={{ flex: 1 }} 
            provider={PROVIDER_GOOGLE} 
            initialRegion={{ 
                latitude: orgLatitude, 
                longitude: orgLongitude, 
                latitudeDelta: 0.0922, 
                longitudeDelta: 0.0421, 
            }}
        />  */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>안전 귀가 서비스</Text>
      </View>
      <View style={styles.firstContainer}>
        <View style={styles.subContainer}>
          <FancyButton
            icon="navigation"
            mode="outlined"
            color="#000069"
            onPress={() => {
              getCurrentPositionWatch();
            }}>
            <Text style={styles.text}>주소GET</Text>
          </FancyButton>
        </View>
        <View style={styles.subContainer}>
          <FancyButton
            icon="stop"
            mode="outlined"
            color="#000069"
            onPress={() => {
              stopGetPosition();
            }}>
            <Text style={styles.text}>Stop</Text>
          </FancyButton>
        </View>
      </View>
      <View style={styles.secContainer}>
        <View>
          {/* <Text style={styles.coordText}>Latitude : {orgLatitude}</Text> */}
          <Text style={styles.coordText}>Org Latitude : {orgLocation.latitude}</Text>
        </View>
        <View>
          {/* <Text style={styles.coordText}>Longitute : {orgLongitude}</Text> */}
          <Text style={styles.coordText}>Org Longitute : {orgLocation.longitude}</Text>
        </View>
      </View>
      <View style={styles.secContainer}>
        <View>
          {/* <Text style={styles.coordText}>Latitude : {orgLatitude}</Text> */}
          <Text style={styles.coordText}>Des Latitude : {desLocation.latitude}</Text>
        </View>
        <View>
          {/* <Text style={styles.coordText}>Longitute : {orgLongitude}</Text> */}
          <Text style={styles.coordText}>Des Longitute : {desLocation.longitude}</Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="목적지"
          mode="outlined"
          style={styles.input}
          onChangeText={(text) => {
            setTestLocation(text);
            // console.log(testLocation)
          }}
          value={testLocation}
        />
        <FancyButton
          icon="arrow-right-bold"
          mode="outlined"
          color="#000069"
          style={styles.startButton}
          onPress={async () => {
            const {lat, lng} = await getAddressPosition(testLocation);
            // console.log(await getAddressPosition(testLocation));
            setDesLocation({
              "latitude" : lat,
              "longitude" : lng
            });
            setNaverTime(await getDistanceTimeByNaver(lat, lng));
            setOdysayTime(await getDistanceTimeByOdySay(lat, lng));
          }}>
          <Text style={styles.text}>거리계산</Text>
        </FancyButton>
      </View>
      <View style={styles.thirdContainer}>
        {/* <View>
          <Text style={styles.coordText}>
            Google : {googleTime.hour}h {googleTime.min}m
          </Text>
        </View> */}
        <View>
          <Text style={styles.coordText}>
            Naver : {naverTime.hour}h {naverTime.min}m
          </Text>
        </View>
        <View>
          <Text style={styles.coordText}>
            Odsay : {odysayTime.hour}h {odysayTime.min}m
          </Text>
        </View>
      </View>
    </View>
  );
}
export default GoogleMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 40,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  firstContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: width * 0.5,
  },
  startButton: {
    marginLeft: 20,
  },
  coordText: {
    fontSize: 25,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  subContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thirdContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  serverTestBtn: {
    height: 100,
    width: 100,
    backgroundColor: 'green',
  },
  serverTestText: {
    fontSize: 100,
    fontFamily: FancyFonts.BMDOHYEON,
    color: 'white',
  },
  text: {
    fontFamily: FancyFonts.BMDOHYEON,
  },
});
