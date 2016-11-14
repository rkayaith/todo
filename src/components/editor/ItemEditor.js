import React, { Component } from 'react'
import {
	View, Text, TextInput, Switch, StyleSheet, Animated, LayoutAnimation,
	Picker, DatePickerAndroid, TimePickerAndroid,
} from 'react-native'

import { style, colors } from '../styles'
import { CheckBox, Icon } from '../components'

import * as Item from '../../modules/Item'

export default class ItemEditor extends Component {

	state = {
		cardValue: new Animated.Value(0),
		bgValue: new Animated.Value(0),
		bgPrev: style.scene.backgroundColor,
		bgNext: style.scene.backgroundColor,
		inputHeight: 0,
	}

	constructor(props) {
		super(props)
		this.state = { ...this.state, ...this.stateFromProps(props) }
	}

	componentDidMount() {
		this.animateBg(750)
		Animated.timing(this.state.cardValue, { toValue: 1, duration: 400 }).start()
	}

	componentWillReceiveProps(props) {
		this.setState(this.stateFromProps(props), this.animateBg)
	}

	render() {

		let backgroundColor = this.state.bgValue.interpolate({
			inputRange: [0, 1],
			outputRange: [this.state.bgPrev, this.state.bgNext],
		})

		let transform = [{ scaleY: this.state.cardValue }]

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
				<Animated.View style={ [styles.card, { transform }] }>

					<TextInput
						style={ [styles.text, styles.input, { height: this.state.inputHeight }] }
						value={ this.props.item.text }
						placeholder="Item Text"
						multiline={ true }
						onChangeText={ text => this.props.change({ text }) }
						onContentSizeChange={ ({ nativeEvent }) => {
							LayoutAnimation.easeInEaseOut()
							this.setState({ inputHeight: nativeEvent.contentSize.height })
						}}
					/>

					<View style={ styles.row }>
						<View style={ styles.label }>
							<Icon { ...Item.icon(1) } size={ icon_size } iconSize={ 20 }/>
							<Text style={ styles.text }>Done</Text>
						</View>
						<CheckBox
							size={ icon_size }
							value={ this.props.item.checked }
							onValueChange={ checked => this.props.change({ checked }) }
						/>
					</View>

					<View style={ styles.row }>
						<View style={ styles.label }>
							<Icon { ...Item.icon(2) } size={ icon_size } iconSize={ 20 }/>
							<Text style={ styles.text }>Important</Text>
						</View>
						<CheckBox
							size={ icon_size }
							value={ this.props.item.important }
							onValueChange={ important => this.props.change({ important }) }
						/>
					</View>

					<View style={ styles.row }>
						<View style={ styles.label }>
							<Icon { ...Item.icon(4) } size={ icon_size } iconSize={ 20 }/>
							<Text style={ styles.text }>Urgent</Text>
						</View>
						<Picker
							mode='dropdown'
							style={ styles.picker }
							selectedValue={ this.state.selectedValue }
							onValueChange={ this.onValueChange }>
							{ items.map(props => <Picker.Item key={ props.label } { ...props }/>) }
						</Picker>
					</View>

					{ this.props.children }
				</Animated.View>
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

			return new Date(year, month, day, hour, minute).getTime()
		}
	}

	stateFromProps = (props) => {
		if (props.item.urgent === Infinity || props.item.urgent === -Infinity) {
			return { selectedValue: props.item.urgent }
		}
		return { selectedValue: "custom" }
	}

	animateBg = (duration) => {

		this.state.bgValue.stopAnimation(value => {
			// find the current background color based on the values it was animating between
			// and how far it got into the animation
			let bgValue = new Animated.Value(0)
			let bgPrev = interpolate(this.state.bgPrev, this.state.bgNext, value)
			let bgNext = Item.color(this.props.item)
			// apply alpha if checked
			bgNext = colors.alpha(bgNext, this.props.item.checked ? 0.45 : 1)

			// Start a new animation between the current background color and
			this.setState({ bgValue, bgPrev, bgNext })
			Animated.timing(bgValue, { toValue: 1, duration: duration || 400 }).start()
		})

		function interpolate(color1, color2, interpValue) {
			color1 = color1.replace('#', '')
			color2 = color2.replace('#', '')
			// interpolate each section of the hex color value (#rrggbbaa)
			return '#' + [[0, 2], [2, 4], [4, 6], [6, 8]]
				.map(section => interp(color1, color2, interpValue, section))
				.join('')

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

const icon_size = 45
const styles = StyleSheet.create({
	...style,
	container: {
		padding: 16,
		flex: 1
	},
	card: {
		flex: 1,
		elevation: 2,
		backgroundColor: colors.white,
		paddingVertical: 12,
		paddingHorizontal: 24,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	label: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	picker: {
		marginRight: 10.5,
		width: 250,
	},
	input: {
		fontFamily: 'serif',
		fontSize: 24,
		marginBottom: 12,
	}
})
