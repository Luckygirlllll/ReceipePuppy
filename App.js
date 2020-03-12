/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StatusBar,
} from 'react-native';
import axios from 'axios';

export default class App extends React.Component {
  state = {
    receipe: '', //receipe which user types
    data: null, //data from the server
  };

  async setStateAsync(newState) {
    return new Promise(resolve => this.setState(newState, resolve));
  }

  onChange = async (key, event) => {
    let {text} = event.nativeEvent;
    await this.setStateAsync({[key]: text});
    this.searchReceipe();
  };

  searchReceipe = async () => {
    const {receipe} = this.state;
    try {
      const data = await axios.post(
        `http://www.recipepuppy.com/api/?q=${receipe}&p=1`,
      );
      const dataSecond = await axios.post(
        `http://www.recipepuppy.com/api/?q=${receipe}&p=2`,
      );
      if (
        data != null &&
        data.data != null &&
        data.data.results != null &&
        dataSecond != null &&
        dataSecond.data != null &&
        dataSecond.data.results != null
      ) {
        // display first 20 results
        const combinedData = data.data.results.concat(dataSecond.data.results);
        this.setState({data: combinedData});
      }
    } catch (error) {
      console.error(error);
    }
  };

  renderItem = ({item, index}) => (
    <TouchableHighlight>
      <View style={styles.itemRow}>
        <Text style={styles.text}>{item.title}</Text>
      </View>
    </TouchableHighlight>
  );

  render() {
    const {receipe, data} = this.state;
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <TextInput
            style={styles.textInput}
            autoFocus={true}
            value={receipe}
            placeholder="Type receipe..."
            placeholderTextColor="#707070"
            onChange={e => this.onChange('receipe', e)}
          />
          {data != null && (
            <FlatList
              data={data}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
            />
          )}
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    width: '90%',
    height: 50,
    borderWidth: 1,
    alignSelf: 'center',
    padding: 10,
    marginTop: 20,
  },
  itemRow: {
    flexDirection: 'row',
    height: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 20,
  },
  text: {
    paddingLeft: 10,
  },
});
