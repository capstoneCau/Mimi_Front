import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  FlatList,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  Easing,
} from 'react-native';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '@react-navigation/native';
import {CONST_VALUE} from '../common/common';
import {useSelector, useDispatch} from 'react-redux';
import {registerUserInfoAsync} from '../modules/login';
import {getInformation} from '../modules/getInformation';
import {getAuthCode} from '../modules/getAuthCode';
import {FancyButton} from '../common/common';
import CertifySchool from './CertifySchool';
import MbtiCheck from './MbtiCheck';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function CreateUsers({route, navigation}) {
  // const [showMbtiModal, setShowMbtiModal] = useState(false);
  // const [showStarModal, setShowStarModal] = useState(false);
  // const [showSchoolModal, setShowSchoolModal] = useState(false);
  // const [showcertificationModal, setShowCertificationModal] = useState(false);
  // const [schoolSort, setSchoolSort] = useState();
  // const [mbtiSort, setMbtiSort] = useState();
  // const [starSort, setStarSort] = useState();
  // const [authCode, setAuthCode] = useState();
  // const [inputAuthCode, setInputAuthCode] = useState();
  // const [isAuth, setAuth] = useState(false);
  const dispatch = useDispatch();
  const registerUser = useCallback(
    (userInfo) => dispatch(registerUserInfoAsync(userInfo)),
    [dispatch],
  );
  const {kakaoId: kakao_auth_id} = useSelector((state) => state.login);

  const {colors} = useTheme();
  const [startCertify, setStartCertify] = useState(false);
  const [startMbti, setStartMbti] = useState(false);
  const [finishSignUp, setFinishSignUp] = useState(false);

  const [inputs, setInputs] = useState({
    name: '',
    school: '',
    email: '',
    birthday: route.params.birthday,
    // address: '',
    mbti: '',
    star: '',
    gender: route.params.gender === 'MALE' ? true : false,
    kakao_auth_id: kakao_auth_id,
    age: '',
    profileImg: 1,
    emailHost: '',
    schoolAddress: '',
  });

  const {
    name,
    school,
    schoolAddress,
    emailHost,
    email,
    // address,
    mbti,
    star,
    gender,
    birthday,
    age,
  } = inputs;

  const onChange = (name, value) => {
    setInputs({
      ...inputs,
      [name]: value,
    });
  };
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
    }).start();
  };

  const certifySchool = startCertify ? (
    <CertifySchool
      gender={gender}
      school={school}
      email={email}
      emailHost={emailHost}
      schoolAddress={schoolAddress}
      onChange={onChange}
      setInputs={setInputs}
      startMbti={startMbti}
      setStartMbti={setStartMbti}
    />
  ) : null;
  const mbtiCheck = startMbti ? (
    <MbtiCheck
      mbti={mbti}
      star={star}
      gender={gender}
      onChange={onChange}
      setFinishSignUp={setFinishSignUp}
    />
  ) : null;

  useEffect(() => {
    if (finishSignUp === true) {
      console.log(inputs);
      registerUser(inputs);
      navigation.navigate('Home', {gender: gender});
    }
  }, [finishSignUp]);
  console.log(inputs);

  return (
    <LinearGradient
      colors={
        gender === true
          ? [colors.manBackground[0], colors.manBackground[1]]
          : [colors.womanBackground[0], colors.womanBackground[1]]
      }
      style={styles.container}>
      <View style={[{flex: 1}, startCertify ? {display: 'none'} : {}]}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>회원가입</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <TextInputComp
              onChange={onChange}
              title="이름"
              name="name"
              value={name}
              maxLength={5}
              placeholder="이름을 입력해 주세요"
            />
          </View>
          <View style={styles.form}>
            <TextInputComp
              onChange={onChange}
              title="태어난 년도"
              name="age"
              value={age}
              maxLength={4}
              placeholder="태어난 년도를 입력해 주세요(ex: 1996)"
            />
          </View>

          <View style={styles.completeContainer}>
            <FancyButton
              mode="contained"
              title="가입완료"
              onPress={() => {
                onChange(
                  'birthday',
                  age +
                    '-' +
                    birthday.substring(0, 2) +
                    '-' +
                    birthday.substring(2, 4),
                );
                setStartCertify(true);
              }}>
              다음
            </FancyButton>
          </View>
        </View>
      </View>
      {certifySchool}
      {mbtiCheck}
    </LinearGradient>
  );
}

function TextInputComp({title, name, value, placeholder, maxLength, onChange}) {
  return (
    <View style={styles.textInputContainer}>
      <Text style={styles.text}>{title}</Text>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChangeText={(v) => onChange(name, v)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  titleContainer: {
    flex: 1,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 30,
  },
  formContainer: {
    flex: 9,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 30,
  },

  form: {
    marginBottom: 10,
  },
  input: {
    marginTop: 5,
    width: width * 0.8,
    borderColor: '#000000',
    borderWidth: 4,
    borderRadius: 15,
  },
  buttonForm: {
    marginBottom: 10,
  },
  fancyButton: {
    marginTop: 5,
  },
  email: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputEmail: {
    marginTop: 5,
    width: width * 0.4,
    borderColor: '#000000',
    borderWidth: 4,
    borderRadius: 15,
  },
  completeContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginBottom: 20,
    marginRight: 20,
  },
});
