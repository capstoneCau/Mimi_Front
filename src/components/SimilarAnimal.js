import React, {useEffect, useState} from 'react';
import {
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
import uploadImage from '../modules/imageUpload';
import {FancyButton, FancyFonts} from '../common/common';
import {ProgressBar, Colors} from 'react-native-paper';

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
  const [category, setCategory] = useState([]);
  const [predict, setPredict] = useState([]);
  const [result, setResult] = useState([]);
  const [imageUri, setImageUri] = useState();
  const [checkRun, setCheckRun] = useState(true);

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
      setCategory([]);
      setPredict([]);
      const data = await cameraRef.current.takePictureAsync({
        quality: 1,
        exif: true,
      });
      const {uri} = data;
      setImageUri(uri);
      setResult(await uploadImage(uri, gender));
    }
  };
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Mimi',
          message: 'To use the animal service, you need to use camera.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // alert("You can use the location");
      } else {
        console.log('camera permission denied');
        // alert("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    requestLocationPermission();
  });
  return (
    <View style={styles.container}>
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

      <View>
        {checkRun ? (
          <FancyButton
            style={styles.button}
            icon="camera"
            title="Take"
            onPress={() => takePhoto()}>
            촬영
          </FancyButton>
        ) : (
          <FancyButton
            style={styles.button}
            icon="camera-retake-outline"
            title="Take"
            onPress={() => {
              setCheckRun(true);
            }}>
            재촬영
          </FancyButton>
        )}
      </View>
      <Text style={styles.titleText}>[당신과 닮은 동물 Best3]</Text>
      <FlatList
        data={result}
        renderItem={({item, index}) => (
          <TouchableOpacity>
            <View style={styles.textContainer}>
              <Text style={styles.text}>{item.category}</Text>
              <Text style={styles.text}>{item.predict_rate}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(_item, index) => `${index}`}
      />
      <View style={styles.completeContainer}>
        <FancyButton
          style={{
            width: width * 0.8,
          }}
          mode="contained"
          color={checkRun ? 'gray' : '#000069'}
          onPress={() => {
            setStartAnimal(false);
            setFinishSignUp(true);
          }}>
          <Text style={styles.nextButtonText}>다음</Text>
        </FancyButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 40,
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
    fontFamily: FancyFonts.BMDOHYEON,
    margin: 20,
  },
});
