import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from '@react-navigation/native';
import {CONST_VALUE} from '../common/common';
import {getInformation} from '../modules/getInformation';
import {FancyButton} from '../common/common';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function MbtiCheck({mbti, star, onChange, setFinishSignUp}) {
  const [showMbtiModal, setShowMbtiModal] = useState(false);
  const [showStarModal, setShowStarModal] = useState(false);
  const [mbtiSort, setMbtiSort] = useState();
  const [starSort, setStarSort] = useState();
  const {colors} = useTheme();

  useEffect(() => {
    const infor = async () => {
      setMbtiSort(await getInformation('mbti'));
      setStarSort(await getInformation('star'));
    };
    infor();
  }, []);

  const List = (kinds) => {
    const sort = kinds === 'mbti' ? mbtiSort : starSort;

    return (
      <SafeAreaView style={styles.modalboxContainer}>
        <FlatList
          data={sort}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={[
                styles.modalbox,
                {
                  borderColor: CONST_VALUE.SORT_COLOR[index],
                },
              ]}
              onPress={() => {
                if (kinds === 'mbti') {
                  onChange('mbti', item.name);
                  setShowMbtiModal(false);
                } else {
                  onChange('star', item.name);
                  setShowStarModal(false);
                }
              }}>
              <Text
                style={[
                  styles.modalText,
                  {color: CONST_VALUE.SORT_COLOR[index]},
                ]}>
                {item.name}
              </Text>
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
  const gender = true;
  return (
    <LinearGradient
      colors={
        gender === true
          ? [colors.manBackground[0], colors.manBackground[1]]
          : [colors.womanBackground[0], colors.womanBackground[1]]
      }
      style={styles.container}>
      {mbtiModal}
      {/* {starModal} */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>MBTI</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.form}>
          <View style={styles.buttonForm}>
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
          <View style={styles.buttonForm}>
            <FancyButton mode="contained" color="#000069" onPress={() => {}}>
              MBTI Simple Test
            </FancyButton>
          </View>
          <View style={styles.buttonForm}>
            <FancyButton
              mode="contained"
              color="green"
              onPress={() => {
                setFinishSignUp(true);
              }}>
              임시완료버튼
            </FancyButton>
          </View>
          {/* <View style={styles.buttonForm}>
            <FancyButton
              color="#000069"
              mode="contained"
              onPress={() => {
                setShowStarModal(true);
              }}>
              별자리
            </FancyButton>
            <Text>{star}</Text>
          </View> */}
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
