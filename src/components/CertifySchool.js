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

import {useTheme} from '@react-navigation/native';
import {CONST_VALUE} from '../common/common';
import {useSelector, useDispatch} from 'react-redux';
import {registerUserInfoAsync} from '../modules/login';
import {getAuthCode} from '../modules/getAuthCode';
import {FancyButton, FancyFonts} from '../common/common';
import {SearchSchool} from './SchoolApi';
import TextInputComp from '../common/TextInputComp';
import {BlankContainer, commonStyles} from '../common/style';

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
  setStartSignUp,
  setStartCertify,
  startMbti,
  setStartMbti,
}) {
  const [schoolName, setSchoolName] = useState('');
  const [campusName, setCampusName] = useState('');
  const [schoolLink, setSchoolLink] = useState('');
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [authCode, setAuthCode] = useState(12);
  const [inputAuthCode, setInputAuthCode] = useState();
  const [isPressSubmit, setIsPressSubmit] = useState(false);
  const [isAuth, setAuth] = useState(false);
  const [authTime, setAuthTime] = useState();
  const [authTimeIntervalId, setAuthTimeIntervalId] = useState(null);
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
      setStartSignUp(true);
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
      <View style={{flex: 2}}>
        <Text style={styles.modalTitleText}>학교를 선택해 주세요</Text>
      </View>
      <View style={{flex: 8}}>
        <FlatList
          data={schoolSort.schoolN}
          renderItem={({item, index}) => (
            <View>
              <TouchableOpacity
                style={styles.schoolModalbox}
                onPress={() => {
                  setSchoolName(item);
                  setInputs((inputs) => {
                    return {
                      ...inputs,
                      ['school']: item,
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
                <Text style={styles.schoolModalText}>{item}</Text>
              </TouchableOpacity>
              <View style={{marginBottom: 20}}></View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <TouchableOpacity
        style={styles.closeButtonContainer}
        onPress={() => {
          setShowSchoolModal(false);
          setIsPressSubmit(false);
        }}>
        <Text style={styles.closeButton}>닫기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  const schoolModal = (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={showSchoolModal}
      onRequestClose={() => {
        setShowSchoolModal(false);
      }}>
      <View style={styles.schoolModalContainer}>{schoolList}</View>
    </Modal>
  );

  const skipModal = (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={showSkipModal}
      onRequestClose={() => {
        setShowSkipModal(false);
      }}>
      <View style={styles.skipModalContainer}>
        <View style={styles.skipModalTitle}>
          <Text style={styles.modalTitleText}>학교 인증을 건너뛰겠습니까?</Text>
        </View>
        <View style={styles.skipModalContent}>
          <Text style={{textAlign: 'justify', fontWeight: 'bold'}}>
            {`
            학교 인증을 생략시, (미인증)으로
            등록되며 이후 인증을 원하실시
            ‘설정’에서 하실 수 있습니다.
            학교 이메일이 아닌 다른 방법
            (포탈로그인 캡쳐/학생증 사진/
            재학인증서 등) 으로 등록을 원하실시
            ‘설정’에서 저희 회사로 email을 
            보내주시면 신속히 처리해 드리겠습니다.
            `}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.skipModalButton}
          onPress={() => {
            setStartCertify(false);
            setStartMbti(true);
          }}>
          <Text style={styles.skipText}>건너뛰기</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const certificationModal = (
    <View style={styles.certifyContainer}>
      <TextInputComp
        style={styles.inputCode}
        title="인증코드"
        placeholder="인증번호를 입력하세요"
        maxLength={6}
        onChangeOne={setInputAuthCode}
        width={width * 0.9}
        height={50}
      />
      <FancyButton
        style={[
          commonStyles.nextButton,
          {width: width * 0.9, height: 50, marginTop: 10},
        ]}
        mode="contained"
        color={inputAuthCode ? '#FFA7A7' : 'gray'}
        disabled={isAuth}
        onPress={() => {
          if (authCode == inputAuthCode) {
            ToastAndroid.showWithGravity(
              '인증에 성공하였습니다.',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            clearInterval(authTimeIntervalId);
            onChange('email', emailHost + '@' + schoolAddress);
            setAuth(true);
            email = emailHost + '@' + schoolAddress;
            setStartCertify(false);
            setStartMbti(true);
          } else {
            ToastAndroid.showWithGravity(
              '인증 번호가 틀립니다.',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          }
        }}>
        <Text style={commonStyles.nextButtonText}>
          {'인증하기'} ({parseInt(authTime / 60)}:
          {isPressSubmit
            ? (authTime - parseInt(authTime / 60) * 60).toString().length == 1
              ? '0' + (authTime - parseInt(authTime / 60) * 60).toString()
              : (authTime - parseInt(authTime / 60) * 60).toString()
            : null}
          )
        </Text>
      </FancyButton>
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
    <View
      style={[styles.container, startMbti === true ? {display: 'none'} : {}]}>
      {schoolModal}
      {skipModal}
      <View style={styles.skipContainer}>
        <TouchableOpacity
          onPress={() => {
            setShowSkipModal(true);
          }}>
          <Text style={styles.skipText}>건너뛰기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>학교 인증</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.buttonForm}>
          <View style={styles.school}>
            <TextInputComp
              value={schoolName}
              placeholder={school ? school : '학교 이름을 입력해 주세요'}
              onChangeOne={setSchoolName}
              autoFocus={true}
              width={width * 0.6}
              height={50}
            />
            <FancyButton
              style={[
                commonStyles.nextButton,
                {width: width * 0.25, height: 50, marginLeft: 20},
              ]}
              mode="contained"
              color={schoolName ? '#FFA7A7' : 'gray'}
              onPress={() => {
                requestSchoolAPI(schoolName);
              }}>
              <Text style={commonStyles.nextButtonText}>학교 검색</Text>
            </FancyButton>
          </View>
        </View>
        <View style={[schoolAddress ? styles.buttonForm : {display: 'none'}]}>
          <View style={styles.email}>
            <TextInputComp
              value={emailHost}
              placeholder="학교 e-mail"
              onChange={onChange}
              name="emailHost"
              width={width * 0.45}
              height={50}
            />
            <Text style={styles.atSign}>@</Text>
            <Text style={styles.addressText}>{schoolAddress}</Text>
          </View>
          <FancyButton
            style={[
              commonStyles.nextButton,
              {width: width * 0.9, height: 50, marginTop: 10},
            ]}
            mode="contained"
            color={emailHost ? '#FFA7A7' : 'gray'}
            onPress={
              isPressSubmit
                ? async () => {
                    ToastAndroid.showWithGravity(
                      '인증 메일이 재 전송 되었습니다.',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER,
                    );

                    if (authTimeIntervalId != null) {
                      clearInterval(authTimeIntervalId);
                    }
                    let _authTime = 180;
                    setAuthTime(_authTime);
                    const intervalId = setInterval(() => {
                      _authTime--;
                      setAuthTime(_authTime);
                      if (_authTime < 0) {
                        setAuthTime(0);
                        clearInterval(intervalId);
                        ToastAndroid.showWithGravity(
                          '인증 코드가 만료되었습니다. 재전송버튼을 눌러주세요.',
                          ToastAndroid.SHORT,
                          ToastAndroid.CENTER,
                        );
                        setAuthCode(null);
                        setAuthTimeIntervalId(null);
                      }
                    }, 1000);
                    setAuthTimeIntervalId(intervalId);
                    setAuthCode(
                      await getAuthCode(emailHost + '@' + schoolAddress),
                    );
                  }
                : async () => {
                    if (schoolAddress === '') {
                      failSchool();
                    } else {
                      setIsPressSubmit(true);

                      if (authTimeIntervalId != null) {
                        clearInterval(authTimeIntervalId);
                      }
                      let _authTime = 180;
                      setAuthTime(_authTime);
                      const intervalId = setInterval(() => {
                        _authTime--;
                        setAuthTime(_authTime);
                        if (_authTime < 0) {
                          setAuthTime(0);
                          clearInterval(intervalId);
                          ToastAndroid.showWithGravity(
                            '인증 코드가 만료되었습니다. 재전송버튼을 눌러주세요.',
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER,
                          );
                          setAuthCode(null);
                          setAuthTimeIntervalId(null);
                        }
                      }, 1000);
                      setAuthTimeIntervalId(intervalId);
                      setAuthCode(
                        await getAuthCode(emailHost + '@' + schoolAddress),
                      );
                    }
                  }
            }>
            <Text style={commonStyles.nextButtonText}>
              {isPressSubmit ? '재전송' : '코드 전송'}
            </Text>
          </FancyButton>
        </View>
        <View style={isPressSubmit == true ? styles.buttonForm : {opacity: 0}}>
          {certificationModal}
        </View>
      </View>
      {/* 
      <View style={styles.completeContainer}>
        <FancyButton
          style={commonStyles.nextButton}
          mode="contained"
          color={isAuth ? '#FFA7A7' : 'gray'}
          onPress={async () => {
            if (isAuth) {
              email = emailHost + '@' + schoolAddress;
              setStartCertify(false);
              setStartMbti(true);
              //delete schoolAddress;
              //delete emailHost;
              //await registerUser(inputs);
            } else {
              failCertify();
            }
          }}>
          <Text style={commonStyles.nextButtonText}>다음</Text>
        </FancyButton>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  skipContainer: {
    flex: 0.7,
    alignItems: 'flex-end',
  },
  skipText: {
    fontSize: 16,
    color: '#5DB075',
    paddingTop: 10,
    paddingRight: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
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
    flex: 10,
    alignItems: 'center',
  },

  form: {
    marginBottom: 10,
  },
  buttonForm: {
    marginBottom: 10,
  },
  school: {
    flexDirection: 'row',
  },
  email: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
  },

  skipModalContainer: {
    display: 'flex',
    width: width * 0.8,
    height: height * 0.5,
    marginTop: height * 0.25,
    alignSelf: 'center',
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#ffffff',
  },
  skipModalTitle: {
    flex: 2,
  },
  skipModalContent: {
    flex: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipModalButton: {
    flex: 1,
    alignItems: 'flex-end',
    marginBottom: 20,
    marginRight: 10,
  },

  schoolModalboxContainer: {
    display: 'flex',
    flex: 1,
  },

  schoolModalContainer: {
    width: width * 0.8,
    height: height * 0.7,
    marginTop: height * 0.15,
    alignSelf: 'center',
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#ffffff',
  },

  schoolModalbox: {
    alignItems: 'flex-start',
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 0.8,
  },
  schoolModalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  certifyContainer: {
    flexDirection: 'column',
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
  atSign: {
    marginLeft: 20,
  },
  addressText: {
    marginRight: 15,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  modalTitleText: {
    fontSize: 20,
    textAlign: 'center',
    padding: 30,
    marginBottom: 20,
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
    fontSize: 20,
    fontFamily: FancyFonts.BMDOHYEON,
    textAlign: 'center',
  },
  closeButtonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  closeButton: {
    fontSize: 16,
    color: '#4B9460',
  },
});
