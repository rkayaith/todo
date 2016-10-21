import { StyleSheet } from 'react-native'

// TODO: find proper names for these colors
const colors_table = {
	'offWhite': '#F5F5F5',
	'white': '#FAFAFA',
	'materialBlue': '#3F51B5',
}

export const colors = {
	...colors_table,
	primaryColor: colors_table.materialBlue
}


// import this object to combine certain style properties
export const style = {
	scene: {
		flex: 1,
		backgroundColor: colors.white,
	},
	toolbar: {
		height: 56,
		backgroundColor: colors.offWhite,
	},
	text: {
		fontSize: 20,
	},
}

export default styles = StyleSheet.create(style)
