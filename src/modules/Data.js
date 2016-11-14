import { AsyncStorage } from 'react-native'

import * as Item from './Item'

/**
 * Functions for working with our data structure
 * Data is an object who's keys are ids and values are todo items:
 *   data = {
 *     id: item
 *     ...
 *   }
 */

// Query data
export function keys(data) {
	return Object.keys(data)
}

export function values(data) {
	return Object.keys(data).map(key => data[key])
}


// Modify data
export function add(data, item) {
	data = clone(data)
	data[Item.id(item)] = item
	return data
}

export function change(data, ids, changes) {
	data = clone(data)
	for (id of [].concat(ids)) {
		data[id] = { ...data[id], ...changes }
	}
	return data
}

export function remove(data, ids) {
	data = clone(data)
	for (id of [].concat(ids)) {
		delete data[id]
	}
	return data
}

export function filter(data, filterFn) {
	return fromArr(values(data).filter(filterFn))
}

export function sort(data, sortFn) {
	return fromArr(values(data).sort(sortFn))
}

// Get/Set data from/in AsyncStorage
export async function getStoredData() {
	let data = JSON.parse(await AsyncStorage.getItem('data'))
	if (data) {
		console.log('Data.getStoredData: got data from storage')
		// value of Infinity gets stored as null when stringified, so we restore it
		for (let id in data) {
			if (data[id].urgent === null) {
				data[id].urgent = Infinity
			}
		}
		return data
	}
	return emptyData()
}

export async function setStoredData(data) {
	await AsyncStorage.setItem('data', JSON.stringify(data))
	console.log("Data.setStoredData: set data in storage")
}


// Default structures
export function emptyData() {
	return {}
}

export function mockData() {
	return fromArr(
		[
			{ text: 'urgent important', checked: true, urgent: -100000, important: true },
			{ text: 'urgent important2', checked: false, urgent: 0, important: true },
			{ text: 'urgent important3', checked: false, urgent: Date.now(), important: true },
			{ text: 'urgent not important', checked: true, urgent: -100000, important: false },
			{ text: 'urgent not important2', checked: false, urgent: 0, important: false },
			{ text: 'not urgent important', checked: true, urgent: Date.now() + 60 * 1000, important: true },
			{ text: 'not urgent important2', checked: false, urgent: Infinity, important: true },
			{ text: 'not urgent not important', checked: true, urgent: Infinity, important: false },
			{ text: 'not urgent not important2', checked: false, urgent: Infinity, important: false },
		]
		.map(Item.fromObj)
	)
}


// Helpers
function clone(data) {
	return Object.assign({}, data)
}

function fromArr(arr) {
	return arr.reduce((data, item) => {
		data[Item.id(item)] = item
		return data
	}, emptyData())
}
