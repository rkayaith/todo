import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableNativeFeedback } from 'react-native'

import { style, colors } from '../styles'
import { Touchable, CheckBox, Button, Icon } from '../components'

export default class TodoItem extends Component {
    render() {
        return (
            <Touchable
                onPress={ this.props.edit }
                style={ [styles.container, this.props.checked && styles.containerChecked] }>

                <CheckBox
                    size={ 36 }
                    value={ this.props.checked }
                    onValueChange={ checked => this.props.change({ checked }) } />

                <Text
                    numberOfLines={ 1 }
                    style={ [styles.itemText, this.props.checked && styles.textChecked] }>
                    { this.props.text }
                </Text>

                <Button size={ 36 } onPress={ this.props.delete }>
                    <Icon name="clear" size={ 15 } style={{ opacity: 0.75 }}/>
                </Button>
            </Touchable>
        )
    }
}

const styles = StyleSheet.create({
    ...style,
    container: {
        height: 36,
		flexDirection: 'row',
		alignItems: 'center',
	},
    containerChecked: {
        opacity: 0.5
    },
    itemText: {
        ...style.text,
        flex: 1,
        marginHorizontal: 5,
        paddingBottom: 1,
    },
    textChecked: {
        textDecorationLine: "line-through",
    },
})
