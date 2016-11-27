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


// String transformations for storage
export function toString(data) {
	return JSON.stringify(data)
}

export function fromString(string) {
	let data = JSON.parse(string)
	if (data) {
		// value of Infinity gets stored as null when stringified, so we restore it
		for (let id in data) {
			if (data[id].urgent === null) {
				data[id].urgent = Infinity
			}
		}
		return data
	} else {
		return emptyData()
	}
}


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


// Default structures
export function emptyData() {
	return {}
}

export function mockData() {
	return fromArr([
		{ text: 'Urgent important', checked: true, urgent: -100000, important: true },
		{ text: 'Urgent important2', checked: false, urgent: 0, important: true },
		{ text: 'Urgent important3', checked: false, urgent: Date.now(), important: true },
		{ text: 'Urgent not important', checked: true, urgent: -100000, important: false },
		{ text: 'Urgent not important2', checked: false, urgent: 0, important: false },
		{ text: 'Not urgent important', checked: true, urgent: Date.now() + 60 * 1000, important: true },
		{ text: 'Not urgent important2', checked: false, urgent: Infinity, important: true },
		{ text: 'Not urgent not important', checked: true, urgent: Infinity, important: false },
		{ text: 'Not urgent not important2', checked: false, urgent: Infinity, important: false },
	].map(Item.fromObj))
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
