import React, { Component } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'

import TodoListSection from './TodoListSection'

import { colors } from '../styles'

import * as Item from '../../modules/Item'

export default class TodoList extends Component {

	render() {

		let fns = {
			changeItem: this.props.changeItem,
			removeItem: this.props.removeItem,
			goToEditItem: this.props.goToEditItem,
		}

		let urgent_important = {}
		let urgent_notimportant = {}
		let noturgent_important = {}
		let noturgent_notimportant = {}

		for (id in this.props.data) {
			let item = this.props.data[id]
			switch(Item.level(item)) {
				case 4: urgent_important[id] = item; break;
				case 3: urgent_notimportant[id] = item; break;
				case 2: noturgent_important[id] = item; break;
				case 1: noturgent_notimportant[id] = item; break;
			}
		}

		return (
			<ScrollView>
				<TodoListSection
					{ ...fns }
					data={ urgent_important }
					level={ 4 }
					renderRow={ this.renderRow }
				/>
				<TodoListSection
					{ ...fns }
					data={ urgent_notimportant }
					level={ 3 }
					renderRow={ this.renderRow }
				/>
				<TodoListSection
					{ ...fns }
					data={ noturgent_important }
					level={ 2 }
					renderRow={ this.renderRow }
				/>
				<TodoListSection
					{ ...fns }
					data={ noturgent_notimportant }
					level={ 1 }
					renderRow={ this.renderRow }
				/>

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
