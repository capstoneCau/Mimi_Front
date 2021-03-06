import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  BackHandler,
} from 'react-native';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '@react-navigation/native';
import {CONST_VALUE} from '../common/common';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {registerUserInfoAsync} from '../modules/login';
import {getAuthCode} from '../modules/getAuthCode';
import {FancyButton, FancyFonts} from '../common/common';
import CertifySchool from './CertifySchool';
import MbtiCheck from './MbtiCheck';
import SimilarAnimal from './SimilarAnimal';

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
  const [startSignUp, setStartSignUp] = useState(true);
  const [startCertify, setStartCertify] = useState(false);
  const [startMbti, setStartMbti] = useState(false);
  const [startAnimal, setStartAnimal] = useState(false);
  const [finishSignUp, setFinishSignUp] = useState(false);
  const user = useSelector((state) => state.login, shallowEqual);

  const [inputs, setInputs] = useState({
    name: '',
    school: '',
    email: '',
    // birthday: '08-23',
    birthday: route.params.birthday == null ? '0924' : route.params.birthday,
    // address: '',
    mbti: '',
    // gender: 'male',
    gender: route.params.gender == null ? 'male' : route.params.gender,
    kakao_auth_id: kakao_auth_id,
    birthYear: '',
    emailHost: '',
    schoolAddress: '',
    fcmToken: user.fcmToken,
    profileImg: '',
  });

  const {
    name,
    school,
    schoolAddress,
    emailHost,
    email,
    // address,
    mbti,
    gender,
    birthday,
    birthYear,
    profileImg,
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
      setStartSignUp={setStartSignUp}
      setStartCertify={setStartCertify}
      startMbti={startMbti}
      setStartMbti={setStartMbti}
    />
  ) : null;
  const mbtiCheck = startMbti ? (
    <MbtiCheck
      mbti={mbti}
      gender={gender}
      onChange={onChange}
      setStartMbti={setStartMbti}
      setStartCertify={setStartCertify}
      setStartAnimal={setStartAnimal}
    />
  ) : null;
  const animalCheck = startAnimal ? (
    <SimilarAnimal
      gender={gender}
      onChange={onChange}
      setStartMbti={setStartMbti}
      setStartAnimal={setStartAnimal}
      setFinishSignUp={setFinishSignUp}
    />
  ) : null;

  useEffect(() => {
    if (finishSignUp === true) {
      inputs.email = emailHost + '@' + schoolAddress;
      delete inputs.emailHost;
      delete inputs.schoolAddress;
      delete inputs.birthYear;

      registerUser(inputs).then(() => {
        navigation.navigate('Home');
      });
    }
  }, [finishSignUp]);
  return (
    <LinearGradient
      colors={
        gender === true
          ? [colors.manBackground[0], colors.manBackground[1]]
          : ['#ffffff', '#ffffff']
      }
      style={styles.container}>
      <View style={[{flex: 1}, startSignUp ? {} : {display: 'none'}]}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>회원가입</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <TextInputComp
              autoFocus={true}
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
              name="birthYear"
              value={birthYear}
              maxLength={4}
              placeholder="태어난 년도를 입력해 주세요(ex: 1996)"
            />
          </View>
        </View>

        <View style={styles.completeContainer}>
          <FancyButton
            style={{
              width: width * 0.8,
            }}
            mode="contained"
            color={name && birthYear ? '#000069' : 'gray'}
            onPress={() => {
              onChange(
                'birthday',
                birthYear +
                  '-' +
                  birthday.substring(0, 2) +
                  '-' +
                  birthday.substring(2, 4),
              );
              setStartSignUp(false);
              setStartCertify(true);
            }}>
            <Text style={styles.nextButtonText}>다음</Text>
          </FancyButton>
        </View>
      </View>
      {certifySchool}
      {mbtiCheck}
      {animalCheck}
    </LinearGradient>
  );
}

function TextInputComp({
  title,
  name,
  value,
  placeholder,
  maxLength,
  onChange,
  autoFocus,
}) {
  return (
    <View style={styles.textInputContainer}>
      <Text style={styles.text}>{title}</Text>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChangeText={(v) => onChange(name, v)}
        autoFocus={autoFocus}
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
    marginTop: 50,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 30,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  formContainer: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.25,
  },
  text: {
    fontFamily: FancyFonts.BMDOHYEON,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    marginTop: 5,
    paddingLeft: 10,
    width: width * 0.8,
    borderColor: 'gray',
    borderBottomWidth: 2,
  },
  fancyButton: {
    marginTop: 5,
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
});
