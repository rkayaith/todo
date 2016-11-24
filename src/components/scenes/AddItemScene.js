import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import ItemEditor from '../editor/ItemEditor'

import { style, colors } from '../styles'
import { Toolbar, StatusBar, Touchable, ColorTransition } from '../components'

import * as Item from '../../modules/Item'

export default class AddItemScene extends Component {

	state = Item.emptyItem()
	componentWillReceiveProps(props) {
		this.setState(Item.emptyItem())
	}

	render() {
		return (
			<View style={ styles.scene }>
				<StatusBar backgroundColor={ Item.colorDark(this.state) }/>
				<ColorTransition
					style={ styles.toolbar }
					color={ Item.color(this.state) }
					duration={ 335 }>
					<Toolbar
						title="Add Item"
						style={{ backgroundColor: colors.invisible }}
						navIconName="close"
						onIconClicked={ this.props.navigator.pop }
						actions={ [{ title: "Add item", iconName: "add", show: 'always' }] }
						onActionSelected={ action => {
							switch (action) {
								case 0:
									// add item
									return this.done()
							}
						}}
					/>
				</ColorTransition>
				<ItemEditor
					item={ this.state }
					change={ this.setState.bind(this) }>
				</ItemEditor>
			</View>
		)
	}

	done = () => {
		this.props.addItem(Item.fromObj(this.state))
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
