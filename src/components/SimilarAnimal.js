import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Button,
  PermissionsAndroid,
  Image,
  StyleSheet,
  Text,
  BackHandler,
  Dimensions,
  Alert,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {FlatList} from 'react-native-gesture-handler';
import uploadImage, {selectAnimalLabel} from '../modules/imageUpload';
import {FancyButton, FancyFonts} from '../common/common';
import {ActivityIndicator, Colors} from 'react-native-paper';
import {useSelector, shallowEqual, useDispatch} from 'react-redux';
import {initAnimal} from '../modules/animal';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function Setting({
  gender,
  onChange,
  setStartMbti,
  setStartAnimal,
  setFinishSignUp,
}) {
  const cameraRef = React.useRef(null); // useRef로 camera를 위한 ref를 하나 만들어주고
  const [result, setResult] = useState([]);
  const [imageUri, setImageUri] = useState(null);
  const [checkRun, setCheckRun] = useState(true);
  const [selectAnimal, setSelectAnimal] = useState(false);
  const [myAnimalPicture, setMyAnimalPicture] = useState(null);
  const [animalImages, setAnimalImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const _initAnimal = useCallback(() => dispatch(initAnimal()), [dispatch]);
  const user = useSelector((state) => state.login, shallowEqual);
  const animal = useSelector((state) => state.animal, shallowEqual);

  useEffect(() => {
    switch (animal.error) {
      case 400: {
        Alert.alert('이미지 파일을 넣어야 합니다.');
        break;
      }
      case 404: {
        Alert.alert('얼굴을 인식하는데 실패하였습니다. 다시 찍어주세요.');
        break;
      }
      case 409: {
        Alert.alert('사진에 얼굴이 한 명만 나오도록 찍어주세요.');
        break;
      }
    }
    _initAnimal();
  }, [animal.error]);

  useEffect(() => {
    const backAction = () => {
      setStartMbti(true);
      setStartAnimal(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const takePhoto = async () => {
    if (cameraRef) {
      setCheckRun(false);
      const data = await cameraRef.current.takePictureAsync({
        quality: 1,
        exif: true,
      });
      const {uri} = data;
      setImageUri(uri);
      console.log(await uploadImage(uri, gender, user.fcmToken));
      console.log(animal.result);
      setIsLoading(false);

      // setResult();
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Mimi',
          message: 'To use the animal service, you need to use camera.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
        console.log('camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
    console.log(user, animal);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.containerText}>[닮은 동물 프로필 사진]</Text>
      <View style={styles.bodyContainer}>
        <View style={[isLoading ? null : {display: 'none'}]}>
          <ActivityIndicator animating={isLoading} color={Colors.red800} />
        </View>
        <View style={[imageUri ? {display: 'none'} : null]}>
          <RNCamera
            ref={cameraRef}
            style={{
              width: 150,
              height: 100,
              marginTop: 60,
            }}
            captureAudio={false}
            type={RNCamera.Constants.Type.front}
          />
          <FancyButton
            style={styles.takebutton}
            icon="camera"
            title="Take"
            onPress={() => {
              takePhoto();
              setIsLoading(true);
            }}>
            촬영
          </FancyButton>
        </View>
        <View style={[!imageUri ? {display: 'none'} : null]}>
          <Image
            style={{
              width: 200,
              height: 200,
              marginTop: 60,
              borderRadius: 30,
            }}
            source={{
              uri: imageUri,
            }}
          />
          <FancyButton
            style={styles.button}
            icon="camera-retake-outline"
            title="Take"
            onPress={() => {
              setCheckRun(true);
              setImageUri(null);
            }}>
            재촬영
          </FancyButton>
        </View>
      </View>
      <View
        style={[
          isLoading
            ? {display: 'none'}
            : imageUri == null
            ? {display: 'none'}
            : myAnimalPicture
            ? {display: 'none'}
            : styles.contentContainer,
        ]}>
        <Text style={styles.titleText}>[당신과 닮은 동물 Best3]</Text>
        <FlatList
          data={!selectAnimal ? animal.result : animalImages}
          horizontal={true}
          renderItem={
            !selectAnimal
              ? ({item, index}) => (
                  <TouchableOpacity>
                    <View style={styles.textContainer}>
                      <TouchableOpacity
                        onPress={async () => {
                          const {images} = await selectAnimalLabel(
                            item.category,
                          );

                          setAnimalImages(images);
                          setSelectAnimal(true);
                        }}>
                        <Text style={styles.text}>{item.category}</Text>
                      </TouchableOpacity>
                      {/* <Text style={styles.text}>{item.predict_rate}</Text> */}
                    </View>
                  </TouchableOpacity>
                )
              : ({item, index}) => (
                  <View style={styles.textContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setMyAnimalPicture(item.base64);
                        onChange('profileImg', item.id);
                      }}>
                      <Image
                        style={styles.animal}
                        source={{uri: `data:image/jpeg;base64,${item.base64}`}}
                      />
                    </TouchableOpacity>
                  </View>
                )
          }
          keyExtractor={(_item, index) => `${index}`}
        />
      </View>
      <View
        style={[
          isLoading
            ? {display: 'none'}
            : imageUri == null
            ? {display: 'none'}
            : !myAnimalPicture
            ? {display: 'none'}
            : styles.selectContainer,
        ]}>
        <Text style={styles.titleText}>[당신의 선택은]</Text>
        <Image
          style={styles.animal}
          source={{uri: `data:image/jpeg;base64,${myAnimalPicture}`}}
        />
        <FancyButton
          mode="text"
          color="#7E6ECD"
          icon="autorenew"
          onPress={() => {
            setSelectAnimal(false);
            setMyAnimalPicture(null);
          }}>
          다른 동물 할래요
        </FancyButton>
      </View>
      <View style={styles.completeContainer}>
        <FancyButton
          style={{
            width: width * 0.8,
          }}
          mode="contained"
          color={!myAnimalPicture ? 'gray' : '#000069'}
          onPress={() => {
            setStartAnimal(false);
            setFinishSignUp(true);
            _initAnimal();
          }}>
          <Text style={styles.nextButtonText}>가입완료</Text>
        </FancyButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerText: {
    fontFamily: FancyFonts.BMDOHYEON,
    fontSize: 20,
    marginTop: 30,
    textAlign: 'center',
  },
  bodyContainer: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 4,
    alignItems: 'center',
  },
  selectContainer: {
    flex: 4,
    alignItems: 'center',
  },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontFamily: FancyFonts.BMDOHYEON,
  },
  takebutton: {
    marginTop: 80,
    borderRadius: 30,
    borderStyle: 'solid',
    borderColor: '#9282CD',
    borderWidth: 5,
    backgroundColor: '#EBF5FF',
  },
  button: {
    borderRadius: 30,
    borderStyle: 'solid',
    borderColor: '#9282CD',
    borderWidth: 5,
    marginTop: 5,
    backgroundColor: '#EBF5FF',
  },
  tinyLogo: {},
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: FancyFonts.BMDOHYEON,
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    fontFamily: FancyFonts.BMDOHYEON,
    marginLeft: 20,
    marginRight: 20,
  },

  animal: {
    width: 80,
    height: 80,
    marginRight: 15,
    marginLeft: 15,
    borderRadius: 30,
  },
  myAnimal: {
    width: 30,
    height: 30,
  },
  result: {
    fontFamily: FancyFonts.BMDOHYEON,
    fontSize: 20,
  },
});
