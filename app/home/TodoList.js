import React, { Component } from 'react'
import { View, Text, ListView, StyleSheet } from 'react-native'

import TodoItem from './TodoItem'

export default class TodoList extends Component {

	constructor(props) {
		super(props)
		let ds = new ListView.DataSource({
			rowHasChanged: (a, b) => a !== b
		}).cloneWithRows(props.data)

		this.state = { ds }
	}

	componentWillReceiveProps(props) {
		this.setState({ ds: this.state.ds.cloneWithRows(props.data) })
	}

	render() {
		return (
			<View>
				<ListView
					dataSource={ this.state.ds }
					renderRow={ this.renderRow }
				/>
			</View>
		)
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
