import React, {useState, useEffect} from 'react';
import { View, Text, PermissionsAndroid, TouchableOpacity, StyleSheet, TextInput  } from "react-native"; 
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps"; 
import Geolocation from 'react-native-geolocation-service';
import googleApiKey from '../../googleApiKey.json'

function GoogleMap() { 
    // console.log(getDistane())
    const [orgLatitude, setLatitude] = useState(0.0);
    const [orgLongitude, setLongitude] = useState(0.0);
    const [_watchId, setWatchId] = useState(null)
    const [testLocation, setTestLocation] = useState('')

    useEffect(() => {
        getCurrentPosition()
    }, [])

    const getDistaneTime = async (desLatitude, desLongitude) => {
        const APP_KEY = googleApiKey.distance.key
        const BASE_URL = "https://maps.googleapis.com/maps/api/distancematrix/json?"
        const params = `units=metric&mode=transit&origins=${orgLatitude},${orgLongitude}&destinations=${desLatitude},${desLongitude}&region=KR&key=${APP_KEY}`
        
        console.log(BASE_URL+params)

        const res = await fetch(BASE_URL+params)
        const json = await res.json()
        
        const time = parseInt(json.rows[0].elements[0].duration.value)
        const hour = parseInt(time/3600)
        const min = parseInt((time-(hour*3600))/60)

        console.log(hour, "hour", min, "min")

        return {hour, min}
    }

    const getCurrentPosition = async () => {
        await requestLocationPermission();
        Geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            setLatitude(latitude);
            setLongitude(longitude);
        })
    }

    const getCurrentPositionWatch = async () => {
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

    const getAddressPosition = async (address) => {
        const APP_KEY = googleApiKey.geocoding.key
        const BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?"
        const params = `address=${address}&key=${APP_KEY}`
        
        // console.log(BASE_URL+params)
        // const res = await fetch(BASE_URL+params)
        // const json = await res.json() 
        const res = await fetch(BASE_URL + params)
        const json = await res.json()
        console.log(json.results[0].geometry.location)
        return json.results[0].geometry.location
        // Geocoder.init(APP_KEY); // use a valid API key
        // Geocoder.from(address)
        // .then(json => {
        //     var location = json.results[0].geometry.location;
        //     console.log(location);
        //     return location
        // })
        // .catch(error => console.warn(error));

        
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
        console.log()
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
        <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={text => {
                setTestLocation(text)
                // console.log(testLocation)
            }}
            onSubmitEditing={async () => {
                const {lat, lng} = await getCurrentPosition(testLocation)
                console.log(lat, lng)
                const {hour, min} = await getDistaneTime(lat, lng)
                console.log(hour, min)
            }}
            value={testLocation}
            />
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <TouchableOpacity
                onPress={() => {
                    getCurrentPositionWatch()
                }}
                style={styles.getPositionBtn}>
                    <Text style={styles.getPositionText}>Get</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.subContainer}>
                <TouchableOpacity
                    onPress={() => {
                        stopGetPosition()
                    }}
                style={styles.getPositionStopBtn}>
                    <Text style={styles.getPositionStopText}>Stop</Text>
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Text style={styles.coordText}>Latitude : { orgLatitude }</Text>
            </View>
            <View style={styles.subContainer}>
                <Text style={styles.coordText}>Longitute : { orgLongitude }</Text>
            </View>
        </View>
    </View>); 

} export default GoogleMap;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center"
    },
    subContainer: {
        flex: 0.5,
        justifyContent: "center",
        alignItems: "center"
    },
    coordText: {
        fontSize: 30
    },

    getPositionBtn: {
      height: 200,
      width: 300,
      backgroundColor: 'red',
    },
    getPositionText: {
        fontSize: 100
    },
    getPositionStopBtn: {
        height: 200,
        width: 300,
        backgroundColor: 'blue',
    },
    getPositionStopText: {
        fontSize: 100,
        color: 'white'
    },
    serverTestBtn: {
        height: 200,
        width: 300,
        backgroundColor: 'green',
    },
    serverTestText: {
        fontSize: 100,
        color: 'white'
    }
  });
