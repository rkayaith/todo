import React, { Component } from 'react'
import { View, TextInput as RNTextInput } from 'react-native'

import { style, colors } from '../styles'

export const TextInput = ({ style, placeholderStyle, ...props }) => {
	return (
		<RNTextInput
			style={ [style, props.value.length == 0 && placeholderStyle] }
			{ ...props }
		/>
	)
}

export class ExpandingTextInput extends Component {
	state = { height: 0, width: 0, x: 0, y: 0 }
	render() {

		// props.lineHeight should be roughly the height of one line of text. This is used to
		// prevent text from appearing clipped before the input height can be increased
		// We have to increase the height of the input to do so, but this is minimized later
		let height = this.state.height + this.props.lineHeight

		// The underline is positioned such that it ignores
		// the extra height added by props.lineHeight
		let underlineStyle = [
			styles.underline,
			this.props.underlineColorAndroid && { borderColor: this.props.underlineColorAndroid },
			{
				top: this.state.height + this.state.y,
				left: this.state.x,
				width: this.state.width
			}
		]

		// Hide the extra added height using a negative bottom margin.
		// Don't use style.backgroundColor or it'll show
		let marginBottom = -1 * this.props.lineHeight

		return (
			<View style={{ marginBottom }}>
				<View style={ underlineStyle }/>
				<TextInput
					{ ...this.props }
					style={ [this.props.style, { height, textAlignVertical: 'top' }] }
					multiline={ true }
					underlineColorAndroid={ colors.transparent }
					onLayout={ this.onLayout }
					onChange={ (e) => {
						this.onContentSize(e)
						this.props.onChange && this.props.onChange(e)
					}}
					// onContentSizeChange is only used for setting initial height
					// Providing a value for this prop breaks automatic scrolling when text input
					// goes offscreen, so we provide null when it's no longer needed
					onContentSizeChange={ this.state.height == 0 ? this.onContentSize : null }
				/>
			</View>
		)
	}
	onContentSize = (e) => {
		let { height } = e.nativeEvent.contentSize
		// Don't bother with small height changes
		// (the height of an empty input is slightly taller than one with a single line)
		if (Math.abs(height - this.state.height) > 0.5 * this.props.lineHeight) {
			this.setState({ height })
		}
	}
	onLayout = (e) => {
		let { width, x, y } = e.nativeEvent.layout
		this.setState({ width, x, y })
	}
}

const styles = style({
	underline: {
		height: 0,
		borderBottomWidth: 1,
		borderColor: colors.black,
	},
})
