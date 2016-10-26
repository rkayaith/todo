import React, { Component } from 'react'
import { View, Text } from 'react-native'

import styles, { colors } from '../styles'
import { Toolbar } from '../components'

import TodoList from './TodoList'
import AddItemButton from './AddItemButton'

export default class HomeScene extends Component {
	render() {
		return (
			<View style={ styles.scene }>
				<Toolbar
					title='Todo List'
					titleColor='white'
					style={{ backgroundColor: colors.primaryColor }}
				/>
				<TodoList
					data={ this.props.data }
					changeItem={ this.props.changeItem }
					deleteItem={ this.props.deleteItem }
					goToEditItem={ this.goToEditItem }
				/>
				<AddItemButton goToAddItem={ this.goToAddItem } />
				<Text onPress={ this.props.resetData }>Load mock data</Text>
			</View>
		)
	}

	goToAddItem = () => {
		this.props.navigator.push({ id: 'add-item' })
	}

	goToEditItem = (itemId) => {
		this.props.navigator.push({ id: 'edit-item', itemId })
	}
}
