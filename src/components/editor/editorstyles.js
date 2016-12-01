import { style } from '../styles'

export const editorstyle = {
	contentRow: {
		height: 72,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
	},
	contentIcon: {
		height: 24,
		// alignItems: 'flex-start',
		width: 24,
		marginRight: 72 - 24 - 16,
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
