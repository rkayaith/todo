import React, { Component } from 'react'
import {
	View, TouchableNativeFeedback, TouchableWithoutFeedback,
	StatusBar as RNStatusBar, Modal as RNModal, BackAndroid as RNBackAndroid,
} from 'react-native'

import VectorIcon from 'react-native-vector-icons/MaterialIcons'

import { style, colors } from '../styles'

export const Toolbar = ({ style, ...props }) => (
	<VectorIcon.ToolbarAndroid
		style={[ styles.toolbar, style ]}
		titleColor={ colors.white }
		contentInsetStart={ 16 }
		{ ...props }
	/>
)

export const StatusBar = (props) => (
	<RNStatusBar
		animated={ true }
		backgroundColor={ colors.statusbar }
		{ ...props }
	/>
)

export class BackAndroid extends Component {
	componentDidMount() {
		RNBackAndroid.addEventListener('hardwareBackPress', this.onPress)
	}
	componentWillUnmount() {
		RNBackAndroid.removeEventListener('hardwareBackPress', this.onPress)
	}
	render() { return null }
	onPress = () => {
		this.props.onPress && this.props.onPress()
		return !this.props.exitApp
	}
}

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

export const Modal = ({ style, children, ...props }) => (
	<RNModal
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
	</RNModal>
)

const styles = style({
	modal: {
		flex: 1,
		backgroundColor: colors.alpha(colors.black, 0.5),
		justifyContent: 'center',
		alignItems: 'center',
	},
})
