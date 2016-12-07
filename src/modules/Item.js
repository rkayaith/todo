import { colors } from '../components/styles'

/**
 * Functions for working with our todo items
 * Item structure:
 *   item = {
 *     id: string (uuid string)
 *     text: string,
 *     checked: bool,
 *     urgent: number | Infinity | -Infinity (unix timestamp, Infinity for never, -Infinity for now)
 *     important: bool,
 *     note: string,
 *   }
 */


// Create item from object
export function fromObj(obj) {
	let item = emptyItem()
	for (let prop in item) {
		if (prop in obj) {
			item[prop] = obj[prop]
		}
	}
	// Replace -Infinity with current date
	if (item.urgent === -Infinity) {
		item.urgent = Date.now()
	}
	return item
}


// String transformations for storage
export function toString(item) {
	item = fromObj(item)
	// stringify Infinity
	if (item.urgent === Infinity) {
		item.urgent = 'Infinity'
	}
	return JSON.stringify(item)
}

export function fromString(string) {
	let obj = JSON.parse(string)
	// parse Infinity
	if (obj.urgent === 'Infinity') {
		obj.urgent = Infinity
	}
	return fromObj(obj)
}


// Array of possible item levels, sorted by importance in descending order
export function levels() {
	return [4, 3, 2, 1]
}


// Query item
export function id(item) {
	return item.id
}

export function text(item) {
	return item.text
}

export function isChecked(item) {
	return item.checked
}

export function isUrgent(item, time) {
	// supply a unix timestamp to see if an item will be urgent on a certain date
	if (!time) time = Date.now()
	return item.urgent <= time
}

export function urgentTime(item) {
	if (item.urgent === Infinity) return null
	if (item.urgent === -Infinity) return Date.now()
	return item.urgent
}

export function isImportant(item) {
	return item.important
}

export function level(item, time) {
	if (isUrgent(item, time)) {
		if (isImportant(item)) {
			return 4
		} else {
			return 3
		}
	} else {
		if (isImportant(item)) {
			return 2
		} else {
			return 1
		}
	}
}

export function sort(item1, item2) {
	if (level(item1) !== level(item2)) {
		// higher level goes first
		return level(item2) - level(item1)
	}
	if (isChecked(item1) !== isChecked(item2)) {
		// checked items go first
		if (isChecked(item1)) {
			return 1
		} else if (isChecked(item2)) {
			return -1
		}
	}
	if (item1.urgent !== item2.urgent) {
		// earlier urgent date goes first
		return item1.urgent - item2.urgent
	}
	return 0
}

export function sortByUrgency(item1, item2) {
	return item1.urgent - item2.urgent
}


// Info about an item based on level
// Takes an Item or a level (integer between 1 and 4)
export function color(itemOrLevel) {
	let level = toLevel(itemOrLevel)
	switch (level) {
		case 4: return colors.level4
		case 3: return colors.level3
		case 2: return colors.level2
		case 1: return colors.level1
	}
	return colors.black
}
export function colorDark(itemOrLevel) {
	let level = toLevel(itemOrLevel)
	switch (level) {
		case 4: return colors.level4dark
		case 3: return colors.level3dark
		case 2: return colors.level2dark
		case 1: return colors.level1dark
	}
	return colors.black
}

export function icon(itemOrLevel) {
	let level = toLevel(itemOrLevel)
	switch (level) {
		case 4: return { iconSize: 22, name: "error-outline" }
		case 3: return { iconSize: 22, name: "schedule" }
		case 2: return { iconSize: 20, name: "priority-high" }
		case 1: return { iconSize: 20, name: "done" }
	}
	return {}
}

export function description(itemOrLevel) {
	let level = toLevel(itemOrLevel)
	switch (level) {
		case 4: return "Urgent, Important"
		case 3: return "Urgent, Not Important"
		case 2: return "Not Urgent, Important"
		case 1: return "Not Urgent, Not Important"
	}
	return ""
}


// Default structure
export function emptyItem() {
	return {
		id: uuid(),
		text: "",
		checked: false,
		urgent: Infinity,
		important: false,
		note: ""
	}
}


// Helpers
function toLevel(itemOrLevel) {
	if (levels().includes(itemOrLevel)) {
		return itemOrLevel
	} else {
		return level(itemOrLevel)
	}
}

function uuid() {
    // http://stackoverflow.com/a/2117523
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8)
	    return v.toString(16)
	})
}
