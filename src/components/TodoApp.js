import React, { Component } from 'react'
import { Navigator } from 'react-native'
import { View, Text, AsyncStorage, StyleSheet, UIManager, LayoutAnimation } from 'react-native'

import HomeScene from './scenes/HomeScene'
import AddItemScene from './scenes/AddItemScene'
import EditItemScene from './scenes/EditItemScene'

import * as Data from '../modules/Data'

import styles from './styles'

export default class TodoApp extends Component {
    state = { data: Data.emptyData() }

    constructor(props) {
        super(props)
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }

    async componentDidMount() {
        this.setData(await Data.getStoredData())
    }

    componentWillUpdate(props, state) {
        if (state.data !== this.state.data) {
            Data.setStoredData(state.data)
            LayoutAnimation.easeInEaseOut()
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
                                changeItem={ (...args) => this.setData(Data.change(this.data(), ...args)) }
                                removeItem={ (...args) => this.setData(Data.remove(this.data(), ...args)) }
                                resetData={ () => this.setData(Data.mockData()) }
                                navigator={ navigator }
                            />
                        )
                        case 'add-item': return (
                            <AddItemScene
                                addItem={ item => this.setData(Data.add(this.data(), item)) }
                                navigator={ navigator }
                            />
                        )
                        case 'edit-item': return (
                            // route must have property 'itemId'
                            // that has the id of the item to edit
                            <EditItemScene
                                item={ this.state.data[route.itemId] }
                                change={ changes => this.setData(Data.change(this.data(), route.itemId, changes)) }
                                remove={ () => this.setData(Data.remove(this.data(), route.itemId)) }
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

    data = () => {
        return this.state.data
    }

    setData = (data) => {
        this.setState({ data })
    }
}
