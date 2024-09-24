import {Colors} from '../../../constants/Colors';
import {ActivityIndicator, FlatList, Text, View} from 'react-native';
import {ExerciseCard} from './ExerciseCard';

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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{textAlign: 'center', color: Colors.Secondary}}>
          {todays
            ? 'Request Timeout, Try reloading the page.'
            : 'This may take a while...'}
        </Text>
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
