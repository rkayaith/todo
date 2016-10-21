import { ToolbarAndroid } from 'react-native-vector-icons/MaterialIcons'
import React from 'react'

import styles from './styles'

export const Toolbar = ({ style, ...props }) => (
	<ToolbarAndroid
		{ ...props }
		style={[ styles.toolbar, style ]}
		elevation={ 4 }
		contentInsetStart={ 16 }
	/>
)
