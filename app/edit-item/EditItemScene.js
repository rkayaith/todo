import React, { Component } from 'react'
import { View } from 'react-native'

import ItemEditor from '../common/ItemEditor'

import styles from '../styles'
import { Toolbar } from '../components'

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
				<Toolbar
					title="Edit Item"
					navIconName="arrow-back"
					onIconClicked={ this.done }
				/>
				<ItemEditor
					item={ this.state }
					change={ this.setState.bind(this) }
				/>
			</View>
		)
	}

	done = () => {
		let item = { ...this.state }
		// Replace -Infinity with the current date
		if (item.urgent === -Infinity) {
			item.urgent = Date.now()
		}
		this.props.change(item)
		this.props.navigator.pop()
	}
}
