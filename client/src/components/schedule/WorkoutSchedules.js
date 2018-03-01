import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
  TextInput,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import NavigationActions from 'react-navigation';
import axios from 'axios';

import { addSchedule } from '../../actions';
import ScheduleCard from './ScheduleCard';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class WorkoutSchedules extends React.Component {
  constructor(props) {
    super(props);

    this.state = { addWorkoutModalVisible: false, title: '' };
  }

  addSchedule() {
    this.setState({ addWorkoutModalVisible: false });
  }

  render() {
    return (
      <KeyboardAwareScrollView
      style={{ backgroundColor: '#fff' }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      scrollEnabled={false}
    >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.dispatch(
                NavigationActions.NavigationActions.navigate({
                  routeName: 'Dashboard'
                })
              );
            }}
          >
            <Image
              source={require('../../../assets/back_arrow_black.png')}
              style={{ width: 35, height: 35 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.addSchedule();
            }}
          >
            <Text
              style={{
                marginTop: -24,
                fontSize: 56,
                fontWeight: '100',
                color: '#000'
              }}
            >
              +
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {Object.keys(this.props.list).map((id, index) =>
            <ScheduleCard
              key={`schedule${index}`}
              title={this.props.list[id].title}
              id={id}
              exercises={this.props.list[id].exercises}
              navigation={this.props.navigation}
            />
          )}
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = ({ schedules }) => {
  return {
    list: schedules.list
  };
};

export default connect(mapStateToProps, { addSchedule })(WorkoutSchedules);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    // backgroundColor: '#51c1ab',
    paddingTop: 50
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'space-between'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    height: 200
  },
  innerContainer: {
    alignItems: 'center',
    backgroundColor: '#81c1ab'
  },
  textInput: {
    height: 40,
    width: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 3,
    margin: 5
  }
});
