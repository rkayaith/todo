import React, { Component } from 'react'
import { Navigator } from 'react-native'
import { AppState, UIManager, LayoutAnimation } from 'react-native'

import HomeScene from './scenes/HomeScene'
import AddItemScene from './scenes/AddItemScene'
import EditItemScene from './scenes/EditItemScene'

import * as Data from '../modules/Data'
import * as Item from '../modules/Item'
import * as Notifications from '../modules/Notifications'

import styles from './styles'

export default class TodoApp extends Component {
    state = { data: Data.emptyData() }

    constructor(props) {
        super(props)
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }

    async componentDidMount() {
        Notifications.init()

        this.onAppStateChange(AppState.currentState)
        AppState.addEventListener('change', this.onAppStateChange)

        this.setData(await Data.getStoredData())
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.onAppStateChange)
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
                                changeItem={ (id, changes) => this.setData(Data.change(this.data(), id, changes)) }
                                removeItem={ id => this.setData(Data.remove(this.data(), id)) }
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

    onAppStateChange = (appState) => {
        switch (appState) {
            case 'active': return this.onActive()
            case 'background': return this.onBackground()
        }
    }

    onActive = () => {
        // Don't display notifications when app is open
        Notifications.clearAll()
    }

    onBackground = () => {
        // Create a summary notification for items that aren't checked
        let summaryItems = Data.values(this.data())
            .filter(item => !Item.isChecked(item))
        // Create reminders for items that are unchecked, not urgent, and will become urgent
        let reminderItems = Data.values(this.data())
            .filter(item => !Item.isChecked(item) && !Item.isUrgent(item) && Item.urgentDate(item))

        Notifications.summarize(summaryItems, new Date())   // create summary notification immediately
        reminderItems.forEach(item => {
            let date = Item.urgentDate(item)
            Notifications.summarize(summaryItems, date)     // update summary notification
            Notifications.remind(item, date)                // schedule reminder notification
        })
    }
}
