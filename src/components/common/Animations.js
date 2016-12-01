import React, { Component } from 'react'
import { View, Animated } from 'react-native'

import { colors } from '../styles'

export class ColorTransition extends Component {
	constructor(props) {
		super(props)
		this.state = {
			animValue: new Animated.Value(0),
			bgPrev: colors.alpha(props.color, 0),
			bgNext: props.color,
		}
	}
	componentDidMount() {
		this.animateBg(this.props)
	}
	componentWillReceiveProps(props) {
		this.animateBg(props)
	}
	render() {
		let backgroundColor = this.state.animValue.interpolate({
			inputRange: [0, 1],
			outputRange: [this.state.bgPrev, this.state.bgNext],
		})
		return (
			<View style={ this.props.style }>
				<Animated.View style={{ backgroundColor }}>
					{ this.props.children }
				</Animated.View>
			</View>
		)
	}
	animateBg = (props) => {
		if (!props.color) return
		this.state.animValue.stopAnimation(value => {
			// find the current background color based on the values it was animating between
			// and how far it got into the animation
			let animValue = new Animated.Value(0)
			let bgPrev = interpolate(this.state.bgPrev, this.state.bgNext, value)
			let bgNext = props.color

			// Start a new animation between the current background color and
			this.setState({ animValue, bgPrev, bgNext })
			Animated.timing(animValue, { toValue: 1, duration: props.duration }).start()
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
}
