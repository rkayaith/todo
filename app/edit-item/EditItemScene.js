import React, { Component } from 'react'
import { View } from 'react-native'

import ItemEditor from '../common/ItemEditor'

import styles from '../styles'
import { Toolbar } from '../components'

export default class EditItemScene extends Component {
	render() {
		return (
			<View style={ styles.scene }>
				<Toolbar
					title="Edit Item"
					navIconName="arrow-back"
					onIconClicked={ this.props.navigator.pop }
				/>
				<ItemEditor
					item={ this.props.item }
					submit={ this.submit }
				/>
			</View>
		)
	}

	submit = (item) => {
		this.props.change(item)
		this.props.navigator.pop()
	}
}
