import PushNotification from 'react-native-push-notification'

import * as Item from './Item'

/**
 * Functions for working with notifications
 * See notification() for all notification object properties
 */


// PushNotification package wrappers
// see https://github.com/zo0r/react-native-push-notification
export function init() {
    PushNotification.configure({
        popInitialNotification: true,
        requestPermissions: false,
    })
}

export function notify(notification, date) {
    if (!notification) return
    if (date.getTime() <= Date.now()) {
        PushNotification.localNotification(notification)
    } else {
        PushNotification.localNotificationSchedule({ ...notification, date })
    }
}

export function clearAll() {
    PushNotification.cancelAllLocalNotifications()
}


// Notification presets. date should be a Date object for when the notification should be scheduled
// Reminder for a single item
export function remind(item, date) {
    let level = Item.level(item, date)  // determine item's level when the notification appears
    notify(notification({
        tag: Item.id(item),
        title: item.text,
        message: "is " + Item.description(level),
        color: Item.color(level),
    }), date)
}

// Summary for a list of items
export function summarize(itemList, date) {
    itemList = itemList.sort(Item.sort)

    let numItems = 0
    // sort items by level
    let levels = Item.levels().reduce((levels, level) => {
        let items = itemList.filter(item => Item.level(item, date) === level)
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
            tag: 'SUMMARY_NOTIFICATION',
            title: "Things to do",
            color: Item.color(levels[0].level),
            message: bigText[0],                // short message only has items in the highest level
            bigText: bigText.join('\n'),        // full message has all items
            number: numItems > 1 ? numItems.toString() : null,
            ongoing: true,
            vibrate: false,
            playSound: false,
        }), date)
    }
}


// Default notification properties
function notification(opts)  {
    return {
        // all notifications use the same id, use tag property to distinguish them
        id: NOTIFICATION_ID,
        message: "TodoApp Notification",
        largeIcon: "ic_launcher",
        smallIcon: "ic_notification",
        autoCancel: true,
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

const NOTIFICATION_ID = '8888'
