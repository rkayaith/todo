import React, { Component } from 'react'
import { Navigator } from 'react-native'
import { View, Text, AsyncStorage, StyleSheet } from 'react-native'

import HomeScene from './home/HomeScene'
import AddItemScene from './add-item/AddItemScene'
import EditItemScene from './edit-item/EditItemScene'

import mock_data from './MOCK_DATA'

export default class TodoApp extends Component {
    state = { data: [] }

    componentDidMount() {
        this.getStoredData()
    }

    componentWillUpdate(props, state) {
        if (state.data !== this.state.data) {
            // TODO: Throttle storage attempts? TodoItem text input repeatedly calls
            // this.changeItem() and updates state
            // Either use Rx.Observable.audit or reduce this.changeItem() calls
            // (use onEndEditing and onSubmitEditing in TodoItem)
            this.setStoredData(state.data)
        }
    }

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
                                resetData= { this.resetData }
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
                            // route must have property 'itemId'
                            // that has the id of the item to edit
                            <EditItemScene
                                item={ this.state.data[route.itemId] }
                                change={ this.changeItem.bind(null, route.itemId) }
                                navigator={ navigator }
                            />
                        )
                    }
                    return null
                }}
            />
        )
    }

    getStoredData = async () => {
        let data = JSON.parse(await AsyncStorage.getItem('data'))
        if (data) {
            console.log('TodoApp.getStoredData: got data from storage')
            this.setState({ data })
        }
    }

    setStoredData = async (data) => {
        await AsyncStorage.setItem('data', JSON.stringify(data))
        console.log("TodoApp.setStoredData: set data in storage")
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

    resetData = () => {
        this.setState({ data: mock_data })
    }
}

// red background just for debugging
// use ./styles.scene later
const styles = StyleSheet.create({
    scene: {
        backgroundColor: 'red'
    }
})
