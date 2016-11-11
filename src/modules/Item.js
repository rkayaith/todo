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
 *   }
 */


// Create item
export function fromObj(obj) {
	let { id, checked, urgent, important } = obj
	// Replace -Infinity with current date
	if (urgent === -Infinity) {
		urgent = Date.now()
	}
	return { id, checked, urgent, important }
}


// Query item
export function id(item) {
	return item.id
}

export function isChecked(item) {
	return item.checked
}

export function isUrgent(item) {
	return item.urgent <= Date.now()
}

export function isImportant(item) {
	return item.important
}

export function level(item) {
	if (isUrgent(item)) {
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
		important: false
	}
}


// Helpers
function toLevel(itemOrLevel) {
	if (Number.isInteger(itemOrLevel)) {
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
