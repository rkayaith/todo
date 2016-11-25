import { StyleSheet } from 'react-native'

import { style } from '../styles'

export const editorstyle = {
	contentRow: {
		height: 72,
		flexDirection: 'row',
		alignItems: 'center',
		// paddingLeft: 16,
		// paddingRight: 4,
		paddingHorizontal: 16,
	},
	contentIcon: {
		height: 72,
		alignItems: 'flex-start',
		width: 56,
	},
	contentContainer: {
		justifyContent: 'center',
		flex: 1,
	},
	contentLabel: {
		...style.text,
		fontSize: 16,
	},
	contentText: {
		...style.text,
		fontSize: 14,
	},
	contentAction: {
		width: 24,
		height: 24,
	},
}
