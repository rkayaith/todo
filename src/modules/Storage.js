import { AsyncStorage } from 'react-native'

import * as Item from './Item'
import * as Data from './Data'
import * as Notifications from './Notifications'

export const STATE_KEY = '@TodoApp/state'

export function get(key) {
	return AsyncStorage.getItem(key)
}

export function set(key, value) {
	AsyncStorage.setItem(key, value)
}
