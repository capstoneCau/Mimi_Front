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
import {Avatar, Card, IconButton, RadioButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import {registerUserInfoAsync} from '../modules/login';
import {getInformation} from '../modules/getInformation';
import {getAuthCode} from '../modules/getAuthCode';
import {FancyButton} from '../common/common';
var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function CreateUsers({navigation}) {
  const [showMbtiModal, setShowMbtiModal] = useState(false);
  const [showStarModal, setShowStarModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showcertificationModal, setShowCertificationModal] = useState(false);
  const [schoolSort, setSchoolSort] = useState();
  const [mbtiSort, setMbtiSort] = useState();
  const [starSort, setStarSort] = useState();
  const [authCode, setAuthCode] = useState();
  const [inputAuthCode, setInputAuthCode] = useState();
  const [isAuth, setAuth] = useState(false);
  const dispatch = useDispatch();
  const registerUser = useCallback(
    (userInfo) => dispatch(registerUserInfoAsync(userInfo)),
    [dispatch],
  );
  const {kakaoId: kakao_auth_id} = useSelector((state) => state.login);
  const [inputs, setInputs] = useState({
    name: '',
    school: '',
    email: '',
    emailHost: '',
    schoolAddress: '',
    address: 'aaaaa',
    mbti: '',
    star: '',
    gender: true,
    // age: '',
    kakao_auth_id: kakao_auth_id,
    birthday: '1996-09-24',
    profileImg: 1,
    kakao_id: 'asdf',
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
    // age,
  } = inputs;

  useEffect(() => {
    const infor = async () => {
      await setSchoolSort(await getInformation('school'));
      await setMbtiSort(await getInformation('mbti'));
      await setStarSort(await getInformation('star'));
    };

    infor();
  }, []);

  const onChange = (name, value) => {
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const List = (kinds) => {
    const sort = kinds === 'mbti' ? mbtiSort : starSort;
    // console.log(sort)
    const sortColor = [
      '#497649',
      '#1EAAAA',
      '#FF6E6E',
      '#AAFA82',
      '#C65FF9',
      '#FF0000',
      '#FFB432',
      '#800080',
      '#0064CD',
      '#0A6E0A',
      '#FFFF96',
      '#CEBEE1',
      '#A0FA78',
      '#FF8E99',
      '#3C5A91',
      '#D2691E',
    ];
    return (
      <SafeAreaView style={styles.modalboxContainer}>
        <FlatList
          data={sort}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={[styles.modalbox, {backgroundColor: sortColor[index]}]}
              onPress={() => {
                if (kinds === 'mbti') {
                  onChange('mbti', item.name);
                  setShowMbtiModal(false);
                } else {
                  onChange('star', item.name);
                  setShowStarModal(false);
                }
              }}>
              <Text style={styles.modalText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          numColumns={4}
          keyExtractor={(item, index) => index}
        />
      </SafeAreaView>
    );
  };

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

  const mbtiModal = (
    <Modal animationType={'slide'} transparent={false} visible={showMbtiModal}>
      <View style={styles.mbtiContainer}>
        <Text style={styles.mbtiIntroduceText}>
          당신의 MBTI를 선택해 주세요!
        </Text>
        {List('mbti')}
      </View>
    </Modal>
  );

  const starModal = (
    <Modal animationType={'slide'} transparent={false} visible={showStarModal}>
      <View style={styles.mbtiContainer}>
        <Text style={styles.mbtiIntroduceText}>
          당신의 별자리를 선택해 주세요!
        </Text>
        {List('star')}
      </View>
    </Modal>
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
              //color="#64CD3C"
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
            title="취소"
            color="red"
            onPress={() => {
              setShowCertificationModal(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {mbtiModal}
      {starModal}
      {schoolModal}
      {certificationModal}
      <View style={styles.essentialContainer}>
        <Text style={styles.subTitleText}>필수 입력</Text>
        <View style={styles.inputContainer}>
          <TextInputComp
            style={styles.name}
            onChange={onChange}
            title="이름"
            name="name"
            value={name}
            placeholder="이름을 입력해 주세요"
          />
          {/* <View style={styles.genderContainer}>
            <Text style={styles.text}>성별</Text>
            <RadioButton.Group
              onValueChange={(value) => {
                onChange('gender', value === 'true');
              }}
              value={gender.toString()}>
              <RadioButton.Item label="Man" value="false" />
              <RadioButton.Item label="Girl" value="true" />
            </RadioButton.Group>
          </View> */}
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.text}>학교</Text>
          <FancyButton
            color="#000069"
            mode="contained"
            onPress={() => {
              setShowSchoolModal(true);
            }}>
            학교선택
          </FancyButton>
        </View>
        <View style={styles.emailContainer}>
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
      <View style={styles.selectContainer}>
        <Text style={[styles.subTitleText, styles.line]}>선택 입력</Text>
        <View style={styles.buttonContainer}>
          <FancyButton
            mode="contained"
            color="#000069"
            onPress={() => {
              setShowMbtiModal(true);
            }}>
            MBTI
          </FancyButton>
          <Text>{mbti}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <FancyButton
            color="#000069"
            mode="contained"
            onPress={() => {
              setShowStarModal(true);
            }}>
            별자리
          </FancyButton>
          <Text>{star}</Text>
        </View>
      </View>
      <View style={styles.completeButton}>
        <FancyButton
          mode="contained"
          title="가입완료"
          onPress={async () => {
            if (isAuth) {
              inputs.email = emailHost + '@' + schoolAddress;
              delete inputs.schoolAddress;
              delete inputs.emailHost;
              // await registerUser(inputs);
              navigation.navigate('Home');
            } else {
              Alert.alert(
                '죄송합니다',
                '학교인증을 먼저 해주세요.',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {text: 'OK'},
                ],
                {cancelable: false},
              );
            }
          }}>
          가입완료
        </FancyButton>
      </View>
    </View>
  );
}

function TextInputComp({title, name, value, placeholder, onChange}) {
  return (
    <View style={styles.textInputContainer}>
      <Text style={styles.text}>{title}</Text>
      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        onChangeText={(v) => onChange(name, v)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 25,
    marginRight: 25,
  },
  subTitleText: {
    fontSize: 30,
    marginTop: 30,
    marginBottom: 20,
  },
  essentialContainer: {
    flex: 4,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  genderContainer: {
    height: 10,
    marginRight: 50,
  },
  textInputContainer: {
    flex: 1,
  },
  text: {
    marginBottom: 10,
  },
  input: {
    flex: 0.8,
    width: width * 0.4,
    borderColor: 'gray',
    borderWidth: 1,
  },
  buttonContainer: {
    width: 100,
    marginBottom: 20,
  },
  emailContainer: {
    flex: 1,
  },
  inputEmail: {
    width: width * 0.4,
    borderColor: 'gray',
    borderWidth: 1,
  },
  email: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  atSign: {
    marginLeft: 10,
    marginRight: 10,
  },
  addressText: {
    marginRight: 15,
  },
  selectContainer: {
    flex: 3,
  },
  line: {
    borderTopColor: 'gray',
    borderTopWidth: 1,
  },

  completeButton: {
    alignItems: 'flex-end',
    marginBottom: 20,
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
