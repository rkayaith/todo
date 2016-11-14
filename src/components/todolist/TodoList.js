import React, { Component } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'

import TodoListSection from './TodoListSection'

import { colors } from '../styles'

import * as Item from '../../modules/Item'
import * as Data from '../../modules/Data'

export default class TodoList extends Component {

	render() {
		let sections = Item.levels().map(level => (
			<TodoListSection
				key={ level }
				level={ level }
				data={ Data.filter(this.props.data, item => Item.level(item) === level) }
				changeItem={ this.props.changeItem }
				removeItem={ this.props.removeItem }
				goToEditItem={ this.props.goToEditItem }
			/>
		))

		return (
			<ScrollView>
				{ sections }
				<View
					// empty footer so scrolling is enabled when items are under the action button
					style={ styles.footer }
				/>
			</ScrollView>
		)
	}

}

const styles = StyleSheet.create({
	footer: {
		height: 80,
	},
})
