import React, { Component } from 'react'
import { View, Animated } from 'react-native'

import ItemEditor from '../editor/ItemEditor'

import { style, colors } from '../styles'
import { Toolbar, BackAndroid } from '../common'

import * as Item from '../../modules/Item'

export default class EditItemScene extends Component {

	constructor(props) {
		super(props)
		this.state = props.item
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState !== this.state) {
			this.props.change(Item.fromObj(this.state))
		}
	}

	render() {
		return (
			<View style={ styles.scene }>
				<Animated.View style={ [styles.toolbar, { backgroundColor: this.state.color }] }>
					<Toolbar
						title="Edit Item"
						style={{ backgroundColor: colors.transparent }}
						navIconName="arrow-back"
						onIconClicked={ this.props.navigator.pop }
						actions={ [{ title: "Remove item", iconName: "delete", show: 'always' }] }
						onActionSelected={ action => {
							switch (action) {
								case 0:
									// remove item
									this.props.remove()
									this.props.navigator.pop()
							}
						}}
					/>
				</Animated.View>
				<ItemEditor
					item={ this.state }
					change={ this.setState.bind(this) }
					onColorChange={ color => this.setState({ color }) }
				/>
				<BackAndroid onPress={ this.props.navigator.pop }/>
			</View>
		)
	}

}

const styles = style()
