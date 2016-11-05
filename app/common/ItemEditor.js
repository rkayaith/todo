import React, { Component } from 'react'
import {
	View, Text, TextInput, Switch, StyleSheet, Animated,
	Picker, DatePickerAndroid, TimePickerAndroid,
} from 'react-native'

import { CheckBox } from '../components'
import { style, colors } from '../styles'

export default class ItemEditor extends Component {

	state = {
		bgValue: new Animated.Value(0),
		bgPrev: style.scene.backgroundColor,
		bgNext: style.scene.backgroundColor,
	}

	constructor(props) {
		super(props)
		this.state = { ...this.state, ...this.stateFromProps(props) }
	}

	componentDidMount() {
		this.animateBg()
	}

	componentWillReceiveProps(props) {
		this.setState(this.stateFromProps(props), this.animateBg)
	}

	render() {

		let backgroundColor = this.state.bgValue.interpolate({
			inputRange: [0, 1],
			outputRange: [this.state.bgPrev, this.state.bgNext],
		})

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
			<Animated.View style={ [styles.container, { backgroundColor }] }>
				<View style={ styles.card }>
					{/* <View style={ styles.row }>
						<Text>{ JSON.stringify(this.props.item) }</Text>
					</View> */}

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
			</Animated.View>
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

	animateBg = () => {

		this.state.bgValue.stopAnimation(value => {
			// find the current background color based on the values it was animating between
			// and how far it got into the animation
			let bgValue = new Animated.Value(0)
			let bgPrev = interpolate(this.state.bgPrev, this.state.bgNext, value)
			let bgNext = this.props.item.urgent < Date.now() ?
				(this.props.item.important ? colors.level4 : colors.level3) :
				(this.props.item.important ? colors.level2 : colors.level1)
			if (this.props.item.checked) {
				bgNext += toHex(255 * 0.65) 	// apply alpha if checked
			}

			// Start a new animation between the current background color and
			this.setState({ bgValue, bgPrev, bgNext })
			Animated.timing(bgValue, { toValue: 1, duration: 250 }).start()
		})

		function interpolate(color1, color2, interpValue) {
			color1 = color1.replace('#', '')
			color2 = color2.replace('#', '')
			// interpolate each section of the hex color value (#rrggbbaa)
			return '#' + [[0, 2], [2, 4], [4, 6], [6, 8]]
				.map(section => interp(color1, color2, interpValue, section))
				.join('')
		}

		function interp(hex1, hex2, interpValue, section) {
			let int1 = toInt(hex1.substring(...section))
			let int2 = toInt(hex2.substring(...section))
			return toHex(int1 + (int2 - int1) * interpValue)
		}
		function toInt(hex) {
			if (!hex) return 255 	// if alpha is omitted its value is 255
			return parseInt(hex, 16)
		}
		function toHex(int) {
			int = parseInt(int)
			let hex = int.toString(16)
			return hex.length > 1 ? hex : '0' + hex
		}
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
	container: {
		padding: 32,
		flex: 1
	},
	card: {
		flex: 1,
		elevation: 2,
		backgroundColor: 'white',
	},
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
