import AsyncStorage from '@react-native-community/async-storage';

const infoToLocal = async (key, info) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(info));
  } catch (err) {
    console.log(err);
  }
};

export default infoToLocal;
