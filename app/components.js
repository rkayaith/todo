import Icon from 'react-native-vector-icons/MaterialIcons'
import React, { Component } from 'react'
import { Picker as ReactPicker } from 'react-native'

import styles from './styles'

export const Toolbar = ({ style, ...props }) => (
	<Icon.ToolbarAndroid
		{ ...props }
		style={[ styles.toolbar, style ]}
		elevation={ 4 }
		contentInsetStart={ 16 }
	/>
)

// ReactNative.Picker wrapper that updates selectedValue immediatly so onValueChange can be async
// TODO: refactor ItemEditor so this isn't needed
export class Picker extends Component {
	constructor(props) {
		super(props)
		this.state = { selectedValue: props.selectedValue }
	}
	componentWillReceiveProps(props) {
		this.setState({ selectedValue: props.selectedValue })
	}
	render() {
		let { selectedValue, onValueChange, ...props } = this.props
		return (
			<ReactPicker
				{ ...props }
				selectedValue={ this.state.selectedValue }
				onValueChange={ this.onValueChange.bind(this) }>
				{ this.props.children }
			</ReactPicker>
		)
	}
	onValueChange = (value) => {
		if (value !== this.state.selectedValue) {
			// update the selected value immediatly in case props.onValueChange takes a while
			this.setState({ selectedValue: value }, () => this.props.onValueChange(value))
		}
	}
}
Picker.Item = ReactPicker.Item
