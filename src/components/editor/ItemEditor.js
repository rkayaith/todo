import React, { Component } from 'react'
import { View, ScrollView, Text, TextInput } from 'react-native'

import UrgentEditor from './UrgentEditor'

import { style, colors } from '../styles'
import { editorstyle } from './editorstyles'
import { ExpandingTextInput, Touchable, CheckBox, Icon } from '../common'

import * as Item from '../../modules/Item'

export default class ItemEditor extends Component {

	render() {

		return (
			<ScrollView
				style={ styles.container }
				keyboardShouldPersistTaps={ true }>

				<ExpandingTextInput
					lineHeight={ 29 }
					autoFocus={ this.props.focusTitle }
					autoCapitalize='sentences'
					style={ styles.title }
					value={ this.props.item.text }
					placeholder="Item Text"
					underlineColorAndroid={ colors.alpha(colors.black, 0.12) }
					onChangeText={ text => this.props.change({ text }) }
				/>

				<View style={ styles.contentRow }>
					<Icon style={ styles.contentIcon } { ...Item.icon(1) } iconSize={ 24 }/>
					<View style={ styles.contentContainer }>
						<Text style={ styles.contentLabel }>Done</Text>
					</View>
					<CheckBox
						style={ styles.contentAction }
						value={ this.props.item.checked }
						hitSlop={ 10 }
						onValueChange={ checked => this.props.change({ checked }) }
					/>
				</View>

				<View style={ styles.divider }/>

				<UrgentEditor
					item={ this.props.item }
					change={ this.props.change }
				/>

				<View style={ styles.contentRow }>
					<Icon style={ styles.contentIcon } { ...Item.icon(2) } iconSize={ 24 }/>
					<View style={ styles.contentContainer }>
						<Text style={ styles.contentLabel }>Important</Text>
					</View>
					<CheckBox
						style={ styles.contentAction }
						value={ this.props.item.important }
						hitSlop={ 10 }
						onValueChange={ important => this.props.change({ important }) }
					/>
				</View>

				<View style={ styles.divider }/>

				<ExpandingTextInput
					lineHeight={ 20 }
					style={ styles.note }
					value={ this.props.item.note }
					placeholder="Note"
					underlineColorAndroid={ colors.alpha(colors.black, 0.12) }
					onChangeText={ note => this.props.change({ note }) }
				/>

			</ScrollView>
		)
	}
}

const icon_size = 45
const styles = style({
	...editorstyle,
	divider: {
		height: 0,
		borderBottomWidth: 1,
		borderColor: colors.alpha(colors.black, 0.12),
		marginVertical: 4,
		marginLeft: 72,
		marginRight: 16,
	},
	container: {
		flex: 1,
		backgroundColor: colors.white,
	},
	title: {
		...style.text,
		fontFamily: 'sans-serif-medium',
		fontSize: 24,
		marginBottom: 8,
		marginTop: 24,
		marginHorizontal: 16,
	},
	note: {
		...style.text,
		fontSize: 18,
		marginBottom: 8,
		marginTop: 24,
		marginHorizontal: 16,
	}
})
