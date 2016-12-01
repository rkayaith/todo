import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

import { Icon } from './Icons'
import { Touchable } from './RNWrappers'

import { colors } from '../styles'

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

const styles = StyleSheet.create({
	actionButton: {
		height: 56, width: 56, borderRadius: 56/2,
	},
	actionButtonLayout: {
		position: 'absolute', bottom: 16, right: 16, backgroundColor: colors.accentColor,
	},
})
