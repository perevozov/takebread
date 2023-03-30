import React, {Component} from 'react';
import {Text} from 'react-native';


type ListItemProps = {
    name: string;
  };

export class ListItem extends Component<ListItemProps> {

  render() {
    return <Text>Hello, I am your cat {this.props.name}!</Text>;
  }
}
