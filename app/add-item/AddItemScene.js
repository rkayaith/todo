import React from 'react'
import { View, Text } from 'react-native'

import styles from '../styles'
import { Toolbar } from '../components'

export default AddItemScene = (props) => (
	<View style={ styles.scene }>
		<Toolbar
			title="Add Item"
			navIconName="arrow-back"
			onIconClicked={ props.navigator.pop }
		/>
		<Text>Add Item Scene</Text>
	</View>
)
