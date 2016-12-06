import { style, colors } from '../styles'

export const editorstyle = {
	contentRow: {
		height: 72,
		flexDirection: 'row',
		alignItems: 'center',
	},
	contentIcon: {
		height: 24,
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
		color: colors.alpha(colors.black, 0.7),
	},
	contentAction: {
		width: 24,
		height: 24,
	},
}
