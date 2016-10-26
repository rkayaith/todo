import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

import { style, colors } from '../styles'

export default class TodoItem extends Component {
    render() {

        let backgroundColor = this.props.urgent ?
            (this.props.important ? colors.red100 : colors.orange100) :
            (this.props.important ? colors.yellow100 : colors.green100)

        return (
            <View style={ [styles.container, { backgroundColor }] }>
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
