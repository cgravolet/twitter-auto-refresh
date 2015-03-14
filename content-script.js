/**
 * Twitter Refresh
 * @author Charles Gravolet
 * @version 1.0
 */
var TwitterRefresh = {

	init: function () {
		var self = this;

		function getNewItemsBar() {
			var newItemsBar = document.getElementsByClassName("js-new-items-bar-container");

			if (newItemsBar.length) {
				document.removeEventListener("DOMSubtreeModified", getNewItemsBar);
				self.setNewItemsBar(newItemsBar[0]);
			}
		}

		// Listen for changes to the document in order to find the new-items bar
		document.addEventListener("DOMSubtreeModified", getNewItemsBar);

		return this;
	},

	addToggleButton: function() {
		var globalActions = document.getElementById("global-actions");

		if (globalActions) {
			var li   = document.createElement("li");
			var a    = document.createElement("a");
			var icon = document.createElement("span");
			var text = document.createElement("span");

			this.refreshIcon = icon;
			this.setColorOfRefreshIcon();

			// Setup elements
			icon.className = "Icon Icon--refresh Icon--large";
			text.className = "text";
			a.className    = "js-tooltip js-dynamic-tooltip";
			a.setAttribute("href", "#");
			a.setAttribute("data-nav", "auto-refresh");
			a.setAttribute("data-placement", "bottom");
			a.addEventListener("click", this.toggleAutoRefresh.bind(this));

			// Append elements to the document
			text.appendChild(document.createTextNode("Toggle Auto-Refresh"));
			a.appendChild(icon);
			a.appendChild(text);
			li.appendChild(a);
			globalActions.appendChild(li);
		}
	},

	enabled: function (setting) {

		if (setting === true) {
			localStorage.setItem("twitterAutoRefresh", "true");
			this.refreshTimeline();
			return true;
		} else if (setting === false) {
			localStorage.setItem("twitterAutoRefresh", "false");
			return false;
		}

		return localStorage.getItem("twitterAutoRefresh") === "false" ? false : true;
	},

	refreshTimeline: function () {
		var newTweets = this.newItemsBar.getElementsByClassName("js-new-tweets-bar");

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

	setColorOfRefreshIcon: function () {

		if (this.enabled()) {
			this.refreshIcon.style.color = "";
		} else {
			this.refreshIcon.style.color = "#CCCCCC";
		}
	},

	setNewItemsBar: function (newItemsBar) {
		this.newItemsBar = newItemsBar;

		// Add listener for new items bar
		this.newItemsBar.addEventListener("DOMSubtreeModified", this.refreshTimeline.bind(this));

		// Add toggle switch to the twitter header
		this.addToggleButton();
	},

	toggleAutoRefresh: function (e) {
		e.preventDefault();
		this.enabled(this.enabled() ? false : true);
		this.setColorOfRefreshIcon();
	}
};

var twitterRefresh = Object.create(TwitterRefresh).init();
