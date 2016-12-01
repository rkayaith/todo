import React, { Component } from 'react'
import { View, ScrollView, Text, LayoutAnimation } from 'react-native'

import TodoList from '../todolist/TodoList'

import styles, { colors } from '../styles'
import { Toolbar, StatusBar, ActionButton } from '../common'

import * as Data from '../../modules/Data'
import * as Item from '../../modules/Item'

export default class HomeScene extends Component {

	constructor(props) {
		super(props)
		this.state = { data: props.data }
	}

	componentWillReceiveProps(props) {
		if (props.focused) {
			// Only update data while the scene is focused
			// This causes a nice update animation when the
			// scene becomes focused (e.g. after editing an item)
			LayoutAnimation.easeInEaseOut()
			this.setState({ data: props.data })
		}
	}

	render() {
		return (
			<View style={ styles.scene }>
				<StatusBar backgroundColor={ colors.primaryColorDark }/>
				<Toolbar
					title='Todo List'
					style={{ backgroundColor: colors.primaryColor }}
					overflowIconName="more-vert"
					actions={[
						{ title: "Check all items", iconName: "done-all", show: 'always' },
						{ title: "Remove checked items", iconName: "delete-sweep", show: 'always' },
						{ title: "Load mock data", show: 'never' },
					]}
					onActionSelected={ action => {
						switch (action) {
							case 0:
								// check all items in the list
								return this.props.changeItem(
									Data.keys(this.state.data),	{ checked: true }
								)
							case 1:
								// remove all checked items in the list
								return this.props.removeItem(
									Data.keys(Data.filter(this.state.data, Item.isChecked))
								)
							case 2:
								return this.props.resetData()
						}
					}}
				/>
				<TodoList
					data={ this.state.data }
					changeItem={ this.props.changeItem }
					removeItem={ this.props.removeItem }
					notifSettings={ this.props.notifSettings }
					setNotifSettings={ this.props.setNotifSettings }
					goToEditItem={ this.goToEditItem }
				/>

				<ActionButton icon="add" onPress={ this.goToAddItem } />
			</View>
		)
	}

	goToAddItem = () => {
		this.props.navigator.push({ id: 'add-item' })
	}

	goToEditItem = (itemId) => {
		this.props.navigator.push({ id: 'edit-item', itemId })
	}
}
