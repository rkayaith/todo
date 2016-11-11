import React, { Component } from 'react'
import { View, Text, ListView, StyleSheet } from 'react-native'

import TodoItem from './TodoItem'

import { style, colors } from '../styles'
import { Icon } from '../components'

import * as Item from '../../modules/Item'
import * as Data from '../../modules/Data'

export default class TodoListSection extends Component {
	constructor(props) {
		super(props)
		let ds = this.cloneDataSource(new ListView.DataSource({
			rowHasChanged: (a, b) => a !== b,
		}), props.data)

		this.state = { ds }
	}

	componentWillReceiveProps(props) {
		this.setState({ ds: this.cloneDataSource(this.state.ds, props.data) })
	}

	render() {
		return (
			<View style={ styles.card } >
				<View style={ [styles.header, { backgroundColor: Item.color(this.props.level) }] }>
					<Icon
						{ ...Item.icon(this.props.level) }
						size={ 36 }
						color={ colors.alpha(colors.white, 0.87) }
					/>
					<Text style={ styles.headerText }>{ Item.description(this.props.level) }</Text>
				</View>
				<ListView
					dataSource={ this.state.ds }
					renderRow={ this.renderRow }
					enableEmptySections={ true }
				/>
			</View>
		)
	}

	cloneDataSource = (ds, data) => {
		data = Data.sort(data, Item.sort)
		return ds.cloneWithRows(data)
	}

	renderRow = (item, sectionID, rowID) => {
		return (
			<TodoItem
				{ ...item }
				key={ rowID }
				change={ this.props.changeItem.bind(null, rowID) }
				remove={ this.props.removeItem.bind(null, rowID) }
				edit={ this.props.goToEditItem.bind(null, rowID) }
			/>
		)
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
		color: colors.alpha(colors.white, 0.87),
		fontFamily: 'sans-serif-medium',
		marginLeft: 5,
		marginBottom: 1,
	},
	card: {
		marginTop: 16,
		marginHorizontal: 16,
		backgroundColor: colors.white,
		elevation: 2,
	},
})
