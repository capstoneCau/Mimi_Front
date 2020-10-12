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

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function CreateUsers({route, navigation}) {
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showcertificationModal, setShowCertificationModal] = useState(false);
  const [schoolSort, setSchoolSort] = useState();

  const [authCode, setAuthCode] = useState();
  const [inputAuthCode, setInputAuthCode] = useState();
  const [isAuth, setAuth] = useState(false);
  const dispatch = useDispatch();
  const registerUser = useCallback(
    (userInfo) => dispatch(registerUserInfoAsync(userInfo)),
    [dispatch],
  );
  const {colors} = useTheme();

  const [inputs, setInputs] = useState({
    school: '',
    email: '',
    emailHost: '',
    schoolAddress: '',
    address: 'aaaaa',
  });

  const {school, schoolAddress, emailHost, email, address, gender} = inputs;

  const onChange = (name, value) => {
    setInputs({
      ...inputs,
      [name]: value,
    });
  };
  useEffect(() => {
    const infor = async () => {
      setSchoolSort(await getInformation('school'));
    };
    infor();
  }, []);

  const schoolList = (
    <SafeAreaView style={styles.schoolModalboxContainer}>
      <FlatList
        data={schoolSort}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.schoolModalbox}
            onPress={() => {
              // console.log(schoolSort)
              setInputs((inputs) => {
                return {...inputs, ['school']: item.name};
              });
              setInputs((inputs) => {
                return {...inputs, ['schoolAddress']: item.email_info};
              });
              setShowSchoolModal(false);
            }}>
            <Text style={styles.schoolModalText}>{item.name}</Text>
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
        <Text style={styles.mbtiIntroduceText}>
          당신의 학교를 선택해 주세요!
        </Text>
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
      style={styles.container}>
      {schoolModal}
      {certificationModal}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>회원가입</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.buttonForm}>
          <Text style={styles.text}>학교</Text>
          <FancyButton
            style={styles.fancyButton}
            color="#000069"
            mode="contained"
            icon="school"
            onPress={() => {
              setShowSchoolModal(true);
            }}>
            학교선택
          </FancyButton>
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
              color="#000069"
              mode="contained"
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
        <View style={styles.completeContainer}>
          <FancyButton
            mode="contained"
            title="가입완료"
            onPress={async () => {
              if (isAuth) {
                inputs.email = emailHost + '@' + schoolAddress;
                delete inputs.schoolAddress;
                delete inputs.emailHost;
                await registerUser(inputs);
                navigation.navigate('Home');
              } else {
                failCertify();
              }
            }}>
            가입완료
          </FancyButton>
        </View>
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

  atSign: {
    marginLeft: 10,
    marginRight: 10,
  },
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
