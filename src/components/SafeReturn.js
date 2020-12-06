import Geolocation from 'react-native-geolocation-service';
import {google, naver, odysay} from '../../apiKey.json';
import {sendNotification} from '../modules/sendNotification';
import BackgroundTimer from 'react-native-background-timer';
import infoToLocal from '../common/InfoToLocal';
import localToInfo from '../common/LocalToInfo';
import {PermissionsAndroid} from 'react-native';

export const startSafeReturnFunc = async (friends, name) => {
  const token = await localToInfo('token');
  const kakaoId = await localToInfo('kakaoId');

  let remainTime = null;

  const notiReceiverIds = await localToInfo('notiReceiverIds');
  if (notiReceiverIds) {
    friends = [...new Set(friends.concat(notiReceiverIds))];
    const idx = friends.indexOf(kakaoId);
    if (idx != -1) {
      friends.splice(idx, 1);
    }
  }
  console.log(friends);
  const {lat: latitude, lng: longitude} = await localToInfo('coordinate');
  const watchingTime = 5;
  let safeReturnId = null;

  let orgLocation = null;
  Geolocation.getCurrentPosition(
    (initPos) => {
      orgLocation = {
        latitude: initPos.coords.latitude,
        longitude: initPos.coords.longitude,
      };
      safeReturnId = BackgroundTimer.setInterval(async () => {
        Geolocation.getCurrentPosition((position) => {
          orgLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        });
        if (orgLocation != null) {
          if (remainTime == null) {
            const naverTime = await getDistanceTimeByNaver(orgLocation, {
              latitude,
              longitude,
            });
            const odsayTime = await getDistanceTimeByOdySay(orgLocation, {
              latitude,
              longitude,
            });
            console.log(naverTime, odsayTime);
            remainTime = Math.max(naverTime, odsayTime);
          }
          remainTime -= watchingTime;
          if (remainTime <= 0) {
            BackgroundTimer.clearInterval(safeReturnId);
            infoToLocal('safeReturnId', null);
            sendNotification(
              friends,
              '긴급 구조 요청',
              name + '님께서 구조 요청을 하셨습니다.',
              token,
            );
          }
          const remainDistance = getDistanceTwoPosition(orgLocation, {
            latitude,
            longitude,
          });
          console.log(
            '위치와의 거리 : ',
            remainDistance,
            'm ',
            '남은 시간 : ',
            remainTime,
            's',
          );
          if (remainDistance < 100) {
            BackgroundTimer.clearInterval(safeReturnId);
            infoToLocal('safeReturnId', null);
          }
        }
      }, watchingTime * 1000);
      infoToLocal('safeReturnId', safeReturnId);
    },
    (error) => {
      console.log(error);
      return;
    },
  );
};

export const stopSafeReturnFunc = async () => {
  BackgroundTimer.clearInterval(await localToInfo('safeReturnId'));
  infoToLocal('safeReturnId', null);
};

export const getAddressPosition = async (address) => {
  const APP_KEY = google.geocoding;
  const BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?';
  const params = `address=${address}&key=${APP_KEY}`;

  const res = await fetch(BASE_URL + params);
  const json = await res.json();
  console.log(json);
  return json.results.length != 0 ? json.results[0].geometry.location : null;
};

export const requestLocationPermission = async () => {
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
      return true;
    } else {
      console.log('location permission denied');
      // alert("Location permission denied");
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export const getDistanceTimeByNaver = async (orgLocation, desLocation) => {
  const CLIENT_ID = naver.client_id;
  const CLIENT_SECRET = naver.client_secret;
  const BASE_URL =
    'https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?';
  const params = `start=${orgLocation.longitude},${orgLocation.latitude}&goal=${desLocation.longitude},${desLocation.latitude}`;

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
  const sec = parseInt(time / 1000 - hour * 3600 - min * 60);

  return hour * 3600 + min * 60 + sec;
};

export const getDistanceTimeByOdySay = async (orgLocation, desLocation) => {
  const SERVER = odysay.server;
  const WEB = odysay.web;
  const ANDROID = odysay.android;
  const BASE_URL = 'https://api.odsay.com/v1/api/searchPubTransPathT?';
  const params = `SX=${orgLocation.longitude}&SY=${orgLocation.latitude}&EX=${desLocation.longitude}&EY=${desLocation.latitude}&apiKey=${SERVER}`;

  const res = await fetch(BASE_URL + params);
  const json = await res.json();
  if (json.error) {
    return 0;
  }
  const min = parseInt(json.result.path[0].info.totalTime);
  const hour = parseInt(min / 60);

  return hour * 3600 + min;
};

export const getDistanceTwoPosition = (orgLocation, desLocation) => {
  const theta = orgLocation.longitude - desLocation.longitude;
  const dist =
    rad2deg(
      Math.acos(
        Math.sin(deg2rad(orgLocation.latitude)) *
          Math.sin(deg2rad(desLocation.latitude)) +
          Math.cos(deg2rad(orgLocation.latitude)) *
            Math.cos(deg2rad(desLocation.latitude)) *
            Math.cos(deg2rad(theta)),
      ),
    ) *
    60 *
    1.1515 *
    1.609344;

  return Number(dist * 1000).toFixed(2); // 단위 : m
};

const deg2rad = (deg) => {
  return (deg * Math.PI) / 180;
};
const rad2deg = (rad) => {
  return (rad * 180) / Math.PI;
};
