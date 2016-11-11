import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableNativeFeedback } from 'react-native'

import { style, colors } from '../styles'
import { Touchable, CheckBox, Icon } from '../components'

export default class TodoItem extends Component {
    render() {
        let alpha = this.props.checked === true ? 0.5 : 1
        return (
            <Touchable
                ripple={ this.props.color }
                onPress={ this.props.edit }
                style={ [styles.container] }>

                <CheckBox
                    size={ 36 }
                    alpha={ alpha }
                    value={ this.props.checked }
                    ripple={ this.props.color }
                    borderless={ true }
                    onValueChange={ checked => this.props.change({ checked }) } />

                <Text
                    numberOfLines={ 1 }
                    style={[
                        styles.itemText,
                        this.props.checked && styles.textChecked,
                        { color: colors.alpha(style.text.color, alpha) }
                    ]}>
                    { this.props.text }
                </Text>

                <Touchable ripple={ this.props.color } borderless={ true } onPress={ this.props.remove }>
                    <Icon name="clear" size={ 36 } iconSize={ 15 } alpha={ alpha * 0.75 }/>
                </Touchable>
            </Touchable>
        )
    }
}

const styles = StyleSheet.create({
    ...style,
    container: {
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
