import Icon from 'react-native-vector-icons/MaterialIcons'
import React, { Component } from 'react'
import { View, StatusBar as ReactStatusBar, StyleSheet, TouchableNativeFeedback, TouchableOpacity } from 'react-native'

import { colors } from './styles'

export const Toolbar = ({ style, ...props }) => (
	<Icon.ToolbarAndroid
		style={[ styles.toolbar, style ]}
		elevation={ 4 }
		contentInsetStart={ 16 }
		{ ...props }
	/>
)

export const StatusBar = (props) => (
	<ReactStatusBar
		animated={ true }
		backgroundColor={ colors.grey400 }
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

export const Button = ({ size, style, children, ...props}) => (
	<Touchable style={ [styles.button, { width: size, height: size }, style] } {...props }>
		{ children }
	</Touchable>
)

export const CheckBox = ({ value, onValueChange, ...props }) => (
	<Button onPress={ () => onValueChange && onValueChange(!value) } { ...props }>
		<Icon
			size={ 20 }
			color={ colors.grey800 }
			name={ value ? "check-box" : "check-box-outline-blank" }
		/>
	</Button>
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
					<View style={ [styles.actionButton, { backgroundColor: colors.accentColor }] }>
						<Icon name={ icon } color='white' size={ 24 }/>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
}

export { Icon }

const styles = StyleSheet.create({
	toolbar: {
		height: 56,
		backgroundColor: colors.grey50,
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	actionButton: {
		height: 56, width: 56, borderRadius: 56/2, backgroundColor: "white",
		alignItems: 'center', justifyContent: 'center',
	},
	actionButtonLayout: {
		position: 'absolute', bottom: 16, right: 16,
	}
})
