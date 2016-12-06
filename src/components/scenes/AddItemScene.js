import React, { Component } from 'react'
import { View, Animated } from 'react-native'

import ItemEditor from '../editor/ItemEditor'

import { style, colors } from '../styles'
import { Toolbar, BackAndroid } from '../common'

import * as Item from '../../modules/Item'

export default class AddItemScene extends Component {

	state = Item.emptyItem()

	render() {
		return (
			<View style={ styles.scene }>
				<Animated.View style={ [styles.toolbar, { backgroundColor: this.state.color }] }>
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
				</Animated.View>
				<ItemEditor
					item={ this.state }
					change={ this.setState.bind(this) }
					onColorChange={ color => this.setState({ color }) }
					focusTitle={ true }
				/>
				<BackAndroid onPress={ this.props.navigator.pop }/>
			</View>
		)
	}

	done = () => {
		this.props.addItem(Item.fromObj(this.state))
		this.props.navigator.pop()
	}
}

const styles = style()
