import React, { Component } from 'react'
import { Navigator } from 'react-native'
import { View, Text, StyleSheet } from 'react-native'

import HomeScene from './home/HomeScene'
import AddItemScene from './add-item/AddItemScene'
import EditItemScene from './edit-item/EditItemScene'

import data from './MOCK_DATA'

export default class TodoApp extends Component {
    state = { data }

    render() {

        return (
            <Navigator
                style={ styles.scene }
                initialRoute={{ id: 'home' }}
                renderScene={(route, navigator) => {
                    switch(route.id) {
                        case 'home': return (
                            <HomeScene
                                data={ this.state.data }
                                changeItem={ this.changeItem }
                                deleteItem={ this.deleteItem }
                                navigator={ navigator }
                            />
                        )
                        case 'add-item': return (
                            <AddItemScene
                                addItem={ this.addItem }
                                navigator={ navigator }
                            />
                        )
                        case 'edit-item': return (
                            <EditItemScene
                                item={ route.item }
                                changeItem={ this.changeItem }
                                navigator={ navigator }
                            />
                        )
                    }
                    return null
                }}
            />
        )
    }

    addItem = (item) => {
        let data = this.state.data.slice(0)
        data.push(item)
        this.setState({ data })
    }

    changeItem = (id, changes) => {
		let data = this.state.data.slice(0)
		data[id] = { ...data[id], ...changes }
		this.setState({ data })
	}

    deleteItem = (id) => {
        let data = this.state.data.slice(0)
        data.splice(id, 1)
        this.setState({ data })
    }
}

// red background just for debugging
// use ./styles.scene later
const styles = StyleSheet.create({
    scene: {
        backgroundColor: 'red'
    }
})
