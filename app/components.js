import VectorIcon from 'react-native-vector-icons/MaterialIcons'
import React, { Component } from 'react'
import { View, StatusBar as ReactStatusBar, StyleSheet, TouchableNativeFeedback, TouchableOpacity } from 'react-native'

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

export const Touchable = ({ style, children, ...props }) => (
	<TouchableNativeFeedback
		background={ TouchableNativeFeedback.Ripple() }
		{ ...props } >
		<View style={ style }>{ children }</View>
	</TouchableNativeFeedback>
)
// Touchable.Ripple = TouchableNativeFeedback.Ripple
// Touchable.SelectableBackgroundBorderless = TouchableNativeFeedback.SelectableBackgroundBorderless

export const Icon = ({ size, iconSize, style, ...props }) => (
	<View
		style={ [{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style] }>
		<VectorIcon
			size={ iconSize }
			{ ...props }
		/>
	</View>
)

export const CheckBox = ({ value, onValueChange, ...props }) => (
	<Touchable onPress={ () => onValueChange && onValueChange(!value) } >
		<Icon
			{ ...props }
			iconSize={ 20 }
			color={ colors.grey800 }
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
				<TouchableOpacity
					{ ...props }
					activeOpacity={ 0.75 }
					onPressIn={ () => this.setState({ pressed: true }) }
					onPressOut={ () => this.setState({ pressed: false }) }>
					<Icon
						name={ icon }
						color='white'
						iconSize={ 24 }
						style={ [styles.actionButton, { backgroundColor: colors.accentColor }] } />
				</TouchableOpacity>
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
		height: 56, width: 56, borderRadius: 56/2, backgroundColor: "white",
		alignItems: 'center', justifyContent: 'center',
	},
	actionButtonLayout: {
		position: 'absolute', bottom: 16, right: 16,
	}
})
