import { AsyncStorage } from 'react-native'

import * as Data from './Data'
import * as Notifications from './Notifications'

const ITEM_KEY = '@TodoApp/state'

export function setState(state) {
	let data = Data.toString(state.data)
	let notifSettings = Notifications.toString(state.notifSettings)

	AsyncStorage.setItem(ITEM_KEY, JSON.stringify({ data, notifSettings }))
}

export async function getState() {
	let state = JSON.parse(await AsyncStorage.getItem(ITEM_KEY))

	let data = Data.fromString(state.data)
	let notifSettings = Notifications.fromString(state.notifSettings)
	return { data, notifSettings }
}
