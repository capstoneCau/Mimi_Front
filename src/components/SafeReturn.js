import Geolocation from 'react-native-geolocation-service';
import {google, naver, odysay} from '../../apiKey.json';
import {sendNotification} from '../modules/sendNotification';
import BackgroundTimer from 'react-native-background-timer';
import infoToLocal from '../common/InfoToLocal';
import localToInfo from '../common/LocalToInfo';
import {PermissionsAndroid} from 'react-native';
export const startSafeReturnFunc = async (friends) => {
  const token = await localToInfo('token');
  const kakaoId = await localToInfo('kakaoId');
  // 추후에 테스트 해보아야함
  //   const notiReceiver = await localToInfo('notiReceiver');
  //   if (notiReceiver) {
  //     friends = friends.concat(notiReceiver);
  //   }
  let orgLocation = null;
  let remainTime = null;
  const notiReceiver = await localToInfo('notiReceiver');
  if (notiReceiver) {
    friends = [...new Set(friends.concat(notiReceiver))];
    friends.splice(friends.indexOf(kakaoId), 1);
  }
  const {lat: latitude, lng: longitude} = await localToInfo('destination');
  const watchingTime = 5;
  if (!(await localToInfo('safeReturnId'))) {
    if (latitude != null && longitude != null) {
      const watchId = BackgroundTimer.setInterval(async () => {
        Geolocation.getCurrentPosition(
          (position) => {
            const {
              latitude: _latitude,
              longitude: _longitude,
            } = position.coords;
            console.log('In geo ' + _latitude, _longitude);
            orgLocation = {
              latitude: _latitude,
              longitude: _longitude,
            };
          },
          (error) => {
            console.log(error);
            BackgroundTimer.clearInterval(watchId);
            infoToLocal('safeReturnId', null);
            return;
          },
        );
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
            BackgroundTimer.clearInterval(watchId);
            sendNotification(
              friends,
              '집에 못들어 갔어요',
              '집에 못들어감 ㅠㅠ',
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
            BackgroundTimer.clearInterval(watchId);
          }
        }
      }, watchingTime * 1000);
      infoToLocal('safeReturnId', watchId);

      // Test code
      BackgroundTimer.setTimeout(async () => {
        const _watchId = await localToInfo('safeReturnId');
        console.log(watchId, _watchId);
        BackgroundTimer.clearInterval(_watchId);
        infoToLocal('safeReturnId', null);
        sendNotification(
          friends,
          '집에 못들어 갔어요',
          '집에 못들어감 ㅠㅠ',
          token,
        );
      }, 7000);
      // Test Code
    }
  }
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

const getDistanceTimeByNaver = async (orgLocation, desLocation) => {
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

const getDistanceTimeByOdySay = async (orgLocation, desLocation) => {
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

const getCurrentPosition = async () => {
  //   const perm = await requestLocationPermission();
  //   console.log(perm);
  //   if (perm) {
  Geolocation.getCurrentPosition((position) => {
    return position.coords;
  });
  //   }
};

const getCurrentPositionWatch = async () => {
  await requestLocationPermission();
  if (
    (await localToInfo('watchId')) == null &&
    desLocation.latitude > 0.0 &&
    desLocation.longitude > 0.0
  ) {
    const watchId = BackgroundTimer.setInterval(() => {
      Geolocation.getCurrentPosition((position) => {
        setOrgLocation(position.coords);
      });
      const distance = getDistanceTwoPosition();
      console.log('위치와의 거리 : ', distance, 'm');
      if (distance < 300) {
        console.log('목적지에 도착하였습니다.');
        BackgroundTimer.clearInterval(watchId);
        watchId = null;
        setWatchId(null);
        console.log('종료');
      }
    }, 2000);
    infoToLocal('watchId', watchId);

    BackgroundTimer.setTimeout(() => {
      infoToLocal('watchId', null);
      BackgroundTimer.clearInterval(watchId);
      sendNotification(
        ['1496391237'],
        '안전귀가서비스',
        `${user.userInfo.name}이 시간안에 도착하지 않았습니다.`,
        user.token,
      );
    }, 5000);
  }
};

const stopGetPosition = async () => {
  const watchId = await localToInfo('watchId');
  if (watchId !== null) {
    BackgroundTimer.clearInterval(watchId);
    infoToLocal('watchId', null);
    sendNotification(
      ['1496391237'],
      '안전귀가서비스',
      `${user.userInfo.name}이 시간안에 도착하지 않았습니다.`,
      user.token,
    );
  }
};

const getDistanceTwoPosition = (orgLocation, desLocation) => {
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
