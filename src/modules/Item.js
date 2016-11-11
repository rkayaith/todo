import { colors } from '../components/styles'

/**
 * Functions for working with our todo items
 * Item structure:
 *   item = {
 *     text: string,
 *     checked: bool,
 *     urgent: number | Infinity (unix timestamp for when item becomes urgent, Infinity for never)
 *     important: bool,
 *   }
 */


// Query item
export function isUrgent(item) {
	return item.urgent < Date.now()
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
		text: "",
		checked: false,
		urgent: Infinity,
		important: false
	}
}


// Helper
function toLevel(itemOrLevel) {
	if (Number.isInteger(itemOrLevel)) {
		return itemOrLevel
	} else {
		return level(itemOrLevel)
	}
}
