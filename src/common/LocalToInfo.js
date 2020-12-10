import AsyncStorage from '@react-native-community/async-storage';

const localToInfo = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(e + 'asyncstorage is null');
  }
};

export default localToInfo;
