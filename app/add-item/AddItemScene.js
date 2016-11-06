import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import ItemEditor from '../common/ItemEditor'

import { style, colors } from '../styles'
import { Toolbar, StatusBar, Touchable } from '../components'


const defaultItem = { text: "", checked: false, urgent: Infinity, important: false }

export default class AddItemScene extends Component {

	state = defaultItem
	componentWillReceiveProps(props) {
		this.setState(defaultItem)
	}

	render() {
		return (
			<View style={ styles.scene }>
				<StatusBar />
				<Toolbar
					title="Add Item"
					navIconName="arrow-back"
					onIconClicked={ this.props.navigator.pop }
				/>
				<ItemEditor
					item={ this.state }
					change={ this.setState.bind(this) }>
					<View style={ styles.buttonContainer }>
						<Touchable style={ styles.button } onPress={ this.done }>
							<Text style={ styles.buttonText }>ADD ITEM</Text>
						</Touchable>
					</View>
				</ItemEditor>
			</View>
		)
	}

	done = () => {
		let item = { ...this.state }
		// Replace -Infinity with the current date
		if (item.urgent === -Infinity) {
			item.urgent = Date.now()
		}
		this.props.addItem(item)
		this.props.navigator.pop()
	}
}

const styles = StyleSheet.create({
	...style,
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 8,
	},
	buttonText: {
		...style.text,
		color: colors.primaryColor,
		fontSize: 16,
		fontFamily: 'sans-serif-medium',
	},
	buttonContainer: {
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		flex: 1,
	}
})
