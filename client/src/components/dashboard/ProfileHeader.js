import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager,
  StyleSheet,
  Image
} from 'react-native';
import NavigationActions from 'react-navigation';
import { logout } from '../../actions';
import { Svg } from 'expo';

import avatar from '../../../assets/avatar_default.svg';
import profile_bottom from '../../../assets/profile_bottom.svg';

const { height, width } = Dimensions.get('window');

class ProfileHeader extends React.Component {
  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        // console.log(gesture);
        if (gesture.dy < 180) {
          position.setValue({ x: gesture.dx, y: gesture.dy });
        }
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dy > 100) {
          this.forceSwipe();
        } else {
          this.resetPosition();
        }
      }
    });

    this.state = { panResponder, position };
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  forceSwipe() {
    Animated.timing(this.state.position, {
      toValue: { x: 0, y: 180 },
      duration: 250
    }).start();
  }

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  getProfileStyle() {
    return {
      top: this.state.position.getLayout().top
    };
  }

  render() {
    return (
      <Animated.View
        style={[this.getProfileStyle(), { zIndex: 10 }]}
        {...this.state.panResponder.panHandlers}
      >
        <View style={styles.container}>
          <View>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                marginRight: 10
              }}
              onPress={() => {
                this.props.logout(this.props.user.id);
                this.props.navigation.dispatch(
                  NavigationActions.NavigationActions.navigate({
                    routeName: 'LoginUser'
                  })
                );
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: '#fff'
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            {/* <Image
              source={require('../../../assets/avatar_default.png')}
              style={{ width: 45, height: 45, alignSelf: 'center' }}
            /> */}
            <Text style={styles.userWelcome}>
              Welcome back {this.props.user.name}!
            </Text>
          </View>
          <Text style={styles.tagline}>Ready to rock!?</Text>
          <Svg height="100" width={width}>
            <Svg.Ellipse
              cx={width / 2}
              cy="5"
              rx={width / 1.5}
              ry="30"
              stroke="#b9baf1"
              strokeWidth="0"
              fill="#b9baf1"
            />
          </Svg>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#b9baf1',
    height: 190,
    paddingTop: 72
  },
  userWelcome: {
    marginTop: 20,
    fontSize: 24,
    color: '#fff',
    textAlign: 'center'
  },
  tagline: {
    marginTop: 10,
    fontSize: 14,
    color: '#fff',
    textAlign: 'center'
  }
});

export default connect(null, { logout })(ProfileHeader);