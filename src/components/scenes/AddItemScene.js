import React, { Component } from 'react'
import { View } from 'react-native'

import ItemEditor from '../editor/ItemEditor'

import styles, { colors } from '../styles'
import { Toolbar, StatusBar, ColorTransition, BackAndroid } from '../components'

import * as Item from '../../modules/Item'

export default class AddItemScene extends Component {

	state = Item.emptyItem()

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
						style={{ backgroundColor: colors.transparent }}
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
					change={ this.setState.bind(this) }
					focusTitle={ true }>
				</ItemEditor>
				<BackAndroid onPress={ this.props.navigator.pop }/>
			</View>
		)
	}

	done = () => {
		this.props.addItem(Item.fromObj(this.state))
		this.props.navigator.pop()
	}
}
