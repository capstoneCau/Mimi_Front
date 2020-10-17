import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from 'react-native-geolocation-service';
import {google, naver, odysay} from '../../apiKey.json';

function GoogleMap() {
  // console.log(google, naver)
  const [orgLatitude, setLatitude] = useState(0.0);
  const [orgLongitude, setLongitude] = useState(0.0);
  const [_watchId, setWatchId] = useState(null);
  const [testLocation, setTestLocation] = useState('');
  const [googleTime, setGoogleTime] = useState({
    "hour" : 0,
    "min" : 0
  })
  const [naverTime, setNaverTime] = useState({
    "hour" : 0,
    "min" : 0
  })
  const [odysayTime, setOdysayTime] = useState({
    "hour" : 0,
    "min" : 0
  })

  useEffect(() => {
    getCurrentPosition();
  }, []);

  const getDistanceTimeByGoogle = async (desLatitude, desLongitude) => {
    const APP_KEY = google.distance;
    const BASE_URL =
      'https://maps.googleapis.com/maps/api/distancematrix/json?';
    const params = `units=metric&mode=transit&origins=${orgLatitude},${orgLongitude}&destinations=${desLatitude},${desLongitude}&region=KR&key=${APP_KEY}`;

    const res = await fetch(BASE_URL + params);
    const json = await res.json();

    const time = parseInt(json.rows[0].elements[0].duration.value);
    const hour = parseInt(time / 3600);
    const min = parseInt((time - hour * 3600) / 60);

    return {hour, min};
  };

  const getDistanceTimeByNaver = async (desLatitude, desLongitude) => {
    const CLIENT_ID = naver.client_id
    const CLIENT_SECRET = naver.client_secret
    const BASE_URL = 'https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?'
    const params = `start=${orgLongitude},${orgLatitude}&goal=${desLongitude},${desLatitude}`

    const headers = {
      "X-NCP-APIGW-API-KEY-ID": CLIENT_ID,
      "X-NCP-APIGW-API-KEY": CLIENT_SECRET
    }

    const res = await fetch(BASE_URL + params, {
      headers: headers
    })
    const json = await res.json()
    const time = parseInt(json.route.traoptimal[0].summary.duration)
    const hour = parseInt((time / 1000) / 3600);
    const min = parseInt(((time / 1000) - hour * 3600) / 60);
    return {hour, min};
  }

  const getDistanceTimeByOdySay = async (desLatitude, desLongitude) => {
    const SERVER = odysay.server
    const WEB = odysay.web
    const ANDROID = odysay.android
    const BASE_URL = 'https://api.odsay.com/v1/api/searchPubTransPathT?'
    const params = `SX=${orgLongitude}&SY=${orgLatitude}&EX=${desLongitude}&EY=${desLatitude}&apiKey=${SERVER}`

    const res = await fetch(BASE_URL + params)
    const json = await res.json()
    const min = parseInt(json.result.path[0].info.totalTime)
    const hour = parseInt(min/60);
    return {hour, min};
  }

  const getCurrentPosition = async () => {
    await requestLocationPermission();
    Geolocation.getCurrentPosition((position) => {
      const {latitude, longitude} = position.coords;
      setLatitude(latitude);
      setLongitude(longitude);
    });
  };

  const getCurrentPositionWatch = async () => {
    await requestLocationPermission();
    setWatchId(
      Geolocation.watchPosition(
        (position) => {
          const {latitude, longitude} = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        },
        (error) => {
          // console.log(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 5000,
          fastestInterval: 2000,
        },
      ),
    );
  };

  const getAddressPosition = async (address) => {
    const APP_KEY = google.geocoding;
    const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?';
    const params = `address=${address}&key=${APP_KEY}`;

    const res = await fetch(BASE_URL + params);
    const json = await res.json();
    return json.results[0].geometry.location;
  };

  const stopGetPosition = () => {
    if (_watchId !== null) {
      Geolocation.clearWatch(_watchId);
      setWatchId(null);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'Mimi',
          message: 'To use the safe home service, you need to obtain location information.',
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
      <TextInput
        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(text) => {
          setTestLocation(text);
          // console.log(testLocation)
        }}
        onSubmitEditing={async () => {
          const {lat, lng} = await getAddressPosition(testLocation);
          setGoogleTime(await getDistanceTimeByGoogle(lat, lng));
          setNaverTime(await getDistanceTimeByNaver(lat, lng));
          setOdysayTime(await getDistanceTimeByOdySay(lat, lng));
          // const {hour:ghour, min:gmin} = await getDistanceTimeByGoogle(lat, lng);
          // console.log('Google Api :', ghour, 'hour', gmin, 'min');
          // const {hour:nhour, min:nmin} = await getDistanceTimeByNaver(lat, lng);
          // console.log('Naver Api :', nhour, 'hour', nmin, 'min');
          // const {hour:ohour, min:omin} = await getDistanceTimeByOdySay(lat, lng);
          // console.log('Odysay Api :', ohour, 'hour', omin, 'min')
        }}
        value={testLocation}
      />
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <TouchableOpacity
            onPress={() => {
              getCurrentPositionWatch();
            }}
            style={styles.getPositionBtn}>
            <Text style={styles.getPositionText}>Get</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.subContainer}>
          <TouchableOpacity
            onPress={() => {
              stopGetPosition();
            }}
            style={styles.getPositionStopBtn}>
            <Text style={styles.getPositionStopText}>Stop</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.coordText}>Latitude : {orgLatitude}</Text>
        </View>
        <View style={styles.subContainer}>
          <Text style={styles.coordText}>Longitute : {orgLongitude}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.thirdContainer}>
          <Text style={styles.coordText}>Google : {googleTime.hour}h {googleTime.min}m</Text>
        </View>
        <View style={styles.thirdContainer}>
          <Text style={styles.coordText}>Naver : {naverTime.hour}h {naverTime.min}m</Text>
        </View>
        <View style={styles.thirdContainer}>
          <Text style={styles.coordText}>Odysay : {odysayTime.hour}h {odysayTime.min}m</Text>
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
  subContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thirdContainer: {
    flex: 0.33,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coordText: {
    fontSize: 30,
  },

  getPositionBtn: {
    height: 100,
    width: 100,
    backgroundColor: 'red',
  },
  getPositionText: {
    fontSize: 50,
  },
  getPositionStopBtn: {
    height: 100,
    width: 100,
    backgroundColor: 'blue',
  },
  getPositionStopText: {
    fontSize: 40,
    color: 'white',
  },
  serverTestBtn: {
    height: 100,
    width: 100,
    backgroundColor: 'green',
  },
  serverTestText: {
    fontSize: 100,
    color: 'white',
  },
});
