import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

class AchievementCell extends React.PureComponent {
  render() {
    return (
      <View style={styles.achievementItem}>
        <Image style={styles.achievementItemImage} source={this.props.image} />
        <Text style={styles.header}>
          {this.props.title}
        </Text>
        <Text style={styles.date}>
          {this.props.date}
        </Text>
        <Text style={styles.date}>
          Obtained: {this.props.obtained} times
        </Text>
      </View>
    );
  }
}

export default AchievementCell;

const styles = StyleSheet.create({
  achievementItem: {
    backgroundColor: '#fff',
    width: '50%',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
    alignItems: 'center'
  },
  achievementItemImage: {
    width: 70,
    height: 70
  },
  header: {
    fontSize: 17,
    fontWeight: '500',
    color: '#2e31a3'
  },
  date: {
    color: '#484bb4'
  }
});
