import React, { Component } from 'react'
import { View, ScrollView, Text, TextInput, Animated } from 'react-native'

import UrgentEditor from './UrgentEditor'

import { style, colors } from '../styles'
import { editorstyle } from './editorstyles'
import { StatusBar, ColorTransition, ExpandingTextInput, Touchable, CheckBox, Icon } from '../common'

import * as Item from '../../modules/Item'

export default class ItemEditor extends Component {
	state = {}
	render() {

		return (
			<ScrollView
				style={ styles.container }
				keyboardShouldPersistTaps={ true }>

				<StatusBar backgroundColor={ Item.colorDark(this.props.item) }/>

				<ColorTransition
					color={ Item.color(this.props.item) }
					duration={ 275 }
					value={ this.props.onColorChange }
				/>

				<ColorTransition
					color={ Item.colorDark(this.props.item) }
					duration={ 275 }
					value={ colorDark => this.setState({ colorDark }) }
				/>

				<Animated.Text
					style={ [styles.heading, { color: this.state.colorDark }] }>
					Title
				</Animated.Text>

				<ExpandingTextInput
					lineHeight={ 29 }
					autoFocus={ this.props.focusTitle }
					autoCapitalize='sentences'
					style={ styles.title }
					value={ this.props.item.text }
					placeholder="Write a task here"
					placeholderStyle={ styles.placeholder }
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

				<Animated.Text
					style={ [styles.heading, { color: this.state.colorDark }] }>
					Note
				</Animated.Text>

				<ExpandingTextInput
					lineHeight={ 20 }
					style={ styles.note }
					value={ this.props.item.note }
					placeholder="Enter a note"
					placeholderStyle={ styles.placeholder }
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
	container: {
		flex: 1,
		backgroundColor: colors.white,
		paddingHorizontal: 16,
	},
	divider: {
		height: 0,
		borderBottomWidth: 1,
		borderColor: colors.alpha(colors.black, 0.12),
		marginVertical: 4,
		marginLeft: 54,
	},
	heading: {
		...style.text,
		marginLeft: 4.5,
		marginTop: 24,
		marginBottom: -5,
	},
	title: {
		...style.text,
		fontFamily: 'sans-serif-medium',
		fontSize: 24,
		marginBottom: 8,
	},
	note: {
		...style.text,
		fontSize: 18,
		marginBottom: 48,
	}
})
