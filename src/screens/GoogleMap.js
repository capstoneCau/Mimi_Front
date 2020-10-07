import React, {useState, useEffect} from 'react';
import { View, Text, PermissionsAndroid, TouchableOpacity, StyleSheet } from "react-native"; 
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"; 
import Geolocation from 'react-native-geolocation-service';

function GoogleMap() { 
    // console.log(getDistane())
    const [orgLatitude, setLatitude] = useState(0.0);
    const [orgLongitude, setLongitude] = useState(0.0);
    const [_watchId, setWatchId] = useState(null)
    const desLatitude = 0.0
    const desLongitude = 0.0
    let wid = null
    const getDistaneTime = async () => {
        const APP_KEy = "AIzaSyAIyxQhX3vlCITn3oRTj27loxqqd1kmRd0"
        const BASE_URL = "https://maps.googleapis.com/maps/api/distancematrix/json?"
        const params = `units=metric&mode=transit&origins=${orgLatitude},${orgLongitude}&destinations=${desLatitude},${desLongitude}&region=KR&key=${APP_KEY}`
   
        const res = await fetch('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=transit&origins=37.541,126.986&destinations=35.1595454,126.8526012&region=KR&key=AIzaSyAIyxQhX3vlCITn3oRTj27loxqqd1kmRd0')
        const json = await res.json()
    
        return json
    }

    const getCurrentPosition = async () => {
        await requestLocationPermission();
        setWatchId(Geolocation.watchPosition(
            position => {
                const {latitude, longitude} = position.coords;
                setLatitude(latitude);
                setLongitude(longitude);
                console.log(latitude, longitude)
            },
            error => {
              console.log(error);
            }, { enableHighAccuracy: true, distanceFilter: 0, interval: 5000, fastestInterval: 2000,},
        ));
    }

    const stopGetPosition = () => {
        // console.log(_watchid)
        // Geolocation.stopObserving()
        if (_watchId !== null) {
            Geolocation.clearWatch(_watchId);
            console.log("stop")
            setWatchId(null)
            // 종료 기능
        }
    }

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                'title': 'Example App',
                'message': 'Example App access to your location '
            })
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location")
                // alert("You can use the location");
            } else {
                console.log("location permission denied")
                // alert("Location permission denied");
            }
        } catch (err) {
            console.warn(err)
        }
    }
    
    return ( 
    <View style={{ flex: 1 }}> 
        {/* <MapView style={{ flex: 1 }} 
            provider={PROVIDER_GOOGLE} 
            initialRegion={{ 
                latitude: orgLatitude, 
                longitude: orgLongitude, 
                latitudeDelta: 0.0922, 
                longitudeDelta: 0.0421, 
            }}
        />  */}
        <TouchableOpacity
            onPress={() => {
                getCurrentPosition()
            }}
            style={styles.getPositionBtn}>
        <Text style={styles.getPositionText}>Get</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => {
                stopGetPosition()
            }}
            style={styles.getPositionStopBtn}>
        <Text style={styles.getPositionStopText}>Stop</Text>
        </TouchableOpacity>
    </View>); 

} export default GoogleMap;

const styles = StyleSheet.create({
    getPositionBtn: {
      height: 300,
      width: 300,
      backgroundColor: 'red',
    },
    getPositionText: {
        fontSize: 100
    },
    getPositionStopBtn: {
        height: 300,
        width: 300,
        backgroundColor: 'blue',
      },
      getPositionStopText: {
          fontSize: 100,
          color: 'white'
      }
  });
  