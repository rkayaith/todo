import { AsyncStorage } from 'react-native'

import PushNotification from 'react-native-push-notification'

import { colors } from '../components/styles'

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
	return JSON.parse(string) || defaultSettings()
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

    let urgentItems = itemList.filter(item => Item.isUrgent(item, time))

    let message = Item.levels().reduce((message, level) => {
        let items = itemList.filter(item => Item.level(item, time) === level)
        if (items.length > 0) {
            let s = `${Item.description(level)}:`
            items.forEach(item => s += `\n • ${Item.text(item)}`)
            return message.concat(s)
        }
        return message
    }, [])

    notify(notification({
        id: SUMMARY_ID,
        title: "Task Summary",
        color: colors.primaryColor,
        message: message[0].replace(/\n/g, ''),     // short message only has items in the highest level
        bigText: message.join('\n'),                // full message has all items
        subText: urgentItems.length > 0 ?
            plural(urgentItems.length, `${urgentItems.length} urgent task`) :
            plural(itemList.length, `${itemList.length} task`),
        number: itemList.length.toString(),
        ongoing: true,
        vibrate: false,
        playSound: false,
    }), time)

    function plural(num, s) {
        if (num === 1) {
            return s
        }
        return s + 's'
    }
}


// Default notification properties
function notification(opts)  {
    return {
        group: 'TodoApp',
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
