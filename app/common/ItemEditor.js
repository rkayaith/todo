import React, { Component } from 'react'
import {
	View, Text, TextInput, Switch, StyleSheet,
	Picker, DatePickerAndroid, TimePickerAndroid,
} from 'react-native'

import { CheckBox } from '../components'
import { style, colors } from '../styles'

export default class ItemEditor extends Component {
	constructor(props) {
		super(props)
		this.state = this.stateFromProps(props)
	}

	componentWillReceiveProps(props) {
		this.setState(this.stateFromProps(props))
	}

	render() {
		// the static picker items
		let items = [
			{ label: "Now", value: -Infinity },
			{ label: "Never", value: Infinity },
			{ label: "Custom", value: "custom_static" },
		]

		if (this.state.selectedValue === "custom") {
			// a custom date is selected, so we add a new picker item and
			// stringify the date to use it as the label
			items = [{ label: this.parseDate(this.props.item.urgent), value: "custom" }].concat(items)
		}

		return (
			<View>
				<View style={ styles.row }>
					<Text>{ JSON.stringify(this.props.item) }</Text>
				</View>

				<View style={ styles.row }>
					<TextInput
						style={ [styles.text, styles.input] }
						value={ this.props.item.text }
						placeholder="Item Text"
						onChangeText={ text => this.props.change({ text }) }
					/>
				</View>

				<View style={ styles.row }>
					<Text style={ styles.text }>Checked</Text>
					<CheckBox
						size={ 50 }
						value={ this.props.item.checked }
						onValueChange={ checked => this.props.change({ checked }) }
					/>
				</View>

				<View style={ styles.row }>
					<Text style={ styles.text }>Important</Text>
					<CheckBox
						size={ 50 }
						value={ this.props.item.important }
						onValueChange={ important => this.props.change({ important }) }
					/>
				</View>

				<View style={ styles.row }>
					<Text style={ styles.text }>Urgent</Text>
					<Picker
						mode='dropdown'
						style={ styles.picker }
						selectedValue={ this.state.selectedValue }
						onValueChange={ this.onValueChange }>
						{ items.map(props => <Picker.Item key={ props.label } { ...props }/>) }
					</Picker>
				</View>
			</View>
		)
	}

	onValueChange = async (value) => {
		// throw out bogus calls
		if (value === this.state.selectedValue) return
		// if one of the custom options are selected, show the date and time pickers
		if (value === "custom" || value === "custom_static") {
			this.setState({ selectedValue: "custom_static" })
			value = await showPickers.apply(this)
		}
		this.props.change({ urgent: value })

		async function showPickers() {
			let date = new Date(this.props.item.urgent)
			if (isNaN(date.getTime())) {
				// current selected date isn't a valid date, default to today's date
				date = new Date()
			}

			var { action, year, month, day } = await DatePickerAndroid.open({ date })
			if (action === DatePickerAndroid.dismissedAction) return this.props.item.urgent

			var { action, hour, minute } = await TimePickerAndroid.open({
				hour: date.getHours(), minute: date.getMinutes(),
			})
			if (action === TimePickerAndroid.dismissedAction) return this.props.item.urgent

			return Date.UTC(year, month, day, hour, minute)
		}
	}

	stateFromProps = (props) => {
		if (props.item.urgent === Infinity || props.item.urgent === -Infinity) {
			return { selectedValue: props.item.urgent }
		}
		return { selectedValue: "custom" }
	}

	parseDate = (dateNum) => {
		return new Date(dateNum).toLocaleString('en', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		})
	}
}

const styles = StyleSheet.create({
	...style,
	row: {
		height: 50,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: colors.grey200,
		paddingHorizontal: 12,
		marginHorizontal: 12,
	},
	picker: {
		width: 250,
	},
	input: {
		flex: 1
	}
})
