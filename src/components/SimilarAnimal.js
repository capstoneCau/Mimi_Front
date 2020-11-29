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
import uploadImage from '../modules/imageUpload';
import {FancyButton, FancyFonts} from '../common/common';
import {ProgressBar, Modal, Portal, Provider} from 'react-native-paper';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const dummy = [{category: 'wolf'}, {category: 'dog'}, {category: 'cat'}];

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
  const [isPhoto, setIsPhoto] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectAnimal, setSelectAnimal] = useState('');
  const [myAnimalPicture, setMyAnimalPicture] = useState();
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

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

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
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <View style={[isPhoto ? {display: 'none'} : null]}>
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
        <View style={[!isPhoto ? {display: 'none'} : null]}>
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
                setIsPhoto(true);
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
                setIsPhoto(false);
                setCheckRun(true);
              }}>
              재촬영
            </FancyButton>
          )}
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>[당신과 닮은 동물 Best3]</Text>
          <FlatList
            // data={result}
            data={dummy}
            horizontal={true}
            renderItem={({item, index}) => (
              <TouchableOpacity>
                <View style={styles.textContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectAnimal(item.category);
                      showModal();
                    }}>
                    <Text style={styles.text}>{item.category}</Text>
                  </TouchableOpacity>
                  {/* <Text style={styles.text}>{item.predict_rate}</Text> */}
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(_item, index) => ``}
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
            <Text style={styles.nextButtonText}>다음</Text>
          </FancyButton>
        </View>
      </View>
      <AnimalModal
        visible={visible}
        hideModal={hideModal}
        animal={selectAnimal}
        setMyAnimalPicture={setMyAnimalPicture}
      />
    </SafeAreaView>
  );
}

const AnimalModal = ({visible, hideModal, animal, setMyAnimalPicture}) => {
  return (
    <Provider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}>
          <View style={styles.animalContainer}>
            <TouchableOpacity
              onPress={() => {
                setMyAnimalPicture(require('../image/wolf1.png'));
                hideModal();
              }}>
              <Image
                style={styles.animal}
                source={require('../image/wolf1.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMyAnimalPicture(require('../image/dog1.jpeg'));
                hideModal();
              }}>
              <Image
                style={styles.animal}
                source={require('../image/dog1.jpeg')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setMyAnimalPicture(require('../image/cat1.jpg'));
                hideModal();
              }}>
              <Image
                style={styles.animal}
                source={require('../image/cat1.jpg')}
              />
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bodyContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 6,
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'flex-end',
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
    marginRight: 40,
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
  },
});
