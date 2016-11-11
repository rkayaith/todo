import React, { Component } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'

import { colors } from '../styles'

import TodoItem from './TodoItem'
import TodoListSection from './TodoListSection'

export default class TodoList extends Component {

	render() {
		let urgent_important = {}
		let urgent_notimportant = {}
		let noturgent_important = {}
		let noturgent_notimportant = {}

		let now = Date.now()
		for (id in this.props.data) {
			let item = this.props.data[id]
			// item.urgent is a unix timestamp for
			// when the item should become urgent
			if (item.urgent <= now) {
				if (item.important) {
					urgent_important[id] = item
				} else {
					urgent_notimportant[id] = item
				}
			} else {
				if (item.important) {
					noturgent_important[id] = item
				} else {
					noturgent_notimportant[id] = item
				}
			}
		}

		return (
			<ScrollView>
				<TodoListSection
					data={ urgent_important }
					title="Urgent, Important"
					icon="error-outline"
					iconSize={ 22 }
					renderRow={ this.renderRow }
					color={ colors.level4 }
				/>
				<TodoListSection
					data={ urgent_notimportant }
					title="Urgent, Not Important"
					icon="schedule"
					iconSize={ 22 }
					renderRow={ this.renderRow }
					color={ colors.level3 }
				/>
				<TodoListSection
					data={ noturgent_important }
					title="Not Urgent, Important"
					icon="priority-high"
					iconSize={ 20 }
					renderRow={ this.renderRow }
					color={ colors.level2 }
				/>
				<TodoListSection
					data={ noturgent_notimportant }
					title="Not Urgent, Not Important"
					icon="done"
					iconSize={ 20 }
					renderRow={ this.renderRow }
					color={ colors.level1 }
				/>

				<View
					// empty footer so scrolling is enabled when items are under the action button
					style={ styles.footer }
				/>
			</ScrollView>
		)
	}

	renderRow = (color, item, sectionID, rowID) => {
		return (
			<TodoItem
				{ ...item }
				key={ rowID }
				color={ color }
				change={ this.props.changeItem.bind(null, rowID) }
				remove={ this.props.removeItem.bind(null, rowID) }
				edit={ this.props.goToEditItem.bind(null, rowID) }
			/>
		)
	}

}

const styles = StyleSheet.create({
	footer: {
		height: 80,
	},
})
