import React, { Component } from 'react'
import { View, ScrollView, KeyboardAvoidingView, Text, TextInput, StyleSheet } from 'react-native'

import UrgentEditor from './UrgentEditor'

import { style, colors } from '../styles'
import { editorstyle } from './editorstyles'
import { TextInputExpanding, Touchable, CheckBox, Icon } from '../components'

import * as Item from '../../modules/Item'

export default class ItemEditor extends Component {

	render() {

		return (
			<View style={ styles.container } >

				<TextInputExpanding
					style={ styles.title }
					value={ this.props.item.text }
					placeholder="Item Text"
					underlineColorAndroid={ colors.alpha(colors.black, 0.1) }
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

				<TextInputExpanding
					style={ styles.note }
					value={ this.props.item.note }
					placeholder="Note"
					underlineColorAndroid={ colors.alpha(colors.black, 0.1) }
					onChangeText={ note => this.props.change({ note }) }
				/>

			</View>
		)
	}
}

const icon_size = 45
const styles = StyleSheet.create({
	...style,
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
		marginHorizontal: 12,
	},
	note: {
		...style.text,
		fontSize: 18,
		marginBottom: 8,
		marginTop: 24,
		marginHorizontal: 12,
	}
})
