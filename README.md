An Android todo list with automatic sorting based on the urgent-important matrix.
Written in JavaScript with React Native.


TODO:

	- check if performance has degraded
	- break up components.js

	Features:
		- save item changes on app close
		- navigation using android back button
		- countdown to urgent date in list
		- undo button

	UX:
		- add app icon

		- improve icons in notifications
		- improve text formatting in notifications (fork react-native-push-notification and use Html.fromHtml())

		- improve item editor behaviour when keyboard is open
		- add section headers in item editor

		- fix TouchableNativeFeedback bug where checking off an item that
			moves as a result won't show release feedback
		- control borderless Touchable size

		- improve animations (use Animated API instead of LayoutAnimation)
