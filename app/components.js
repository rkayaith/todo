import Icon from 'react-native-vector-icons/MaterialIcons'
import React, { Component } from 'react'
import { StatusBar as ReactStatusBar, StyleSheet } from 'react-native'

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

const styles = StyleSheet.create({
	toolbar: {
		height: 56,
		backgroundColor: colors.grey200,
	},
})
