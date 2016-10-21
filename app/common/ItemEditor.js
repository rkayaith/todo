import React, { Component } from 'react'
import { View, Text, TextInput, Switch } from 'react-native'

import styles from '../styles'

export default class ItemEditor extends Component {
	constructor(props) {
		super(props)
		this.state = { ...props.item }
	}

	render() {
		return (
			<View>
				<Text>{ JSON.stringify(this.props) }</Text>
				<Text style={ styles.text }>Text</Text>
				<TextInput
					style={ styles.text }
					value={ this.state.text }
					placeholder="Text"
					onChangeText={ text => this.setState({ text }) }
				/>
				<Text style={ styles.text }>Checked</Text>
				<Switch
					value={ this.state.checked }
					onValueChange={ checked => this.setState({ checked }) }
				/>
				<Text style={ styles.text }>Important</Text>
				<Switch
					value={ this.state.important }
					onValueChange={ important => this.setState({ important }) }
				/>
				<Text style={ styles.text }>Urgent</Text>
				<Switch
					value={ this.state.urgent }
					onValueChange={ urgent => this.setState({ urgent }) }
				/>
				<Text style= { styles.text } onPress={ () => this.props.submit(this.state) }>Submit</Text>
			</View>
		)
	}
}
