import React, { Component } from 'react'
import { View, Text, TextInput, Switch, StyleSheet, DatePickerAndroid, TimePickerAndroid } from 'react-native'

import { Picker } from '../components'
import { style, colors } from '../styles'

export default class ItemEditor extends Component {
	constructor(props) {
		super(props)
		this.state = { ...props.item }
	}

	componentWillReceiveProps(props) {
		this.state = { ...props.item }
	}

	render() {
		// the picker item that will be selected
		let selectedValue
		// the static picker items
		let items = [
			{ label: "Now", value: -Infinity },
			{ label: "Never", value: Infinity },
			{ label: "Custom", value: "custom_static" },
		]

		if (this.state.urgent === Infinity || this.state.urgent === -Infinity) {
			// Infinity (Never) and -Infinity (Now) are both static picker items that we can select
			selectedValue = this.state.urgent
		} else {
			// a custom date is selected, so we add a new picker item and
			// stringify the date to use it as the label
			selectedValue = "custom"
			items = [{ label: this.parseDate(this.state.urgent), value: "custom" }].concat(items)
		}

		return (
			<View>
				<View style={ styles.row }>
					<Text>{ JSON.stringify(this.state) }</Text>
				</View>

				<View style={ styles.row }>
					<TextInput
						style={ [styles.text, styles.input] }
						value={ this.state.text }
						placeholder="Item Text"
						onChangeText={ text => this.setState({ text }) }
					/>
				</View>

				<View style={ styles.row }>
					<Text style={ styles.text }>Checked</Text>
					<Switch
						value={ this.state.checked }
						onValueChange={ checked => this.setState({ checked }) }
					/>
				</View>

				<View style={ styles.row }>
					<Text style={ styles.text }>Important</Text>
					<Switch
						value={ this.state.important }
						onValueChange={ important => this.setState({ important }) }
					/>
				</View>

				<View style={ styles.row }>
					<Text style={ styles.text }>Urgent</Text>
					<Picker
						mode='dropdown'
						style={ styles.picker }
						selectedValue={ selectedValue }
						onValueChange={ this.valueChange }>
						{ items.map(props => <Picker.Item key={ props.label } { ...props }/>) }
					</Picker>
				</View>

				<View style={ styles.row }>
					<Text style={ styles.text } onPress={ this.submit }>Submit</Text>
				</View>
			</View>
		)
	}

	valueChange = async (value) => {
		// if one of the custom options are selected, show the date and time pickers
		if (value === "custom" || value === "custom_static") {
			value = await showPickers.apply(this)
		}
		this.setState({ urgent: value })

		async function showPickers() {
			let date = new Date(this.state.urgent)
			if (isNaN(date.getTime())) {
				// current state isn't a valid date, default to today's date
				date = new Date()
			}

			var { action, year, month, day } = await DatePickerAndroid.open({ date })
			if (action === DatePickerAndroid.dismissedAction) return this.state.urgent

			var { action, hour, minute } = await TimePickerAndroid.open({
				hour: date.getHours(), minute: date.getMinutes(),
			})
			if (action === TimePickerAndroid.dismissedAction) return this.state.urgent

			return Date.UTC(year, month, day, hour, minute)
		}
	}

	submit = () => {
		let item = { ...this.state }
		// Replace -Infinity with the current date when submitting
		if (item.urgent === -Infinity) {
			item.urgent = Date.now()
		}
		this.props.submit(item)
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
		paddingHorizontal: 24,
	},
	picker: {
		width: 250,
	},
	input: {
		flex: 1
	}
})
