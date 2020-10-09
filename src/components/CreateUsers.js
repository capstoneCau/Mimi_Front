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
  const [inputs, setInputs] = useState({
    username: '',
    school: '',
    email: '',
    adress: '',
    mbti: '',
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
  const {username, school, email, adress, mbti, gender, age} = inputs;
  const onChange = (name, value) => {
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const List = (kinds) => {
    const sort = kinds === 'mbti' ? mbtiSort : starSort;
    const color = [
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
              style={[styles.modalbox, {backgroundColor: color[index]}]}
              onPress={() => {
                if (kinds === 'mbti') {
                  setShowMbtiModal(false);
                } else {
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

  return (
    <View style={styles.container}>
      {mbtiModal}
      {starModal}
      <Text style={styles.subTitleText}>필수 입력</Text>
      <View style={styles.inputContainer}>
        <TextInputComp
          onChange={onChange}
          title="이름"
          name="username"
          value={username}
          placeholder="이름을 입력해주세요"
        />
        <View style={styles.schoolButton}>
          <TextInputComp
            onChange={onChange}
            title="이메일"
            name="email"
            value={email}
            placeholder="예) 미팅대학교"
          />
        </View>
      </View>
      <Text style={[styles.subTitleText, styles.line]}>선택 입력</Text>
      <View style={styles.inputContainer}>
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
    </View>
  );
}

function TextInputComp({title, name, value, placeholder, onChange}) {
  return (
    <View style={styles.textInputContainer}>
      <Text style={styles.text}>{title}</Text>
      <TextInput
        style={styles.inputSchool}
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
  },
  subTitleText: {
    fontSize: 30,
    padding: 20,
  },
  inputContainer: {
    flex: 1,
  },
  buttonContainer: {
    width: 100,
    margin: 20,
  },

  line: {
    borderTopColor: 'gray',
    borderTopWidth: 2,
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
