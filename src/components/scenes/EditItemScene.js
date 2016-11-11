import React, { Component } from 'react'
import { View } from 'react-native'

import ItemEditor from '../editor/ItemEditor'

import styles from '../styles'
import { Toolbar, StatusBar } from '../components'

import * as Item from '../../modules/Item'

export default class EditItemScene extends Component {

	constructor(props) {
		super(props)
		this.state = props.item
	}

	componentWillReceiveProps(props) {
		this.setState(props.item)
	}

	render() {
		return (
			<View style={ styles.scene }>
				<StatusBar />
				<Toolbar
					title="Edit Item"
					navIconName="arrow-back"
					onIconClicked={ this.done }
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
				<ItemEditor
					item={ this.state }
					change={ this.setState.bind(this) }
				/>
			</View>
		)
	}

	done = () => {
		this.props.change(Item.fromObj(this.state))
		this.props.navigator.pop()
	}
}
