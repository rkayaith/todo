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
					renderSectionHeader={ this.renderSectionHeader }
					enableEmptySections={ true }
				/>
			</View>
		)
	}

	sortData = (data) => {
		// the id of an item is it's key in the data object
		return Object.keys(data).map(key => ({ item: data[key], id: key }))
			.sort((a, b) => {
				if (a.item.checked && !b.item.checked) return -1
				if (!a.item.checked && b.item.checked) return 1
				return 0
			})
			.reduce( (data, { item, id }) => {
				if (item.urgent) {
					if (item.important) {
						data['u-i'].push({ item, id })
					} else {
						data['u-!i'].push({ item, id })
					}
				} else {
					if (item.important) {
						data['!u-i'].push({ item, id })
					} else {
						data['!u-!i'].push({ item, id })
					}
				}
				return data
			}, { 'u-i': [], 'u-!i': [], '!u-i': [], '!u-!i': [] })
	}

	renderRow = ({ item, id }, sectionID, rowID) => {
		return (
			<TodoItem
				{ ...item }
				change={ this.props.changeItem.bind(null, id) }
				delete={ this.props.deleteItem.bind(null, id) }
				edit={ this.props.goToEditItem.bind(null, id) }
			/>
		)
	}

	renderSectionHeader = (sectionData, sectionId) => {
		let title
		switch (sectionId) {
			case 'u-i': title = "Urgent, Important"; break
			case 'u-!i': title = "Ugent, Not Important"; break
			case '!u-i': title = "Not Urgent, Important"; break
			case '!u-!i': title = "Not Urgent, Not Important"; break
		}
		return (
			<Text style={ styles.sectionHeader }>{ title }</Text>
		)
	}

}

const styles = StyleSheet.create({
	sectionHeader: {
		marginHorizontal: 20,
		marginTop: 5,
		fontSize: 12,
		fontWeight: 'bold'
	}
})
