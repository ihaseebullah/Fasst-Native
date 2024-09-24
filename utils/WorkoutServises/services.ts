export const fetchTodayActivities = async () => {
    return await fetch('/api/today-activities').then((response) => response.json());
  };
  
  export const fetchTodaysExercises = async () => {
    return await fetch('/api/todays-exercises').then((response) => response.json());
  };
  
  export const fetchRecommendedExercises = async () => {
    return await fetch('/api/recommended-exercises').then((response) => response.json());
  };
  