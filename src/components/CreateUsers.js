import React, {useState, useEffect, Fragment} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Avatar, Card, IconButton} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function CreateUsers({navigation, kakao_auth_id}) {
  const [showMbtiModal, setShowMbtiModal] = useState(false);
  const [showStarModal, setShowStarModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [showcertificationModal, setShowCertificationModal] = useState(false);
  const [inputs, setInputs] = useState({
    username: '',
    school: '',
    email: '',
    schoolAddress: '',
    adress: '',
    mbti: '',
    star: '',
    gender: '',
    age: '',
    kakao_auth_id: kakao_auth_id,
  });
  const mbtiSort = [
    'ISTJ',
    'ISFJ',
    'INFJ',
    'INTJ',
    'ISTP',
    'ISFP',
    'INFP',
    'INTP',
    'ESTP',
    'ESFP',
    'ENFP',
    'ENTP',
    'ESTJ',
    'ESFJ',
    'ENFJ',
    'ENTJ',
  ];

  const starSort = [
    '물병자리',
    '물고기자리',
    '양자리',
    '황소자리',
    '쌍둥이자리',
    '게자리',
    '사자자리',
    '처녀자리',
    '천칭자리',
    '전갈자리',
    '사수자리',
    '염소자리',
  ];

  const schoolSort = [
    '중앙대학교',
    '숭실대학교',
    '연세대학교',
    '고려대학교',
    '한양대학교',
    '서강대학교',
    '성균관대학교',
    '서울대학교',
  ];
  const schoolEmailSort = [
    'cau.ac.kr',
    'soongsil.ac.kr',
    'yonsei.ac.kr',
    'korea.ac.kr',
    'hanyang.ac.kr',
    'sogang.ac.kr',
    'skku.ac.kr',
    'snu.ac.kr',
  ];

  const {
    username,
    school,
    schoolAddress,
    email,
    adress,
    mbti,
    gender,
    age,
  } = inputs;
  const onChange = (name, value) => {
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const List = (kinds) => {
    const sort = kinds === 'mbti' ? mbtiSort : starSort;
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
                  onChange('mbti', item);
                  setShowMbtiModal(false);
                } else {
                  onChange('star', item);
                  setShowStarModal(false);
                }
              }}>
              <Text style={styles.modalText}>{item}</Text>
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
              onChange('school', item);
              onChange('schoolAddress', schoolEmailSort[index]);
              setShowSchoolModal(false);
            }}>
            <Text style={styles.schoolModalText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index}
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
          />
          <Button
            title="인증하기"
            onPress={() => {
              setShowCertificationModal(false);
            }}
          />
        </View>
        <View style={styles.additionalCertifyContainer}>
          <View style={{marginRight: 10}}>
            <Button title="재전송하기" color="#64CD3C" onPress={() => {}} />
          </View>
          <Button
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
            name="username"
            value={username}
            placeholder="이름을 입력해 주세요"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Text style={styles.text}>학교</Text>
          <Button
            color="#000069"
            title="학교선택"
            onPress={() => {
              setShowSchoolModal(true);
            }}
          />
        </View>
        <View style={styles.emailContainer}>
          <Text style={styles.text}>학교 이메일</Text>
          <View style={styles.email}>
            <TextInput
              style={styles.inputEmail}
              value={email}
              placeholder="이메일을 입력해 주세요"
              onChangeText={(v) => onChange('email', v)}
            />
            <Text style={styles.atSign}>@</Text>
            <Text style={styles.addressText}>{schoolAddress}</Text>
            <Button
              color="#64CD3C"
              title="인증하기"
              onPress={() => {
                console.log(schoolAddress + '1');
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
                  setShowCertificationModal(true);
                }
              }}
            />
          </View>
        </View>
      </View>
      <View style={styles.selectContainer}>
        <Text style={[styles.subTitleText, styles.line]}>선택 입력</Text>
        <View style={styles.buttonContainer}>
          <Button
            color="#000069"
            title="MBTI"
            onPress={() => {
              setShowMbtiModal(true);
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color="#000069"
            title="별자리"
            onPress={() => {
              setShowStarModal(true);
            }}
          />
        </View>
      </View>
      <View style={styles.completeButton}>
        <Button
          color="red"
          title="가입완료"
          onPress={() => {
            navigation.navigate('Home');
          }}
        />
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
