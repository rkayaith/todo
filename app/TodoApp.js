import React, { Component } from 'react'
import { Navigator } from 'react-native'
import { View, Text, AsyncStorage, StyleSheet, UIManager, LayoutAnimation } from 'react-native'

import HomeScene from './home/HomeScene'
import AddItemScene from './add-item/AddItemScene'
import EditItemScene from './edit-item/EditItemScene'

import mock_data from './MOCK_DATA'

import styles from './styles'

export default class TodoApp extends Component {
    state = { data: {} }

    constructor(props) {
        super(props)
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }

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
                                delete={ this.deleteItem.bind(null, route.itemId) }
                                navigator={ navigator }
                            />
                        )
                    }
                    return null
                }}
                configureScene={ () => Navigator.SceneConfigs.FloatFromBottomAndroid }
            />
        )
    }

    layoutAnimation = () => {
        LayoutAnimation.easeInEaseOut()
    }

    getStoredData = async () => {
        let data = JSON.parse(await AsyncStorage.getItem('data'))
        if (data) {
            console.log('TodoApp.getStoredData: got data from storage')
            // value of Infinity gets stored as null when stringified, so we restore it
            for (let id in data) {
                if (data[id].urgent === null) {
                    data[id].urgent = Infinity
                }
            }
            this.setState({ data })
        }
    }

    setStoredData = async (data) => {
        await AsyncStorage.setItem('data', JSON.stringify(data))
        console.log("TodoApp.setStoredData: set data in storage")
    }

    addItem = (item) => {
        let data = Object.assign({}, this.state.data)
        data[uuid()] = item
        this.layoutAnimation()
        this.setState({ data })
    }

    changeItem = (ids, changes) => {
		let data = Object.assign({}, this.state.data)
        for (id of [].concat(ids)) {
            data[id] = { ...data[id], ...changes }
        }
        this.layoutAnimation()
		this.setState({ data })
	}

    deleteItem = (ids) => {
        let data = Object.assign({}, this.state.data)
        for (id of [].concat(ids)) {
            delete data[id]
        }
        this.layoutAnimation()
        this.setState({ data })
    }

    resetData = () => {
        this.setState({ data: mock_data })
    }
}

function uuid() {
    // http://stackoverflow.com/a/2117523
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
	    return v.toString(16)
	})
}
