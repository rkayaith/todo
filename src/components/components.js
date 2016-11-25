import VectorIcon from 'react-native-vector-icons/MaterialIcons'
import React, { Component } from 'react'
import {
	View, TextInput, Animated, TouchableNativeFeedback, TouchableWithoutFeedback,
	StatusBar as RCTStatusBar, Modal as RCTModal, LayoutAnimation, StyleSheet, KeyboardAvoidingView
} from 'react-native'

import { colors, style } from './styles'

export const Toolbar = ({ style, ...props }) => (
	<VectorIcon.ToolbarAndroid
		style={[ styles.toolbar, style ]}
		titleColor={ colors.white }
		contentInsetStart={ 16 }
		{ ...props }
	/>
)

export const StatusBar = (props) => (
	<RCTStatusBar
		animated={ true }
		backgroundColor={ colors.statusbar }
		{ ...props }
	/>
)

export const Touchable = ({	style, children, ripple, borderless, hitSlop, ...props }) => {
	borderless = typeof borderless == 'undefined' ? true : borderless
	hitSlop = hitSlop || {}
	if (typeof hitSlop === 'number') {
		hitSlop = { top: hitSlop, bottom: hitSlop, left: hitSlop, right: hitSlop }
	}
	return (
		<TouchableNativeFeedback
			hitSlop={{
				top: hitSlop.top || 0,
				bottom: hitSlop.bottom || 0,
				left: hitSlop.left || 0,
				right: hitSlop.right || 0,
			}}
			background={ TouchableNativeFeedback.Ripple(colors.alpha(ripple, 0.26), borderless) }
			{ ...props } >
			<View style={ style }>{ children }</View>
		</TouchableNativeFeedback>
	)
}


export const Icon = ({ size, iconSize, style, alpha, color, ...props }) => (
	<View
		style={ [{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style] }>
		<VectorIcon
			color={ colors.alpha(color || colors.grey800, alpha) }
			size={ iconSize }
			{ ...props }
		/>
	</View>
)

export const CheckBox = ({ value, ripple, hitSlop, borderless, onValueChange, ...props }) => (
	<Touchable
		ripple={ ripple }
		hitSlop={ hitSlop }
		borderless={ borderless }
		onPress={ () => onValueChange && onValueChange(!value) } >
		<Icon
			{ ...props }
			iconSize={ 20 }
			name={ value ? "check-box" : "check-box-outline-blank" }
		/>
	</Touchable>
)

export class ActionButton extends Component {
	state = { pressed: false }
	render() {
		let { icon, ...props } = this.props
		return (
			<View style={[
				styles.actionButton,
				styles.actionButtonLayout,
				{ elevation: this.state.pressed ? 12 : 6 } ]}>
				<Touchable
					{ ...props }
					ripple={ colors.white }
					onPressIn={ () => this.setState({ pressed: true }) }
					onPressOut={ () => this.setState({ pressed: false }) } >
					<Icon
						name={ icon }
						color={ colors.white }
						style={ styles.actionButton }
						iconSize={ 24 }
					/>
				</Touchable>
			</View>
		)
	}
}

export class TextInputExpanding extends Component {
	state = { height: -1 }
	render() {
		return (
			<View>
				<TextInput
					{ ...this.props }
					multiline={ true }
					style={ [this.props.style, { height: this.state.height }] }
					onContentSizeChange={ ({ nativeEvent }) => {
						if (this.state.height !== -1) {
							LayoutAnimation.easeInEaseOut()
						}
						this.setState({ height: nativeEvent.contentSize.height })
						this.props.onContentSizeChange && this.props.onContentSizeChange()
					}}
				/>
			</View>
		)
	}
}

export const Modal = ({ style, children, ...props }) => (
	<RCTModal
		{ ...props }
		animationType="fade"
		transparent={ true }>
		<TouchableWithoutFeedback onPress={ props.onRequestClose }>
			<View style={ [styles.modal, style] } >
				<TouchableWithoutFeedback onPress={ () => {} }>
					<View style={ [styles.card, { elevation: 12 }] }>
						{ children }
					</View>
				</TouchableWithoutFeedback>
			</View>
		</TouchableWithoutFeedback>
	</RCTModal>
)

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

const styles = StyleSheet.create({
	...style,
	actionButton: {
		height: 56, width: 56, borderRadius: 56/2,
	},
	actionButtonLayout: {
		position: 'absolute', bottom: 16, right: 16, backgroundColor: colors.accentColor,
	},
	modal: {
		flex: 1,
		// backgroundColor: colors.white,
		backgroundColor: colors.alpha(colors.black, 0.5),
		// elevation: 12,
		justifyContent: 'center',
		alignItems: 'center',
	}
})
