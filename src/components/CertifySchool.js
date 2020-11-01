import React, {useState, useEffect, Fragment, useCallback} from 'react';
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
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '@react-navigation/native';
import {CONST_VALUE} from '../common/common';
import {useSelector, useDispatch} from 'react-redux';
import {registerUserInfoAsync} from '../modules/login';
import {getInformation} from '../modules/getInformation';
import {getAuthCode} from '../modules/getAuthCode';
import {FancyButton, FancyFonts} from '../common/common';
import {SearchSchool} from './SchoolApi';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function CertifySchool({
  gender,
  school,
  email,
  emailHost,
  schoolAddress,
  onChange,
  setInputs,
  setStartCertify,
  startMbti,
  setStartMbti,
}) {
  const [schoolName, setSchoolName] = useState('');
  const [campusName, setCampusName] = useState('');
  const [schoolLink, setSchoolLink] = useState('');
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [authCode, setAuthCode] = useState(12345678);
  const [inputAuthCode, setInputAuthCode] = useState();
  const [isPressSubmit, setIsPressSubmit] = useState(false);
  const [isAuth, setAuth] = useState(false);
  const [schoolSort, setSchoolSort] = useState({
    schoolN: [],
    campusN: [],
    schoolL: [],
  });
  const dispatch = useDispatch();
  const registerUser = useCallback(
    (userInfo) => dispatch(registerUserInfoAsync(userInfo)),
    [dispatch],
  );
  const {colors} = useTheme();
  const onChangeList = (schoolList, campusList, linkList) => {
    setSchoolSort({
      ...schoolSort,
      ['schoolN']: schoolList,
      ['campusN']: campusList,
      ['schoolL']: linkList,
    });
  };

  useEffect(() => {
    const backAction = () => {
      setStartCertify(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const requestSchoolAPI = (schoolname) => {
    SearchSchool(schoolname)
      .then(
        (response) => {
          return response.json();
        },
        (error) => {
          alert(error.message);
          // props.setShowIndicator(false);
        },
      )
      .then((json) => {
        let tempSchoolNameList = [];
        let tempCampusNameList = [];
        let tempSchoolLinkList = [];

        const data = json['dataSearch']['content'];
        for (let i = 0; i < data[0]['totalCount']; i++) {
          tempSchoolNameList.push(data[i]['schoolName']);
          tempCampusNameList.push(data[i]['campusName']);
          if (data[i]['link'].split('//')[1].indexOf('www') != -1) {
            tempSchoolLinkList.push(
              data[i]['link'].split('w.')[1].split('/')[0],
            );
          } else {
            tempSchoolLinkList.push(data[i]['link'].split('//')[1]);
          }
        }
        onChangeList(
          tempSchoolNameList,
          tempCampusNameList,
          tempSchoolLinkList,
        );
      })
      .then(() => {
        setShowSchoolModal(true);
      })
      .catch(function (err) {
        console.log(err);
        Alert.alert('잘못된 학교명입니다, 다른 이름으로 검색해주세요.');
      });
  };

  const schoolList = (
    <SafeAreaView style={styles.schoolModalboxContainer}>
      <Text style={styles.modalTitleText}>당신의 학교는?</Text>
      <FlatList
        data={schoolSort.schoolN}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.schoolModalbox}
            onPress={() => {
              setSchoolName(item + ' ' + schoolSort.campusN[index]);
              setInputs((inputs) => {
                return {
                  ...inputs,
                  ['school']: item + schoolSort.campusN[index],
                };
              });
              setInputs((inputs) => {
                return {
                  ...inputs,
                  ['schoolAddress']: schoolSort.schoolL[index],
                };
              });
              setShowSchoolModal(false);
              setIsPressSubmit(false);
            }}>
            <Text style={styles.schoolModalText}>
              {item} {schoolSort.campusN[index]}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );

  const schoolModal = (
    <Modal animationType={'slide'} transparent={true} visible={showSchoolModal}>
      <View style={styles.schoolModalContainer}>{schoolList}</View>
    </Modal>
  );

  const certificationModal = (
    <View style={styles.certifyContainer}>
      <Text style={styles.text}>인증</Text>
      <View style={styles.certify}>
        <TextInput
          style={styles.inputCode}
          title="인증코드"
          placeholder="코드를 입력해 주세요"
          maxLength={6}
          onChangeText={(value) => {
            setInputAuthCode(value);
          }}
        />
        <FancyButton
          mode="outlined"
          color="#000069"
          icon={isAuth ? 'shield-check' : ''}
          style={{marginLeft: 20}}
          disabled={isAuth}
          onPress={() => {
            if (authCode == inputAuthCode) {
              ToastAndroid.showWithGravity(
                '인증 성공',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
              onChange('email', emailHost + '@' + schoolAddress);
              setAuth(true);
            } else {
              ToastAndroid.showWithGravity(
                '인증 번호가 틀립니다.',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
            }
          }}>
          {isAuth ? '인증성공' : '인증하기'}
        </FancyButton>
      </View>
    </View>
  );
  const failSchool = () =>
    Alert.alert(
      '죄송합니다',
      '학교선택을 먼저 해주세요.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK'},
      ],
      {cancelable: false},
    );

  const failCertify = () =>
    Alert.alert(
      '죄송합니다',
      '학교인증을 해주세요.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK'},
      ],
      {cancelable: false},
    );

  return (
    <LinearGradient
      colors={
        showSchoolModal === true
          ? [colors.modalBackground, colors.modalBackground]
          : ['#ffffff', '#ffffff']
      }
      style={[styles.container, startMbti === true ? {display: 'none'} : {}]}>
      {schoolModal}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>학교인증</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.buttonForm}>
          <Text style={styles.text}>학교</Text>
          <View style={styles.email}>
            <TextInput
              style={styles.schoolName}
              value={schoolName}
              placeholder="학교명을 입력해 주세요"
              onChangeText={(value) => setSchoolName(value)}
              autoFocus={true}
            />
            <FancyButton
              style={styles.fancyButton}
              mode="outlined"
              color="#000069"
              icon="school"
              onPress={() => {
                requestSchoolAPI(schoolName);
              }}>
              <Text style={styles.text}>학교검색</Text>
            </FancyButton>
          </View>
        </View>
        <View style={styles.buttonForm}>
          <Text style={styles.text}>학교 이메일</Text>
          <View style={styles.email}>
            <TextInput
              style={styles.inputEmail}
              value={emailHost}
              placeholder="이메일을 입력해 주세요"
              onChangeText={(v) => onChange('emailHost', v)}
            />
            <Text style={styles.atSign}>@</Text>
            <Text style={styles.addressText}>{schoolAddress}</Text>
            <FancyButton
              mode="outlined"
              color="#000069"
              onPress={
                isPressSubmit
                  ? async () => {
                      ToastAndroid.showWithGravity(
                        '인증 메일이 재 전송 되었습니다.',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER,
                      );
                      setAuthCode(
                        await getAuthCode(emailHost + '@' + schoolAddress),
                      );
                    }
                  : async () => {
                      if (schoolAddress === '') {
                        failSchool();
                      } else {
                        setIsPressSubmit(true);
                        setAuthCode(
                          await getAuthCode(emailHost + '@' + schoolAddress),
                        );
                      }
                    }
              }>
              <Text style={styles.text}>
                {isPressSubmit ? '재전송' : '코드전송'}
              </Text>
            </FancyButton>
          </View>
        </View>
        <View style={isPressSubmit == true ? styles.buttonForm : {opacity: 0}}>
          {certificationModal}
        </View>
      </View>

      <View style={styles.completeContainer}>
        <FancyButton
          style={{
            width: width * 0.8,
          }}
          mode="contained"
          color={isAuth ? '#000069' : 'gray'}
          onPress={async () => {
            if (!isAuth) {
              email = emailHost + '@' + schoolAddress;
              setStartMbti(true);
              //delete schoolAddress;
              //delete emailHost;
              //await registerUser(inputs);
            } else {
              failCertify();
            }
          }}>
          <Text style={styles.nextButtonText}>다음</Text>
        </FancyButton>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  titleContainer: {
    flex: 2,
    marginTop: 50,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  text: {
    fontFamily: FancyFonts.BMDOHYEON,
  },
  formContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: height * 0.25,
  },

  form: {
    marginBottom: 10,
  },
  buttonForm: {
    flex: 1,
    marginLeft: width * 0.1,
    marginBottom: 10,
  },
  fancyButton: {
    marginTop: 5,
    marginLeft: 30,
  },
  schoolName: {
    marginTop: 5,
    paddingLeft: 10,
    width: width * 0.4,
    borderColor: 'gray',
    borderBottomWidth: 2,
  },
  email: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputEmail: {
    marginTop: 5,
    width: width * 0.4,
    borderColor: 'gray',
    borderBottomWidth: 2,
  },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 40,
  },

  schoolModalContainer: {
    width: width * 0.8,
    height: height * 0.5,
    marginTop: height * 0.2,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  schoolModalboxContainer: {},

  modalboxContainer: {},
  schoolModalbox: {
    margin: 3,
    borderBottomWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
  },
  schoolModalText: {
    height: 30,
    fontSize: 20,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  nextButtonText: {
    color: '#ffffff',
    fontFamily: FancyFonts.BMDOHYEON,
  },
  certifyContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: height * 0.06,
  },
  certify: {
    flexDirection: 'row',
  },
  inputCode: {
    width: width * 0.4,
    borderColor: 'gray',
    borderBottomWidth: 2,
    marginRight: 10,
  },
  additionalCertifyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
  },
  atSign: {},
  addressText: {
    marginRight: 15,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  modalTitleText: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  modalbox: {
    flex: 1,
    margin: 1,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    height: 120,
    fontSize: 20,
    fontFamily: FancyFonts.BMDOHYEON,
    textAlign: 'center',
  },
});
