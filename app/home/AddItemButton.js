import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

import styles from '../styles'

// export default class AddItemButton extends Component {
// 	constructor(props) {
// 		super(props)
// 		this.state={ text: '' }
// 	}
//
// 	render() {
// 		return (
// 			<View style={ styles.container }>
// 				<Text style={ styles.item } onPress={ this.submit }>+</Text>
// 				<TextInput
// 					style={ [styles.item, { flex: 1 } ] }
// 					value={ this.state.value }
// 					placeholder={ 'New Item' }
// 					onChangeText={ text => this.setState({ text }) }
// 				/>
// 				<FloatingActionButton />
// 			</View>
// 		)
// 	}
//
// 	submit = () => {
// 		this.props.onAdd({ text: this.state.text, checked: false })
// 		this.setState({ text: 'goober' })
// 	}
// }

export default class AddItemButton extends Component {
	render() {
		return (
			<Text style={ styles.text } onPress={ this.props.goToAddItem }>AddItem</Text>
		)
	}
}
