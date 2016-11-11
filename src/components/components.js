import VectorIcon from 'react-native-vector-icons/MaterialIcons'
import React, { Component } from 'react'
import { View, StatusBar as ReactStatusBar, StyleSheet, TouchableNativeFeedback } from 'react-native'

import { colors } from './styles'

export const Toolbar = ({ style, ...props }) => (
	<VectorIcon.ToolbarAndroid
		style={[ styles.toolbar, style ]}
		elevation={ 4 }
		contentInsetStart={ 16 }
		{ ...props }
	/>
)

export const StatusBar = (props) => (
	<ReactStatusBar
		animated={ true }
		backgroundColor={ colors.statusbar }
		{ ...props }
	/>
)

export const Touchable = ({ style, children, ripple, borderless, ...props }) => (
	<TouchableNativeFeedback
		background={ TouchableNativeFeedback.Ripple(colors.alpha(ripple, 0.26), borderless) }
		{ ...props } >
		<View style={ style }>{ children }</View>
	</TouchableNativeFeedback>
)

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

export const CheckBox = ({ value, ripple, borderless, onValueChange, ...props }) => (
	<Touchable
		ripple={ ripple }
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
					borderless={ true }
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

const styles = StyleSheet.create({
	toolbar: {
		height: 56,
		backgroundColor: colors.toolbar,
	},
	actionButton: {
		height: 56, width: 56, borderRadius: 56/2,
	},
	actionButtonLayout: {
		position: 'absolute', bottom: 16, right: 16, backgroundColor: colors.accentColor,
	}
})
