import {Colors} from '../../../constants/Colors';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import {Pressable, Text, View} from 'react-native';

export const ActivityCard = ({item, handleChallengeClick}) => (
  <Pressable
    onPress={() => {
      if (item.challenge) handleChallengeClick(item.challenge);
    }}
    style={{
      backgroundColor: Colors.CardBackground,
      borderRadius: 10,
      margin: 5,
      overflow: 'hidden',
      borderColor: Colors.Error,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      elevation: 3,
    }}>
    <LottieView
      source={require('../../../assets/animations/steps2.json')}
      autoPlay
      loop
      style={{width: 50, height: 50}}
    />
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Ionicons
          name="clipboard-check-outline"
          color={Colors.TextPrimary}
          size={20}
          style={{marginRight: 5}}
        />
        <Text
          style={{
            color: Colors.TextPrimary,
            fontSize: 15,
            fontWeight: 'bold',
            textAlign: 'left',
          }}>
          {item.activityName}
        </Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
        <Ionicons
          name="walk"
          color={Colors.TextSecondary}
          size={18}
          style={{marginRight: 5}}
        />
        <Text style={{color: Colors.TextSecondary, fontSize: 15}}>
          {item.activityDescription}
        </Text>
      </View>
    </View>
  </Pressable>
);
