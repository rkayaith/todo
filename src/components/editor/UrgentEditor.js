import React, { Component } from 'react'
import { View, Text, StyleSheet, DatePickerAndroid, TimePickerAndroid, TouchableOpacity } from 'react-native'

import { Touchable, Icon, Modal } from '../components'

import { style, colors } from '../styles'
import { editorstyle } from './editorstyles'

import * as Item from '../../modules/Item'

export default class UrgentEditor extends Component {

	state = {
		modalVisible: false
	}

	render() {
		return (
			<View style={ styles.contentRow }>
				<Icon style={ styles.contentIcon } { ...Item.icon(3) } iconSize={ 24 }/>
				<View style={ styles.contentContainer }>
					<Text style={ styles.contentLabel }>Urgent</Text>
					{ this.contentText(this.props.item.urgent) }
				</View>
				<Touchable onPress={ () => this.setState({ modalVisible: true })}>
					<Icon
						style={ styles.contentAction }
						name="edit"
						iconSize={ 24 }
					/>
				</Touchable>

				<Modal
					onRequestClose={ () => this.setState({ modalVisible: false }) }
					visible={ this.state.modalVisible }>
					<View style={ styles.modal }>
						<Text style={ styles.modalHeader }>Item will be urgent:</Text>
						<Touchable style={ styles.modalOption } onPress={ () => this.change(-Infinity)}>
							<Text style={ styles.modalText }>Now</Text>
						</Touchable>
						<Touchable style={ styles.modalOption } onPress={ () => this.change(Infinity)}>
							<Text style={ styles.modalText }>Never</Text>
						</Touchable>
						<Touchable style={ styles.modalOption } onPress={ () => this.showPicker('datetime') }>
							<Text style={ styles.modalText }>Pick date & time</Text>
						</Touchable>
					</View>
				</Modal>
			</View>
		)
	}

	change = (urgent) => {
		this.setState({ modalVisible: false })
		this.props.change({ urgent })
	}

	showPicker = async (picker) => {
		this.setState({ modalVisible: false })

		let self = this
		let date = new Date(Item.urgentTime(this.props.item) || Date.now())

		switch (picker) {
			case 'date':
				done(await showDatePicker(date)); break
			case 'time':
				done(await showTimePicker(date)); break
			case 'datetime':
				date = await(showDatePicker(date))
				if (date === null) return
				done(await showTimePicker(new Date(date))); break
		}

		function done(date) {
			if (date !== null) {
				self.change(date)
			}
		}

		async function showDatePicker(date) {
			let { action, year, month, day } = await DatePickerAndroid.open({ date })
			if (action === DatePickerAndroid.dismissedAction) return null
			return date.setFullYear(year, month, day)
		}

		async function showTimePicker(date) {
			let { action, hour, minute } = await TimePickerAndroid.open({
				hour: date.getHours(), minute: date.getMinutes(),
			})
			if (action === TimePickerAndroid.dismissedAction) return null
			return date.setHours(hour, minute)
		}
	}

	contentText = (timestamp) => {
		if (timestamp === -Infinity) return <Text style={ styles.contentText }>Now</Text>
		if (timestamp === Infinity) return <Text style={ styles.contentText }>Never</Text>
		return (
			<View style={{ flexDirection: 'row', }}>
				<Touchable
					style={ [styles.dateContainer, ] }
					// hitSlop={{ top: 20, bottom: 20 }}
					onPress={ () => this.showPicker('date') }>
					<Text style={ styles.date }>{ this.parseDate(timestamp) }</Text>
					<Icon style={ styles.arrow } name="arrow-drop-down" iconSize={ 15 }/>
				</Touchable>
				<Touchable
					style={ styles.dateContainer }
					onPress={ () => this.showPicker('time') }>
					<Text style={ styles.date }>{ this.parseTime(timestamp) }</Text>
					<Icon  style={ styles.arrow } name="arrow-drop-down" iconSize={ 15 }/>
				</Touchable>
			</View>
		)
	}

	parseDate = (timestamp) => {
		const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']
		const months = [
			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
			'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
		]

		let date = new Date(timestamp)
		let dayName = days[date.getDay()]
		let month = months[date.getMonth()]
		let day = date.getDate()
		let year = date.getFullYear() == new Date().getFullYear() ? '' : ', ' + date.getFullYear()
		return dayName + ', ' + month + ' ' + day + year
	}

	parseTime = (timestamp) => {
		let date = new Date(timestamp)
		let hour = date.getHours()
		let minute = date.getMinutes()
		let period = hour < 12 ? 'AM' : 'PM'
		hour %= 12
		if (hour == 0) hour = 12
		if (minute < 10) minute = '0' + minute
		return hour + ':' + minute + ' ' + period
	}
}

const styles = StyleSheet.create({
	...style,
	...editorstyle,
	dateContainer: {
		flexDirection: 'row',
		// marginLeft: -3,
		// paddingLeft: 3,
		marginRight: 5,
		borderBottomWidth: 1,
		borderBottomColor: colors.alpha(colors.black, 0.1)
	},
	date: {
		...editorstyle.contentText,
	},
	arrow: {
	},
	modal: {
	},
	modalHeader: {
		...style.text,
		fontSize: 22,
		paddingHorizontal: 24,
		paddingVertical: 16,
		paddingBottom: 8,
		fontFamily: 'sans-serif-medium'
	},
	modalOption: {
		paddingHorizontal: 24,
		paddingVertical: 16,
		justifyContent: 'center'
	},
	modalText: {
		...style.text,
		fontSize: 16,
	}
})
