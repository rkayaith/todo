import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

import { style, colors } from '../styles'

export default class TodoItem extends Component {
    render() {

        return (
            <View style={ styles.container }>
                <Text onPress={ this.onPress } style={ [styles.item, this.props.checked && styles.checked] }>
                    Y
                </Text>
                <Text onPress={ this.props.delete } style={ styles.item }>D</Text>
                <Text onPress={ this.props.edit } style={ styles.item }>E</Text>
                <Text style={ styles.item }>
                    { this.props.text }
                </Text>
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
    checked: {
        color: 'red'
    },
    container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		paddingVertical: 6,
	},
})
