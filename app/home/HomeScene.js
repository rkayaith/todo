import React, { Component } from 'react'
import { View, ScrollView, Text } from 'react-native'

import styles, { colors } from '../styles'
import { Toolbar, StatusBar, ActionButton } from '../components'

import TodoList from './TodoList'

export default class HomeScene extends Component {
	render() {
		return (
			<View style={ styles.scene }>
				<StatusBar backgroundColor={ colors.primaryColorDark }/>
				<Toolbar
					title='Todo List'
					titleColor='white'
					style={{ backgroundColor: colors.primaryColor }}
				/>
				<ScrollView>
					<TodoList
						data={ this.props.data }
						changeItem={ this.props.changeItem }
						deleteItem={ this.props.deleteItem }
						goToEditItem={ this.goToEditItem }
					/>
					<Text onPress={ this.props.resetData }>Load mock data</Text>
				</ScrollView>

				<ActionButton icon="add" onPress={ this.goToAddItem } />
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
