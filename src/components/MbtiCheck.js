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
import {FancyButton, FancyFonts} from '../common/common';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

export default function MbtiCheck({
  mbti,
  star,
  gender,
  onChange,
  setFinishSignUp,
}) {
  const [showMbtiModal, setShowMbtiModal] = useState(false);
  const [showMbtiTestModal, setShowMbtiTestModal] = useState(false);
  const [showStarModal, setShowStarModal] = useState(false);
  const [mbtiSort, setMbtiSort] = useState();
  const [starSort, setStarSort] = useState();
  const [stage, setStage] = useState(0);
  const {colors} = useTheme();
  const [tempMbti, setTempMbti] = useState('');
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

  // const starModal = (
  //   <Modal animationType={'slide'} transparent={false} visible={showStarModal}>
  //     <View style={styles.mbtiContainer}>
  //       <Text style={styles.mbtiIntroduceText}>
  //         당신의 별자리를 선택해 주세요!
  //       </Text>
  //       {List('star')}
  //     </View>
  //   </Modal>
  // );
  const testList = [
    ['외향형', '단체 활동 선호', '생각을 표출하며 말하기를 선호'],
    ['내향형', '혼자 하는 활동 선호', '내면에 담고 글쓰는 것을 선호'],
    ['감각형', '실용적이고 현실적', '이미 일이난 적이 있는 일에 초점'],
    ['직관형', '미래를 추구하고 이상적', '두루뭉술하고 자기만의 방식 있음'],
    [
      '사고형',
      '객관성과 합리성에 초점',
      '논리적인 성향',
      '일과 목표, 효율성 중시',
    ],
    ['감정형', '감정 표현에 예민, 공감적인 성향', '대인관계와 사람 중시'],
    [
      '판단형',
      '결단력 있고, 철저하며 조직적',
      '명확성, 예측 가능성 및 계획 중시',
      '결과의 올바름 중시',
    ],
    [
      '인식형',
      '융통성 있고 편안함 중시',
      '자유롭고 즉흥적',
      '과정의 올바름 중시',
    ],
  ];

  const testResult = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'];
  const mbtiTestModal = () => {
    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={showMbtiTestModal}>
        <View style={styles.mbtiTestContainer}>
          <TouchableOpacity
            style={styles.mbtiSelectOne}
            onPress={() => {
              onChange('mbti', mbti + testResult[stage]);
              if (stage === 6) {
                setStage(0);

                setShowMbtiTestModal(false);
              } else {
                setStage(stage + 2);
              }
            }}>
            {testList[stage].map((item, index) => {
              return (
                <View key={item}>
                  <Text style={index === 0 ? styles.textTitle : styles.text}>
                    {item}
                  </Text>
                </View>
              );
            })}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mbtiSelectTwo}
            onPress={() => {
              onChange('mbti', mbti + testResult[stage + 1]);
              if (stage === 6) {
                setStage(0);
                setShowMbtiTestModal(false);
              } else {
                setStage(stage + 2);
              }
            }}>
            {testList[stage + 1].map((item, index) => {
              return (
                <View key={item}>
                  <Text style={index === 0 ? styles.textTitle : styles.text}>
                    {item}
                  </Text>
                </View>
              );
            })}
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
    <LinearGradient
      colors={
        gender === true
          ? [colors.manBackground[0], colors.manBackground[1]]
          : [colors.womanBackground[0], colors.womanBackground[1]]
      }
      style={styles.container}>
      {mbtiModal}
      {mbtiTestModal()}
      {/* {starModal} */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>본인의 MBTI를 아시나요?</Text>
      </View>
      <View style={styles.checkContainer}>
        <View style={styles.form}>
          <View style={styles.buttonForm}>
            <FancyButton
              mode="outlined"
              color="#000069"
              onPress={() => {
                onChange('mbti', '');
                setShowMbtiModal(true);
              }}>
              <Text style={styles.text}>네, MBTI 선택하기</Text>
            </FancyButton>
          </View>
          <View style={styles.buttonForm}>
            <FancyButton
              mode="outlined"
              color="#000069"
              onPress={() => {
                onChange('mbti', '');
                setShowMbtiTestModal(true);
              }}>
              <Text style={styles.text}>아니오, 간단 테스트</Text>
            </FancyButton>
          </View>
        </View>
      </View>
      <View style={styles.myMbtiContainer}>
        <Text style={styles.myMbtiText}>{mbti}</Text>
      </View>
      <View style={styles.completeContainer}>
        <FancyButton
          icon="arrow-right-bold"
          mode="outlined"
          color="#000069"
          onPress={() => {
            setFinishSignUp(true);
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
    margin: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 25,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  checkContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  form: {
    flexDirection: 'column',
  },

  buttonForm: {
    marginBottom: 40,
  },
  fancyButton: {
    marginTop: 5,
  },

  completeContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginBottom: 20,
    marginRight: 20,
  },

  mbtiContainer: {
    flex: 1,
  },
  mbtiIntroduceText: {
    fontSize: 27,
    margin: 25,
    textAlign: 'center',
    fontFamily: FancyFonts.BMDOHYEON,
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
    fontFamily: FancyFonts.BMDOHYEON,
  },

  mbtiTestContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  mbtiSelectOne: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffafb0',
  },
  mbtiSelectTwo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aee4ff',
  },
  textTitle: {
    fontSize: 40,
    fontFamily: FancyFonts.BMDOHYEON,
  },
  text: {
    fontFamily: FancyFonts.BMDOHYEON,
  },

  myMbtiContainer: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myMbtiText: {
    fontSize: width * 0.3,
    fontWeight: 'bold',
    fontFamily: FancyFonts.BMDOHYEON,
  },
  nextButtonText: {
    fontFamily: FancyFonts.BMDOHYEON,
  },
});
