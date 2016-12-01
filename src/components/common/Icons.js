import React from 'react'
import { View } from 'react-native'

import VectorIcon from 'react-native-vector-icons/MaterialIcons'

import { colors } from '../styles'

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
