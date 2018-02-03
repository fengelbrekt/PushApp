import { TabNavigator } from 'react-navigation';
//import LoginMain from '../components/login/LoginMain';
import Workout from '../components/Dashboard/Workout.js';
import ViewWorkout from '../components/Dashboard/Workouts/ViewWorkout';

import LoginUser from '../components/login/existing/LoginUser';
import CreateAccount from '../components/login/create/CreateAccount';

//
// import { StackNavigator } from 'react-navigation';
// import Main from '../components/Main';
// import LoginMain from '../components/login/LoginMain';
// // import Workout from '../components/Dashboard/Workout';
// import ViewWorkout from '../components/Dashboard/Workouts/ViewWorkout';
import NewWorkout from '../components/Dashboard/NewWorkout';
import WorkoutList from '../components/TempDashboard/WorkoutList';
// import Workout as TempWorkout from '../components/TempDashboard/Workout';

const AppRouteConfigs = {
  LoginUser: {
    screen: LoginUser,
    navigationOptions: {
      tabBarVisible: false
    }
  },
  CreateAccount: {
    screen: CreateAccount,
    navigationOptions: {
      tabBarVisible: false
    }
  },
  Workout: {
    screen: Workout,
    navigationOptions: {
      tabBarVisible: false
    }
  },
  // TempWorkout: {
  //   screen: TempWorkout,
  //   navigationOptions: {
  //     tabBarVisible: false
  //   }
  // },
  ViewWorkout: {
    screen: ViewWorkout,
    navigationOptions: {
      tabBarVisible: false
    }
  },
  ViewWorkout: {
    screen: ViewWorkout,
    navigationOptions: {
      tabBarVisible: false
    }
  },
  NewWorkout: {
    screen: NewWorkout,
    navigationOptions: {
      tabBarVisible: false
    }
  }
};

export default (AppNavigator = TabNavigator(AppRouteConfigs));
