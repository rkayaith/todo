import React, { Component } from 'react'
import { View, Text, ListView, StyleSheet } from 'react-native'

import { colors } from '../styles'
import TodoItem from './TodoItem'

export default class TodoList extends Component {

	render() {
		// TODO: Test and fix scrolling behaviour
		let urgent_important = {}
		let urgent_notimportant = {}
		let noturgent_important = {}
		let noturgent_notimportant = {}


		for (id in this.props.data) {
			let item = this.props.data[id]
			if (item.urgent) {
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
			<View>
				<TodoListSection
					data={ urgent_important }
					title="Urgent, Important"
					renderRow={ this.renderRow }
					style={{ backgroundColor: colors.red100 }}
				/>
				<TodoListSection
					data={ urgent_notimportant }
					title="Urgent, Not Important"
					renderRow={ this.renderRow }
					style={{ backgroundColor: colors.orange100 }}
				/>
				<TodoListSection
					data={ noturgent_important }
					title="Not Urgent, Important"
					renderRow={ this.renderRow }
					style={{ backgroundColor: colors.yellow100 }}
				/>
				<TodoListSection
					data={ noturgent_notimportant }
					title="Not Urgent, Not Important"
					renderRow={ this.renderRow }
					style={{ backgroundColor: colors.green100 }}
				/>
			</View>
		)
	}

	renderRow = (item, sectionID, rowID) => {
		return (
			<TodoItem
				{ ...item }
				key={ rowID }
				change={ this.props.changeItem.bind(null, rowID) }
				delete={ this.props.deleteItem.bind(null, rowID) }
				edit={ this.props.goToEditItem.bind(null, rowID) }
			/>
		)
	}

}


class TodoListSection extends Component {
	constructor(props) {
		super(props)
		let ds = new ListView.DataSource({
			rowHasChanged: (a, b) => a !== b,
			sectionHeaderHasChanged: (a, b) => a !== b
		}).cloneWithRowsAndSections(this.sortData(props.data))

		this.state = { ds }
	}

	componentWillReceiveProps(props) {
		this.setState({ ds: this.state.ds.cloneWithRowsAndSections(this.sortData(props.data)) })
	}

	render() {
		return (
			<View>
				<Text style={ styles.sectionHeader }>{ this.props.title }</Text>
				<ListView
					style={ [styles.section, this.props.style] }
					dataSource={ this.state.ds }
					renderRow={ this.props.renderRow }
					enableEmptySections={ true }
				/>
			</View>
		)
	}

	sortData = (_data) => {
		let data = {
			unchecked: {},
			checked: {}
		}
		for (id in _data) {
			if (!_data[id].checked) {
				data.unchecked[id] = _data[id]
			} else {
				data.checked[id] = _data[id]
			}
		}
		return data
	}

}

const styles = StyleSheet.create({
	sectionHeader: {
		marginHorizontal: 20,
		marginTop: 5,
		fontSize: 12,
		fontWeight: 'bold'
	},
	section: {
		marginHorizontal: 16,
		elevation: 2
	}
})
