import {
  CHOOSE_WORKOUT,
  FETCH_WORKOUTS,
  CLEAR_WORKOUT,
  ADD_WORKOUT,
  ADD_EXERCISE_TO_WORKOUT,
} from '../actions/types';

const INITIAL_STATE = {
  id: -1,
  title: '',
  date: '',
  workouts: [],
  exercises: []
};

export default function workoutReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD_EXERCISE_TO_WORKOUT:
      return {
        ...state,
        exercises: [...state.exercises, action.payload]
      }
    case CHOOSE_WORKOUT:
      let exercises = action.payload.reduce((acc, next) => {
        return [...acc, { id: next.exercise_id, title: next.exercise_title }];
      }, []);

      const { workout_id, workout_title, date } = action.payload[0];

      return {
        ...state,
        id: workout_id,
        title: workout_title,
        date,
        exercises: exercises[0].id ? exercises : []
      };
    case ADD_WORKOUT:
      const oldWorkouts = state.workouts;
      return {
        ...state,
        id: action.payload.id,
        title: action.payload.title,
        date: action.payload.date,
        exercises: [],
        workouts: [
          {
            id: action.payload.id,
            title: action.payload.title,
            date: action.payload.date
          },
          ...oldWorkouts
        ]
      };
    case CLEAR_WORKOUT:
      return {
        ...state,
        id: -1,
        title: '',
        date: '',
        exercises: []
      };
    case FETCH_WORKOUTS:
      const workouts = action.payload;
      return { ...state, workouts };
    default:
      return state;
  }
}
