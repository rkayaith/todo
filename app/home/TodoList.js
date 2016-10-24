import React, { Component } from 'react'
import { View, Text, ListView, StyleSheet } from 'react-native'

import TodoItem from './TodoItem'

export default class TodoList extends Component {

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
		// TODO: Test and fix scrolling behaviour
		return (
			<View>
				<ListView
					dataSource={ this.state.ds }
					renderRow={ this.renderRow }
					// renderSectionHeader={ (sectionData, sectionId) => <Text>{sectionId}</Text>}
				/>
			</View>
		)
	}

	sortData = (data) => {
		return data.sort((a, b) => {
			if (a.checked && !b.checked) return -1
			if (!a.checked && b.checked) return 1
			return 0
		}).reduce( (data, item, id) => {
			if (item.urgent) {
				if (item.important) {
					data['u-i'][id] = item
				} else {
					data['u-!i'][id] = item
				}
			} else {
				if (item.important) {
					data['!u-i'][id] = item
				} else {
					data['!u-!i'][id] = item
				}
			}
			return data
		}, { 'u-i': {}, 'u-!i': {}, '!u-i': {}, '!u-!i': {} })
	}

	renderRow = (data, sectionID, rowID) => {
		return (
			<TodoItem
				{ ...data }
				change={ this.props.changeItem.bind(null, rowID) }
				delete={ this.props.deleteItem.bind(null, rowID) }
				edit={ this.props.goToEditItem.bind(null, rowID, data) }
			/>
		)
	}

}
