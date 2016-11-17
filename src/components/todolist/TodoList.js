import React, { Component } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'

import TodoListSection from './TodoListSection'

import { colors } from '../styles'

import * as Item from '../../modules/Item'
import * as Data from '../../modules/Data'

export default class TodoList extends Component {

	render() {
		let data = Data.sort(this.props.data, Item.sort)
		let sections = Item.levels().map(level => (
			<TodoListSection
				key={ level }
				level={ level }
				data={ Data.filter(data, item => Item.level(item) === level) }
				changeItem={ this.props.changeItem }
				removeItem={ this.props.removeItem }
				notifEnabled={ this.props.notifSettings[level] }
				setNotifEnabled={ enabled => this.props.setNotifSettings({ [level]: enabled }) }
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
