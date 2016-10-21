import React from 'react'
import { View, Text } from 'react-native'
import { ToolbarAndroid } from 'react-native-vector-icons/MaterialIcons'

import styles from '../styles'
import { Toolbar } from '../components'

export default EditItemScene = (props) => (
	<View style={ styles.scene }>
		<Toolbar
			title="Edit Item"
			navIconName="arrow-back"
			onIconClicked={ props.navigator.pop }
		/>
		<Text>Edit Item Scene</Text>
		<Text>Item: { JSON.stringify(props.item) }</Text>
	</View>
)
