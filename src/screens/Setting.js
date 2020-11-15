// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
// } from 'react-native';

// export default function Setting() {
//   return (
//     <View>
//       <TouchableOpacity>
//         <Text>설정</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Button,
  PermissionsAndroid,
  Image,
  StyleSheet,
  Text,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {FlatList} from 'react-native-gesture-handler';
import uploadImage from '../modules/imageUpload';

export default function Setting() {
  const cameraRef = React.useRef(null); // useRef로 camera를 위한 ref를 하나 만들어주고
  const [category, setCategory] = useState([]);
  const [predict, setPredict] = useState([]);
  const [result, setResult] = useState([]);
  const [imageUri, setImageUri] = useState();
  const takePhoto = async () => {
    if (cameraRef) {
      setCategory([]);
      setPredict([]);
      const data = await cameraRef.current.takePictureAsync({
        quality: 1,
        exif: true,
      });
      const {uri} = data;
      setImageUri(uri);
      setResult(await uploadImage(uri, 'male'));
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
    <>
      <RNCamera
        ref={cameraRef}
        style={{
          width: 200,
          height: 200,
        }}
        captureAudio={false}
        type={RNCamera.Constants.Type.front}
      />
      <Image
        style={styles.tinyLogo}
        source={{
          uri: imageUri,
        }}
      />
      <View style={styles.container}>
        <Button style={styles.button} title="Take" onPress={takePhoto}></Button>
      </View>
      <FlatList
        data={result}
        renderItem={({item, index}) => (
          <TouchableOpacity>
            <View>
              <Text>{item.category}</Text>
              <Text>{item.predict_rate}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(_item, index) => `${index}`}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 10,
    backgroundColor: 'pink',
  },
  tinyLogo: {
    width: 100,
    height: 100,
  },
});
