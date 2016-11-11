import React, { Component } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'

import TodoListSection from './TodoListSection'

import { colors } from '../styles'

import * as Item from '../../modules/Item'
import * as Data from '../../modules/Data'

export default class TodoList extends Component {

	render() {

		let fns = {
			changeItem: this.props.changeItem,
			removeItem: this.props.removeItem,
			goToEditItem: this.props.goToEditItem,
		}

		return (
			<ScrollView>
				<TodoListSection
					{ ...fns }
					level={ 4 }
					renderRow={ this.renderRow }
					data={ Data.filter(this.props.data, item => Item.level(item) === 4) }
				/>
				<TodoListSection
					{ ...fns }
					level={ 3 }
					renderRow={ this.renderRow }
					data={ Data.filter(this.props.data, item => Item.level(item) === 3) }
				/>
				<TodoListSection
					{ ...fns }
					level={ 2 }
					renderRow={ this.renderRow }
					data={ Data.filter(this.props.data, item => Item.level(item) === 2) }
				/>
				<TodoListSection
					{ ...fns }
					level={ 1 }
					renderRow={ this.renderRow }
					data={ Data.filter(this.props.data, item => Item.level(item) === 1) }
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
