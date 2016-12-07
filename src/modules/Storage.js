import { AsyncStorage } from 'react-native'

import * as Item from './Item'
import * as Data from './Data'
import * as Notifications from './Notifications'


const STATE_KEY = '@TodoApp/state'

export function set(key, value) {
	AsyncStorage.setItem(key, value)
}

export function get(key) {
	return AsyncStorage.getItem(key)
}


export function setState(state) {
	let data = Data.toString(Data.map(state.data, Item.toString))
	let notifSettings = Notifications.toString(state.notifSettings)

	set(STATE_KEY, JSON.stringify({ data, notifSettings }))
}

export async function getState() {
	let state = JSON.parse(await get(STATE_KEY))

	let data = Data.map(Data.fromString(state.data), Item.fromString)
	let notifSettings = Notifications.fromString(state.notifSettings)
	return { data, notifSettings }
}
