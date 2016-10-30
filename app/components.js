import Icon from 'react-native-vector-icons/MaterialIcons'
import React from 'react'

import styles from './styles'

export const Toolbar = ({ style, ...props }) => (
	<Icon.ToolbarAndroid
		{ ...props }
		style={[ styles.toolbar, style ]}
		elevation={ 4 }
		contentInsetStart={ 16 }
	/>
)
