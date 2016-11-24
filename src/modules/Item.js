import { colors } from '../components/styles'

/**
 * Functions for working with our todo items
 * Item structure:
 *   item = {
 *     id: string (uuid string)
 *     text: string,
 *     checked: bool,
 *     urgent: number | Infinity (unix timestamp for when item becomes urgent, Infinity for never)
 *     important: bool,
 *     note: string,
 *   }
 */


// Create item
export function fromObj(obj) {
	let item = emptyItem()
	for (let prop in item) {
		if (obj[prop] !== undefined) {
			item[prop] = obj[prop]
		}
	}
	// Replace -Infinity with current date
	if (item.urgent === -Infinity) {
		item.urgent = Date.now()
	}
	return item
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
	let date = new Date(item.urgent)
	if (isNaN(date.getTime())) return null
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
