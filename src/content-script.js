/**
 * Twitter Refresh
 * @author Charles Gravolet
 * @version 1.0
 */
var TwitterRefresh = {

	/**
	 * Initialization method.
	 *
	 * @returns {TwitterRefresh}
	 */
	init: function () {
		var self = this;

		function getNewItemsBar() {
			var newItemsBar = document.getElementsByClassName(
					"js-new-items-bar-container");

			if (newItemsBar.length) {
				document.removeEventListener("DOMSubtreeModified",
						getNewItemsBar);
				self.setNewItemsBar(newItemsBar[0]);
			}
		}

		// Listen for changes to the document in order to find the new-items bar
		document.addEventListener("DOMSubtreeModified", getNewItemsBar);

		return this;
	},

	/**
	 * Adds a refresh button to the heading of the twitter timeline to give the
	 * user a way to toggle auto-refresh on and off.
	 */
	addToggleButton: function () {
		var globalActions = document.getElementById("global-actions");

		if (globalActions) {
			var li   = document.createElement("li");
			var a    = document.createElement("a");
			var icon = document.createElement("span");
			var text = document.createElement("span");

			this.refreshIcon = icon;
			this.updateColorOfRefreshIcon();

			// Setup elements
			icon.className = "Icon Icon--refresh Icon--large";
			text.className = "text";
			a.className    = "js-tooltip js-dynamic-tooltip";
			a.setAttribute("href", "#");
			a.setAttribute("data-nav", "auto-refresh");
			a.setAttribute("data-placement", "bottom");
			a.addEventListener("click", this.toggleAutoRefresh.bind(this));

			// Append elements to the document
			text.appendChild(document.createTextNode("Auto-Refresh"));
			a.appendChild(icon);
			a.appendChild(text);
			li.appendChild(a);
			globalActions.appendChild(li);
		}
	},

	/**
	 * Getter/Setter for the enabled setting which is stored in the browser's
	 * localStorage.
	 *
	 * @param {Boolean} setting
	 * @returns {Boolean}
	 */
	enabled: function (setting) {

		if (setting === true) {
			localStorage.setItem("twitterAutoRefresh", "true");
			this.refreshTimeline();
			return true;
		} else if (setting === false) {
			localStorage.setItem("twitterAutoRefresh", "false");
			return false;
		}

		return localStorage.getItem("twitterAutoRefresh") === "false" ?
				false : true;
	},

	/**
	 * When a change is detected to the timeline, this method should attempt to
	 * trigger a click event on the 'View new tweets' button that appears when
	 * the timeline needs to be refreshed.
	 */
	refreshTimeline: function () {
		var newTweets = this.newItemsBar.getElementsByClassName(
				"js-new-tweets-bar");

		if (newTweets.length && this.enabled()) {

			window.setTimeout(function () {
				var clickEvent = new MouseEvent("click", {
					view:       window,
					bubbles:    true,
					cancelable: true
				});
				newTweets[0].dispatchEvent(clickEvent);
			}, 100);
		}
	},

	/**
	 * When the new-items bar is detected, this method will save a reference to
	 * it and attach event listeners that will call the refresh method when a
	 * change in the timeline is detected.
	 *
	 * @param {Object} newItemsBar A reference to the new-items bar element
	 */
	setNewItemsBar: function (newItemsBar) {
		this.newItemsBar = newItemsBar;

		// Add listener for new items bar
		this.newItemsBar.addEventListener("DOMSubtreeModified",
				this.refreshTimeline.bind(this));

		// Add toggle switch to the twitter header
		this.addToggleButton();
	},

	/**
	 * Enables/Disables the auto-refresh functionality and updates the UI.
	 *
	 * @param {Object} e A click event object
	 */
	toggleAutoRefresh: function (e) {
		e.preventDefault();
		this.enabled(this.enabled() ? false : true);
		this.updateColorOfRefreshIcon();
	},

	/**
	 * Updated the color of the refresh icon based on whether auto-refresh is
	 * enabled or disabled.
	 */
	updateColorOfRefreshIcon: function () {

		if (this.enabled()) {
			this.refreshIcon.style.color = "";
		} else {
			this.refreshIcon.style.color = "#CCCCCC";
		}
	}
};

var twitterRefresh = Object.create(TwitterRefresh).init();
