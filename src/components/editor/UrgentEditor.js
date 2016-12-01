import React, { Component } from 'react'
import { View, Text, StyleSheet, DatePickerAndroid, TimePickerAndroid } from 'react-native'

import { Touchable, Icon, Modal } from '../common'

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
				<View style={ [styles.contentContainer, { marginTop: 16 }] }>
					<Text style={ styles.contentLabel }>Urgent</Text>
					<View style={ styles.urgentContainer }>
						{ this.content(this.props.item.urgent) }
					</View>
				</View>
				<Touchable
					hitSlop={ 10 }
					onPress={ () => this.showPicker('modal') }>
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
						<View style={ styles.modalHeader }>
							<Text style={ styles.modalHeaderText }>Item will be urgent:</Text>
						</View>
						<Touchable
							style={ styles.modalOption }
							borderless={ false }
							onPress={ () => this.change(-Infinity)}>
							<Text style={ styles.modalText }>Now</Text>
						</Touchable>
						<Touchable
							style={ styles.modalOption }
							borderless={ false }
							onPress={ () => this.change(Infinity)}>
							<Text style={ styles.modalText }>Never</Text>
						</Touchable>
						<Touchable
							style={ styles.modalOption }
							borderless={ false }
							onPress={ () => this.showPicker('datetime') }>
							<Text style={ styles.modalText }>Pick date & time</Text>
						</Touchable>
					</View>
				</Modal>
			</View>
		)
	}

	content = (timestamp) => {

		let Button = (props) => {
			return (
				<Touchable
					style={ styles.urgentButton }
					onPress={ () => this.showPicker(props.picker) }>
					<Text style={ styles.urgentText }>{ props.text }</Text>
					<Icon style={ styles.arrow } name="arrow-drop-down" iconSize={ 15 }/>
				</Touchable>
			)
		}

		switch (timestamp) {
			case -Infinity: return <Button text="Now" picker='modal'/>
			case Infinity: return <Button text="Never" picker='modal'/>
			default: return [
				<Button key='date' text={ this.parseDate(timestamp) } picker='date'/>,
				<Button key='time' text={ this.parseTime(timestamp) } picker='time'/>,
			]
		}
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
			case 'modal':
				this.setState({ modalVisible: true }); break
			case 'date':
				done(await showDatePicker(date)); break
			case 'time':
				done(await showTimePicker(date)); break
			case 'datetime':
				date = await(showDatePicker(date))
				if (date === null) return
				done(await showTimePicker(new Date(date)))
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
	urgentContainer: {
		flexDirection: 'row',
	},
	urgentButton: {
		flexDirection: 'row',
		height: 48,
		alignItems: 'center',
		marginRight: 5,
		marginTop: -16,

	},
	urgentText: {
		...editorstyle.contentText,
		height: 20,
		borderBottomWidth: 1,
		borderBottomColor: colors.alpha(colors.black, 0.12),
	},
	arrow: {
		height: 20,
		borderBottomWidth: 1,
		borderBottomColor: colors.alpha(colors.black, 0.12),
	},
	modal: {
		paddingVertical: 8,
	},
	modalHeader: {
		height: 48,
		justifyContent: 'center',
	},
	modalHeaderText: {
		...style.text,
		fontSize: 22,
		paddingHorizontal: 24,
		fontFamily: 'sans-serif-medium',
	},
	modalOption: {
		height: 48,
		justifyContent: 'center',
		paddingHorizontal: 24,
	},
	modalText: {
		...style.text,
		fontSize: 16,
	}
})
