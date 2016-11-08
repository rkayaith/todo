import React, { Component } from 'react'
import { View, ScrollView, Text, ListView, StyleSheet } from 'react-native'

import { style, colors } from '../styles'
import { Icon } from '../components'
import TodoItem from './TodoItem'

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
					style={{ backgroundColor: colors.level4 }}
				/>
				<TodoListSection
					data={ urgent_notimportant }
					title="Urgent, Not Important"
					icon="schedule"
					iconSize={ 22 }
					renderRow={ this.renderRow }
					style={{ backgroundColor: colors.level3 }}
				/>
				<TodoListSection
					data={ noturgent_important }
					title="Not Urgent, Important"
					icon="priority-high"
					iconSize={ 20 }
					renderRow={ this.renderRow }
					style={{ backgroundColor: colors.level2 }}
				/>
				<TodoListSection
					data={ noturgent_notimportant }
					title="Not Urgent, Not Important"
					icon="done"
					iconSize={ 20 }
					renderRow={ this.renderRow }
					style={{ backgroundColor: colors.level1 }}
				/>

				<View
					// empty footer so scrolling is enabled when items are under the action button
					style={ styles.footer }
				/>
			</ScrollView>
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
			<View style={ styles.card } >
				<View style={ [styles.header, this.props.style] }>
					<Icon name={ this.props.icon } color='white' size={ 36 } iconSize={ this.props.iconSize } />
					<Text style={ styles.headerText }>{ this.props.title }</Text>
				</View>
				<ListView
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

		// LayoutAnimation doesn't play nice with multiple sections, so merge everything into one
		// TODO: clean this up if we're sticking with LayoutAnimation
		data.all = {}
		for (id in data.unchecked) {
			data.all[id] = data.unchecked[id]
			delete data.unchecked[id]
		}
		for (id in data.checked) {
			data.all[id] = data.checked[id]
			delete data.checked[id]
		}
		delete data.unchecked
		delete data.checked

		return data
	}

}

const styles = StyleSheet.create({
	header: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	headerText: {
		...style.text,
		fontSize: 15,
		color: 'white',
		fontFamily: 'sans-serif-medium',
		marginLeft: 5,
		marginBottom: 1,
	},
	card: {
		marginTop: 16,
		marginHorizontal: 16,
		backgroundColor: 'white',
		elevation: 2,
	},
	footer: {
		height: 80,
	},
})
