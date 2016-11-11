import { AsyncStorage } from 'react-native'

/**
 * Functions for working with our data structure
 * Data is an object who's keys are ids and values are todo items:
 *   data = {
 *     id: item
 *     ...
 *   }
 */


// Modify data
export function add(data, value) {
	data = clone(data)
	data[uuid()] = value
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
	return {
		"e1174392-9c0a-4197-80cb-0a8a59c74c65": { text: 'urgent important', checked: true, urgent: 0, important: true },
		"f9228358-339b-4982-a527-803cffc4b8c0": { text: 'urgent important2', checked: false, urgent: 0, important: true },
		"3c1f07c3-1fcc-4ec9-8650-b306b3f4bc60": { text: 'urgent important3', checked: true, urgent: 0, important: true },
		"f0bc850e-d6ec-430b-98cd-89062299d4aa": { text: 'urgent not important', checked: true, urgent: 0, important: false },
		"867ce7ba-8a90-40c2-8cbf-ec0246383c57": { text: 'urgent not important2', checked: false, urgent: 0, important: false },
		"9c1f2928-42f9-4978-96bf-b4601ef589d9": { text: 'not urgent important', checked: true, urgent: Infinity, important: true },
		"6d7187b9-a27b-4c72-a150-b0a0837c5827": { text: 'not urgent important2', checked: false, urgent: Infinity, important: true },
		"8043c5ba-f028-4cf4-bd9f-38308bb528a1": { text: 'not urgent not important', checked: true, urgent: Infinity, important: false },
		"8c3bb2fe-2398-4f76-bb2d-e7791ac3c06a": { text: 'not urgent not important2', checked: false, urgent: Infinity, important: false },
	}
}


// Helpers
function clone(data) {
	return Object.assign({}, data)
}

function uuid() {
    // http://stackoverflow.com/a/2117523
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
	    return v.toString(16)
	})
}
