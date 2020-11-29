import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {FlatList} from 'react-native-gesture-handler';
import uploadImage, {selectAnimalLabel} from '../modules/imageUpload';
import {FancyButton, FancyFonts} from '../common/common';
import {ProgressBar, Modal, Portal, Provider} from 'react-native-paper';

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
  const [myAnimalPicture, setMyAnimalPicture] = useState();
  const [animalImages, setAnimalImages] = useState([]);
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
      setResult(await uploadImage(uri, gender));
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
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <View style={[imageUri ? {display: 'none'} : null]}>
          <RNCamera
            ref={cameraRef}
            style={{
              width: 100,
              height: 80,
              marginTop: 60,
            }}
            captureAudio={false}
            type={RNCamera.Constants.Type.front}
          />
        </View>
        <View style={[!imageUri ? {display: 'none'} : null]}>
          <Image
            style={{
              width: 100,
              height: 80,
              marginTop: 60,
              borderRadius: 30,
            }}
            source={{
              uri: imageUri,
            }}
          />
        </View>

        <View>
          {checkRun ? (
            <FancyButton
              style={styles.button}
              icon="camera"
              title="Take"
              onPress={() => {
                takePhoto();
              }}>
              촬영
            </FancyButton>
          ) : (
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
          )}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>[당신과 닮은 동물 Best3]</Text>
        <FlatList
          data={!selectAnimal ? result : animalImages}
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
                          console.log(
                            `data:image/jpeg;base64,${images[0].base64}`,
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
                  <TouchableOpacity
                    onPress={() => {
                      setMyAnimalPicture(item.id);
                      onChange('profileImg', item.id);
                    }}>
                    <Image
                      style={styles.animal}
                      source={{uri: `data:image/jpeg;base64,${item.base64}`}}
                    />
                  </TouchableOpacity>
                )
          }
          keyExtractor={(_item, index) => `${index}`}
        />
        <Image style={styles.myAnimal} source={myAnimalPicture} />
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
  bodyContainer: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 8,
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
  button: {
    // width: 50,
    // height: 50,
    // borderRadius: 30,
    // borderStyle: 'solid',
    // borderColor: 'gray',
    // borderWidth: 10,
    marginTop: 80,
    backgroundColor: 'white',
  },
  tinyLogo: {},
  textContainer: {
    flexDirection: 'row',
  },
  titleText: {
    fontFamily: FancyFonts.BMDOHYEON,
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    fontSize: 30,
    fontFamily: FancyFonts.BMDOHYEON,
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
  },
  containerStyle: {
    width: width * 0.95,
    height: height * 0.3,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 30,
    alignSelf: 'center',
    flexDirection: 'column',
  },
  animalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  animal: {
    width: 80,
    height: 80,
    borderRadius: 30,
    marginRight: 30,
  },
  myAnimal: {
    width: 80,
    height: 80,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 50,
  },
});
