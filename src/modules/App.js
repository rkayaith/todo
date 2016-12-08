import semver from 'semver'
import { version as APP_VERSION } from '../../package.json'

import * as Item from './Item'
import * as Data from './Data'
import * as Storage from './Storage'
import * as Notifications from './Notifications'


/**
 * App
 */
export async function init() {

	let info = JSON.parse(await Storage.get(Storage.STATE_KEY))
	// If there is no info (ie fresh install) don't call upgrade()
	if (info) {
		info = await upgrade(info)
	}
	return stateFromObj(info)
}


/**
 * State
 */
export function defaultState() {
	return {
		data: Data.emptyData(),
		notifSettings: Notifications.defaultSettings(),
	}
}

function stateFromObj(obj) {
	return {
		version: obj.version || APP_VERSION,
		data: Data.map(Data.fromString(obj.data), Item.fromString),
		notifSettings: Notifications.fromString(obj.notifSettings),
	}
}

function stateToString(state) {
	let version = state.version
	let data = Data.toString(Data.map(state.data, Item.toString))
	let notifSettings = Notifications.toString(state.notifSettings)

	return JSON.stringify({ version, data, notifSettings })
}

export function saveState(state) {
	Storage.set(Storage.STATE_KEY, stateToString(state))
}


/**
 *	Version upgrade
 */
async function upgrade(info) {

	// TODO: Backup data when up/downgrading

	if (!info.version) {
		// if no version is specified run through all the upgrades
		info.version = '0.0.0'
	}

	if (semver.eq(info.version, APP_VERSION)) {
		// app is already fully upgraded
		return info
	}

	if (semver.gt(info.version, APP_VERSION)) {
		// app is being downgraded, delete all info to avoid errors
		return { version: APP_VERSION }
	}

	let upgrades = []
	version('0.1.0', info => {
		let data = JSON.parse(info.data)
		for (id in data) {
			if (data[id].urgent === null) {
				data[id].urgent = 'Infinity'
			}
			data[id] = JSON.stringify(data[id])
		}
		return { ...info, data: JSON.stringify(data) }
	})

	return applyUpgrades(upgrades, info)

	function version(version, fn) {
		// version: semver string
		// fn: function to run when upgrading TO version
		upgrades.push({ version, fn })
	}
}

function applyUpgrades(upgrades, info) {
	console.log("App.applyUpgrades: Upgrading from version", info.version)
	// apply upgrades greater than current version in ascending order
	upgrades.filter(upgrade => semver.lt(info.version, upgrade.version))
		.sort(semver.compare)
		.forEach(upgrade => {
			try {
				info = upgrade.fn(info)
			} catch (ex) {
				throw "Error upgrading app to v" + upgrade.version + " from v" + info.version + ex
			}
		})

	// succesfully applied all upgrades
	info.version = APP_VERSION
	console.log("App.applyUpgrades: Upgraded to version", info.version)

	return info
}
