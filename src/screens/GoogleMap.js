import React from "react"; 
import { View, Text } from "react-native"; 
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"; 
function GoogleMap() { 
    console.log(getDistane())
    return ( 
    <View style={{ flex: 1 }}> 
        <MapView style={{ flex: 1 }} 
            provider={PROVIDER_GOOGLE} 
            initialRegion={{ 
                latitude: 37.78825, 
                longitude: -122.4324, 
                latitudeDelta: 0.0922, 
                longitudeDelta: 0.0421, 
            }}
        /> 
    </View>); 
} export default GoogleMap;

const APP_KEy = "AIzaSyAIyxQhX3vlCITn3oRTj27loxqqd1kmRd0"
const BASE_URL = "https://maps.googleapis.com/maps/api/distancematrix/json"

const params = 'units=metric&mode=transit   '

let ApiURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";
    let params = `origins=${BaseLocation}&destinations=${TargetLocation}&key=${GOOGLE_DISTANCES_API_KEY}`;  
    let finalApiURL = `${ApiURL}${encodeURI(params)}`;

async function getDistane() {
    const res = await fetch('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=transit&origins=37.541,126.986&destinations=35.1595454,126.8526012&region=KR&key=AIzaSyAIyxQhX3vlCITn3oRTj27loxqqd1kmRd0')
    const json = await res.json()

    console.log(json)
}