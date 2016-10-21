import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

import { style } from '../styles'

export default class TodoItem extends Component {
    render() {
        return (
            <View style={ styles.container }>
                <Text onPress={ this.onPress } style={ [styles.item, this.props.checked && styles.checked] }>
                    Y
                </Text>
                <Text onPress={ this.props.delete } style={ styles.item }>D</Text>
                <Text onPress={ this.props.edit } style={ styles.item }>E</Text>
                <TextInput
                    value={ this.props.text }
                    onChangeText={ text => this.props.change({ text }) }
                    style={ [ styles.input, styles.item] }
                />
            </View>
        )
    }

    onPress = () => {
        this.props.change({ checked: !this.props.checked })
    }
}

const styles = StyleSheet.create({
    item: {
        ...style.text,
        marginHorizontal: 5,
    },
    input: {
        flex: 1
    },
    checked: {
        color: 'red'
    },
    container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 15,
	},
})
