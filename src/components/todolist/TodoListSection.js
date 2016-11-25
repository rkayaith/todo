import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import TodoItem from './TodoItem'

import { style, colors } from '../styles'
import { Icon, Touchable } from '../components'

import * as Item from '../../modules/Item'
import * as Data from '../../modules/Data'
import * as Notifications from '../../modules/Notifications'

export default class TodoListSection extends Component {

	render() {
		let isEmpty = Data.values(this.props.data).length === 0
		return (
			<View style={ [styles.container, styles.card] } >
				<View style={ [styles.header, isEmpty && style.card, { backgroundColor: Item.color(this.props.level) }] }>
					<Icon
						{ ...Item.icon(this.props.level) }
						size={ 36 }
						color={ colors.white }
						alpha={ CONTENT_ALPHA }
					/>
					<Text style={ styles.headerText }>{ Item.description(this.props.level) }</Text>
					<Touchable
						onPress={ () => this.props.setNotifEnabled(!this.props.notifEnabled) }
						ripple={ colors.white }>
						<Icon
							{ ...Notifications.icon(this.props.data, this.props.notifEnabled) }
							size={ 36 }
							iconSize={ 18 }
							color={ colors.white }
							alpha={ this.props.notifEnabled ? CONTENT_ALPHA : 0.75 }
						/>
					</Touchable>
				</View>
				<View>
					{ Data.values(this.props.data).map(this.renderRow) }
				</View>
			</View>
		)
	}

	renderRow = (item) => {
		return (
			<TodoItem
				{ ...item }
				key={ Item.id(item) }
				change={ this.props.changeItem.bind(null, Item.id(item)) }
				remove={ this.props.removeItem.bind(null, Item.id(item)) }
				edit={ this.props.goToEditItem.bind(null, Item.id(item)) }
			/>
		)
	}

}

const CONTENT_ALPHA = 0.87

const styles = StyleSheet.create({
	...style,
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		borderTopLeftRadius: style.card.borderRadius,
		borderTopRightRadius: style.card.borderRadius,
	},
	headerText: {
		...style.text,
		flex: 1,
		fontSize: 15,
		color: colors.alpha(colors.white, CONTENT_ALPHA),
		fontFamily: 'sans-serif-medium',
		marginLeft: 5,
		marginBottom: 1,
	},
	container: {
		marginTop: 16,
		marginHorizontal: 16,
	},
})
