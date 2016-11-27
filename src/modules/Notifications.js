import { AsyncStorage } from 'react-native'

import PushNotification from 'react-native-push-notification'

import * as Data from './Data'
import * as Item from './Item'

/**
 * Functions for working with notifications
 * See notification() for all notification object properties
 */


// String transformations for storing settings
export function toString(settings) {
    return JSON.stringify(settings)
}

export function fromString(string) {
	let settings = JSON.parse(string)
	if (settings) {
		return settings
	}
	return defaultSettings()
}


// PushNotification package wrappers
// see https://github.com/zo0r/react-native-push-notification
export function init() {
    PushNotification.configure({
        popInitialNotification: true,
        requestPermissions: false,
    })
}

export function notify(notification, time) {
    if (!notification) return
    if (time <= Date.now()) {
        PushNotification.localNotification(notification)
    } else {
        PushNotification.localNotificationSchedule({ ...notification, date: new Date(time) })
    }
}

export function clearAll() {
    PushNotification.cancelAllLocalNotifications()
}


// Notification presets. time should be a unix timestamp for when the notification should be scheduled
// Reminder for a single item
export function remind(item, time) {
    let level = Item.level(item, time)  // determine item's level when the notification appears
    notify(notification({
        title: item.text,
        message: "is " + Item.description(level),
        color: Item.color(level),
    }), time)
}

// Summary for a list of items
export function summarize(itemList, time) {
    if (itemList.length < 1) return
    itemList = itemList.sort(Item.sort)

    let numItems = 0
    // sort items by level
    let levels = Item.levels().reduce((levels, level) => {
        let items = itemList.filter(item => Item.level(item, time) === level)
        if (items.length > 0) {
            numItems += items.length
            levels.push({ level, items })
        }
        return levels
    }, [])

    if (levels.length > 0) {
        let bigText = levels.map(level => {
            return [Item.description(level.level) + ':', ...level.items.map(Item.text)].join('\n • ')
        })
        notify(notification({
            id: SUMMARY_ID,
            title: "Things to do",
            color: Item.color(levels[0].level),
            message: bigText[0],                // short message only has items in the highest level
            bigText: bigText.join('\n'),        // full message has all items
            number: numItems > 1 ? numItems.toString() : null,
            autoCancel: false,
            ongoing: true,
            vibrate: false,
            playSound: false,
        }), time)
    }
}


// Default notification properties
function notification(opts)  {
    return {
        message: "TodoApp Notification",
        largeIcon: "ic_launcher",
        smallIcon: "ic_notification",
        autoCancel: false,
        vibrate: true,
        vibration: 1000,
        playSound: true,
        soundName: 'default',
        ongoing: false,
        ...opts,

        // Other properties:
        // tag: string
        // title: string
        // bigText: string
        // subText: string
        // number: Number.toString
        // color: string
        // group: string
        // ticker: string
        // actions: Array.toString
        // repeatType: 'week' | 'day' | 'hour' | 'minute | 'time'
        // repeatTime: number
    }
}

const SUMMARY_ID = '8888'


// Default Settings
export function defaultSettings() {
    return Item.levels().reduce((settings, level) => {
        settings[level] = false
        return settings
    }, {})
}


// Notification icon
export function icon(data, isEnabled) {
    let name = 'notifications'
    if (!isEnabled) {
        name = 'notifications-off'
    } else if (!Data.values(data).every(Item.isChecked)) {
        name = 'notifications-active'
    }
    return { name }
}
