import React, { Component } from 'react'
import { View } from 'react-native'

import ItemEditor from '../common/ItemEditor'

import styles from '../styles'
import { Toolbar } from '../components'

export default class AddItemScene extends Component {
	render() {
		return (
			<View style={ styles.scene }>
				<Toolbar
					title="Add Item"
					navIconName="arrow-back"
					onIconClicked={ this.props.navigator.pop }
				/>
				<ItemEditor
					item={{ text: "", checked: false, urgent: Infinity, important: false }}
					submit={ this.submit }
				/>
			</View>
		)
	}

	submit = (item) => {
		this.props.addItem(item)
		this.props.navigator.pop()
	}
}
