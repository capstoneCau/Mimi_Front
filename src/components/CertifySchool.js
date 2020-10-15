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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '@react-navigation/native';
import {CONST_VALUE} from '../common/common';
import {useSelector, useDispatch} from 'react-redux';
import {registerUserInfoAsync} from '../modules/login';
import {getInformation} from '../modules/getInformation';
import {getAuthCode} from '../modules/getAuthCode';
import {FancyButton} from '../common/common';
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
  startMbti,
  setStartMbti,
}) {
  const [schoolName, setSchoolName] = useState('');
  const [campusName, setCampusName] = useState('');
  const [schoolLink, setSchoolLink] = useState('');
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showcertificationModal, setShowCertificationModal] = useState(false);
  const [authCode, setAuthCode] = useState();
  const [inputAuthCode, setInputAuthCode] = useState();
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
        console.log(data);

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
        console.log('1' + JSON.stringify(schoolSort));
      })
      .then(() => {
        console.log('2' + JSON.stringify(schoolSort));
        setShowSchoolModal(true);
      })
      .catch(function (err) {
        console.log(err);
        Alert.alert('잘못된 학교명입니다, 다른 이름으로 검색해주세요.');
      });
  };

  const schoolList = (
    <SafeAreaView style={styles.schoolModalboxContainer}>
      <FlatList
        data={schoolSort.schoolN}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.schoolModalbox}
            onPress={() => {
              // console.log(schoolSort)
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
    <Modal
      animationType={'slide'}
      transparent={false}
      visible={showSchoolModal}>
      <View style={styles.mbtiContainer}>
        <Text style={styles.mbtiIntroduceText}>당신의 학교는?</Text>
        {schoolList}
      </View>
    </Modal>
  );

  const certificationModal = (
    <Modal
      animationType={'slide'}
      transparent={false}
      visible={showcertificationModal}>
      <View style={styles.mbtiContainer}>
        <Text style={styles.mbtiIntroduceText}>
          해당 메일에 전송된 코드를 입력해 주세요!
        </Text>
        <View style={styles.certifyContainer}>
          <TextInput
            style={styles.inputCode}
            title="인증코드"
            placeholder="전송된 코드를 입력해 주세요"
            onChangeText={(value) => {
              setInputAuthCode(value);
            }}
          />
          <FancyButton
            mode="contained"
            color="#000069"
            onPress={() => {
              if (authCode == inputAuthCode) {
                ToastAndroid.showWithGravity(
                  '인증 성공',
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
                onChange('email', emailHost + '@' + schoolAddress);
                setShowCertificationModal(false);
                setAuth(true);
              } else {
                ToastAndroid.showWithGravity(
                  '인증 번호가 틀립니다.',
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
              }
            }}>
            인증하기
          </FancyButton>
        </View>
        <View style={styles.additionalCertifyContainer}>
          <View style={{marginRight: 10}}>
            <FancyButton
              mode="contained"
              color="#64CD3C"
              onPress={async () => {
                ToastAndroid.showWithGravity(
                  '인증 메일이 재 전송 되었습니다.',
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
                setAuthCode(await getAuthCode(emailHost + '@' + schoolAddress));
              }}>
              재전송하기
            </FancyButton>
          </View>
          <FancyButton
            mode="contained"
            color="red"
            onPress={() => {
              setShowCertificationModal(false);
            }}>
            취소
          </FancyButton>
        </View>
      </View>
    </Modal>
  );

  const failCertify = () =>
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

  return (
    <LinearGradient
      colors={
        gender === true
          ? [colors.manBackground[0], colors.manBackground[1]]
          : [colors.womanBackground[0], colors.womanBackground[1]]
      }
      style={[styles.container, startMbti === true ? {display: 'none'} : {}]}>
      {schoolModal}
      {certificationModal}
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
            />
            <FancyButton
              style={styles.fancyButton}
              mode="outlined"
              color="#000069"
              icon="school"
              onPress={() => {
                requestSchoolAPI(schoolName);
              }}>
              학교검색
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
              onPress={async () => {
                if (schoolAddress === '') {
                  failCertify();
                } else {
                  setAuthCode(
                    await getAuthCode(emailHost + '@' + schoolAddress),
                  );
                  setShowCertificationModal(true);
                }
              }}
              disabled={isAuth}>
              {isAuth ? '인증성공' : '인증하기'}
            </FancyButton>
          </View>
        </View>
      </View>

      <View style={styles.completeContainer}>
        <FancyButton
          icon="arrow-right-bold"
          mode="outlined"
          color="#000069"
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
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 30,
  },
  formContainer: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  form: {
    marginBottom: 10,
  },
  buttonForm: {
    marginLeft: width * 0.12,
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
    alignItems: 'flex-end',
    marginBottom: 20,
    marginRight: 20,
  },

  atSign: {},
  addressText: {
    marginRight: 15,
  },

  mbtiContainer: {
    flex: 1,
  },
  mbtiIntroduceText: {
    fontSize: 28,
    padding: 20,
    textAlign: 'center',
  },
  modalboxContainer: {},
  schoolModalbox: {
    flex: 1,
    margin: 3,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  schoolModalText: {
    height: 50,
    fontSize: 20,
  },
  nextButtonText: {
    color: '#000000',
  },
  certifyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: height * 0.06,
  },
  inputCode: {
    flex: 0.8,
    width: width * 0.4,
    borderColor: 'gray',
    borderWidth: 1,
  },
  additionalCertifyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
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
    textAlign: 'center',
  },
});
