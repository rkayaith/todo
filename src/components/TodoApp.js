import React, { Component } from 'react'
import { Navigator } from 'react-native'
import { AppState, UIManager, LayoutAnimation } from 'react-native'

import HomeScene from './scenes/HomeScene'
import AddItemScene from './scenes/AddItemScene'
import EditItemScene from './scenes/EditItemScene'

import * as App from '../modules/App'
import * as Data from '../modules/Data'
import * as Item from '../modules/Item'
import * as Storage from '../modules/Storage'
import * as Notifications from '../modules/Notifications'

import { style } from './styles'

export default class TodoApp extends Component {

    state = App.defaultState()
    refreshTimeout = null

    // App lifecycle methods
    constructor(props) {
        super(props)
        UIManager.setLayoutAnimationEnabledExperimental(true)
    }

    async componentDidMount() {

        Notifications.init()
        Notifications.clearAll()

        AppState.addEventListener('change', this.onAppStateChange)

        this.setState(await App.init())
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.onAppStateChange)
    }

    componentDidUpdate(prevProps, prevState) {
        this.scheduleRefresh(this.state.data)
        if (__DEV__) {
            // save state on every update since reloading app doesn't trigger onBackground()
            App.saveState(this.state)
        }
    }

    // App is resumed. Not called on initial mounting
    onActive() {
        Notifications.clearAll()
        this.refresh()
        this.scheduleRefresh(this.state.data)
    }

    // App is closed
    onBackground() {
        App.saveState(this.state)
        this.scheduleNotifications(this.state.data, this.state.notifSettings)
        clearTimeout(this.refreshTimeout)
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
                                focused={ this.state.scene === 'home' }
                                changeItem={ (id, changes) => this.setData(Data.change(this.data(), id, changes)) }
                                removeItem={ id => this.setData(Data.remove(this.data(), id)) }
                                notifSettings={ this.state.notifSettings }
                                setNotifSettings={ this.setNotifSettings }
                                loadMockData={ () => this.setData(Data.mockData()) }
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
                configureScene={ () => Navigator.SceneConfigs.FloatFromRight }
                onDidFocus={ route => {
                    // setting state immediately seems to cause issues with LayoutAnimation
                    // 0 delay setTimeout is enough to fix it
                    setTimeout(() => this.setState({ scene: route.id }))
                }}
            />
        )
    }


    // Get/Set state properties
    data = () => {
        return this.state.data
    }

    setData = (data) => {
        this.setState({ data })
    }

    setNotifSettings = (settings) => {
        let notifSettings = { ...this.state.notifSettings, ...settings }
        this.setState({ notifSettings })
    }


    // Helpers
    refresh = () => {
        // need a delay to play nice when app is opened through a notification
        setTimeout(() => this.forceUpdate(), 1000)
    }

    scheduleRefresh = (data) => {
        clearTimeout(this.refreshTimeout)
        let upcomingItems = Data.values(data)
            .filter(item => !Item.isUrgent(item) && Item.urgentTime(item))
            .sort(Item.sortByUrgency)

        if (upcomingItems[0]) {
            this.refreshTimeout = setTimeout(
                () => this.refresh(),
                Item.urgentTime(upcomingItems[0]) - Date.now()
            )
        }
    }

    scheduleNotifications = (data, notifSettings) => {
        Notifications.clearAll()

        let items = Data.values(data).filter(item => !Item.isChecked(item))
        // Create a summary for items that are unchecked and are in a level with notifications enabled
        let summaryItems = (time) => items.filter(item => notifSettings[Item.level(item, time)])
        // Create reminders for items that are unchecked, not urgent, and will become urgent
        let reminderItems = items.filter(item => !Item.isUrgent(item) && Item.urgentTime(item))

        Notifications.summarize(summaryItems(Date.now()), Date.now())   // create summary notification immediately
        reminderItems.forEach(item => {
            let time = Item.urgentTime(item)
            Notifications.summarize(summaryItems(time), time)           // update summary notification
            Notifications.remind(item, time)                            // schedule reminder notification
        })
    }

    onAppStateChange = (appState) => {
        switch (appState) {
            case 'active': this.onActive.call(this); break
            case 'background': this.onBackground.call(this); break
        }
    }

}

const styles = style()
