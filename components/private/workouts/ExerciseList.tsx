import {Colors} from '../../../constants/Colors';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {ExerciseCard} from './ExerciseCard';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

export const ExerciseList = ({
  exercises,
  onSelectExercise,
  isLoading,
  todays,
}) => {
  if (isLoading) {
    return <ActivityIndicator size="large" color={Colors.TintColorDark} />;
  }

  if (exercises.length === 0) {
    return (
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 80,backgroundColor: Colors.CardBackground,borderRadius:15 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons
        name="information-outline"
        color={Colors.Error}
        size={18}
        style={{ marginRight: 5 }}
      />
  <Text style={{ textAlign: 'center', color: Colors.Secondary }}>
      {todays
        ? 'Your schdueled exercises appear here.'
        : 'Request Timeout, Try reloading the page.'}
  </Text>
    </View>
</View>

    );
  }
  return (
    <FlatList
      data={exercises}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <ExerciseCard
          item={item}
          onPress={() => onSelectExercise(item, todays)}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};
