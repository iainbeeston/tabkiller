var TabKiller = {
        consoleService : Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService),

	BEHAVIOR_ASK                 : -1,
	BEHAVIOR_REDIRECT_TO_CURRENT : 0,
	BEHAVIOR_REDIRECT_TO_WINDOW  : 1,
	BEHAVIOR_IGNORE              : 2,

	get strbundle() {
		if (!this._strbundle)
			this._strbundle = document.getElementById('tabkiller_bundle');
		return this._strbundle;
	},
	_strbundle : null,

	get PromptService() {
		if (!this._PromptService)
			this._PromptService = Components
					.classes['@mozilla.org/embedcomp/prompt-service;1']
					.getService(Components.interfaces.nsIPromptService);
		return this._PromptService;
	},
	_PromptService : null,

	getTabs : function(aTabBrowser) {
		this.consoleService.logStringMessage("tabkiller.getTabs()");
		var tabs = aTabBrowser.ownerDocument.evaluate(
				'descendant::*[local-name()="tab"]',
				aTabBrowser.mTabContainer,
				null,
				XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
				null
			);
		var array = [];
		for (var i = 0, maxi = tabs.snapshotLength; i < maxi; i++) {
			array.push(tabs.snapshotItem(i));
		}
		return array;
	},

	getTabStrip : function(aTabBrowser) {
		this.consoleService.logStringMessage("tabkiller.getTabStrip()");
		var strip = aTabBrowser.mStrip;
		return (strip && strip.localName == 'hbox') ?
				strip :
				aTabBrowser.tabContainer.parentNode;
	},

	stopRendering : function() {
		this.consoleService.logStringMessage("tabkiller.stopRendering()");
		window['piro.sakura.ne.jp'].stopRendering.stop();
	},
	startRendering : function() {
		this.consoleService.logStringMessage("tabkiller.startRendering()");
		window['piro.sakura.ne.jp'].stopRendering.start();
	},

	init : function() {
		this.consoleService.logStringMessage("tabkiller.init()");
		window.removeEventListener('load', this, false);

		this.killTabbrowser(document.getElementById('content'));

		// Delete the item "Open all tabs"
		if (window.HistoryMenu &&
			window.HistoryMenu.populateUndoSubmenu)
			eval('window.HistoryMenu.populateUndoSubmenu = '+window.HistoryMenu.populateUndoSubmenu.toSource().replace(
				/undoPopup.appendChild\(document.createElement\("menuseparator"\)\);/i,
				'return;'
			));

		var undoCloseTabMenu = document.getElementById('historyUndoMenu');
		if (document.getElementById('historyUndoWindowMenu')) {
			undoCloseTabMenu.setAttribute('collapsed', true);
		}
		else {
			undoCloseTabMenu.setAttribute('label', this.strbundle.getString('undo_close_window'));
			undoCloseTabMenu.removeAttribute('collapsed');

			if (window.closeWindow)
				eval('window.closeWindow = '+window.closeWindow.toSource().replace(
					/\{/i,
					'{ TabKiller.addWindowToUndoCache();'
				));

			if (window.undoCloseTab)
				eval('window.undoCloseTab = '+window.undoCloseTab.toSource().replace(
					/ss.undoCloseTab\(/i,
					'TabKiller.restoreWindowFromUndoCache('
				));
		}

		document.documentElement.setAttribute('tabkiller-enabled', true);
	},

	killTabbrowser : function(aTabBrowser) {
		this.consoleService.logStringMessage("tabkiller.killTabbrowser()");
		if ('__tabkiller__initialized' in aTabBrowser) return;

		var tabs = this.getTabs(aTabBrowser);
		tabs.forEach(function(aTab) {
			if (aTab == aTabBrowser.selectedTab) return;
			aTabBrowser.removeTab(aTab);
		});

		var strip = this.getTabStrip(aTabBrowser);
		strip.collapsed = true;
		strip.hidden    = true;

		aTabBrowser.__tabkiller__originalAddTab    = aTabBrowser.addTab;
		aTabBrowser.__tabkiller__originalRemoveTab = aTabBrowser.removeTab;

		aTabBrowser.addTab = function(aURI, aReferrer, aCharset) {
			var sv = TabKiller;
			if (sv.tempDisabled) {
				return this.__tabkiller__originalAddTab.apply(this, arguments);
			}
			sv.performTabOpenRequest(this, aURI, aReferrer, aCharset);
			return this.selectedTab;
		};

		aTabBrowser.removeTab = function(aTab) {
			var sv = TabKiller;
			if (sv.tempDisabled) {
				return this.__tabkiller__originalRemoveTab.apply(this, arguments);
			}
			sv.performTabCloseRequest(this, aTab);
			return aTab;
		};
		aTabBrowser.setStripVisibilityTo = function(aShow) {};
		aTabBrowser.getStripVisibility = function() { return false; };

		aTabBrowser.mTabContainer.mTabstrip.scrollByIndex = function() {};
		aTabBrowser.mTabContainer.mTabstrip.scrollByPixels = function() {};
		aTabBrowser.mTabContainer.mTabstrip._autorepeatbuttonScroll = function() {};
		aTabBrowser.mTabContainer.mTabstrip._smoothScrollByPixels = function() {};
		aTabBrowser.mTabContainer.mTabstrip._startScroll = function() {};

		aTabBrowser.__tabkiller__initialized = true;
	},

	performTabOpenRequest : function(aTabBrowser, aURI, aReferrer, aCharset) {
		this.consoleService.logStringMessage("tabkiller.performTabOpenRequest()");
		var referrer = null,
			charset = null;
		if (aReferrer && typeof aReferrer === 'object') {
			if (aReferrer instanceof Components.interfaces.nsIURI) {
				referrer = aReferrer;
				charset = aCharset;
			}
			else {
				referrer = aReferrer.referrerURI;
				charset = aReferrer.charset;
			}
		}
		switch (this.getBehaviorForRequest('open', aURI)) {
			case this.BEHAVIOR_REDIRECT_TO_WINDOW:
				window.openDialog(location.href, '_blank', 'chrome,all,dialog=no', aURI, charset, referrer);
				break;
			case this.BEHAVIOR_REDIRECT_TO_CURRENT:
				aTabBrowser.loadURI(aURI, referrer, charset);
				break;
			default:
			case this.BEHAVIOR_IGNORE:
				break;
		}
	},

	performTabCloseRequest : function(aTabBrowser, aTab) {
		switch (this.getBehaviorForRequest('close')) {
			case this.BEHAVIOR_REDIRECT_TO_WINDOW:
				if ('TryToCloseWindow' in window)
					window.TryToCloseWindow();
				else if ('TryToCloseBrowserWindow' in window)
					window.TryToCloseBrowserWindow();
				else
					window.close();
				break;
			case this.BEHAVIOR_REDIRECT_TO_CURRENT:
				aTab.linkedBrowser.loadURI('about:blank');
				break;
			default:
			case this.BEHAVIOR_IGNORE:
				break;
		}
	},

	getBehaviorForRequest : function(aType) {
		this.consoleService.logStringMessage("tabkiller.getBehaviorForRequest()");
		var behavior = this.getPref('extensions.tabkiller.tabs.'+aType+'.behavior');
		if (behavior != this.BEHAVIOR_ASK) return behavior;

		var args = Array.slice(arguments);
		args.shift();
		var check = { value : false };
		var prompt = this.PromptService;
		var strbundle = this.strbundle;
		switch (prompt.confirmEx(
				window,
				strbundle.getString('tab_'+aType+'_behavior_title'),
				strbundle.getFormattedString('tab_'+aType+'_behavior_text', args),
				(prompt.BUTTON_TITLE_IS_STRING * prompt.BUTTON_POS_0) |
				(prompt.BUTTON_TITLE_IS_STRING * prompt.BUTTON_POS_1) |
				(prompt.BUTTON_TITLE_IS_STRING * prompt.BUTTON_POS_2),
				strbundle.getString('tab_'+aType+'_behavior_current'),
				strbundle.getString('tab_'+aType+'_behavior_ignore'),
				strbundle.getString('tab_'+aType+'_behavior_window'),
				strbundle.getString('tab_'+aType+'_behavior_never'),
				check
			)) {
			case 0: behavior = this.BEHAVIOR_REDIRECT_TO_CURRENT; break;
			case 1: behavior = this.BEHAVIOR_IGNORE; break;
			case 2: behavior = this.BEHAVIOR_REDIRECT_TO_WINDOW; break;
		}
		if (check.value)
			this.setPref('extensions.tabkiller.tabs.'+aType+'.behavior', behavior);

		return behavior;
	},

	addWindowToUndoCache : function() {
		this.consoleService.logStringMessage("tabkiller.addWindowToUndoCache()");
		const WindowManager = Components
				.classes['@mozilla.org/appshell/window-mediator;1']
				.getService(Components.interfaces.nsIWindowMediator);
		var targets = WindowManager.getEnumerator('navigator:browser', true),
			target,
			windows = [];
		while (targets.hasMoreElements()) {
			target = targets.getNext().QueryInterface(Components.interfaces.nsIDOMWindowInternal);
			if (target != window)
				windows.push(target);
		}

		if (!windows.length) return;

		const SS = Components
					.classes['@mozilla.org/browser/sessionstore;1']
					.getService(Components.interfaces.nsISessionStore);
		var state = SS.getWindowState(window);
		var title = gBrowser.selectedTab.getAttribute('label');

		windows.forEach(function(aWindow) {
			aWindow.TabKiller.stopRendering();
			aWindow.TabKiller.disable();

			current = aWindow.gBrowser.selectedTab;
			SS.setWindowState(aWindow, state, false);

			aWindow.TabKiller.getTabs(aWindow.gBrowser)
				.forEach(function(aTab) {
					if (aTab == current) return;
					aTab.setAttribute('label', title);
					aWindow.gBrowser.removeTab(aTab);
				});

			aWindow.setTimeout(function() {
				aWindow.TabKiller.enable();
				aWindow.TabKiller.startRendering();
			}, 10);
		}, this);
	},

	restoreWindowFromUndoCache : function(aWindow, aIndex) {
		this.consoleService.logStringMessage("tabkiller.restoreWindowFromUndoCache()");
		this.stopRendering();
		this.disable();

		const SS = Components
					.classes['@mozilla.org/browser/sessionstore;1']
					.getService(Components.interfaces.nsISessionStore);
		var current = gBrowser.selectedTab;

		SS.undoCloseTab(aWindow, aIndex);
		var state = SS.getWindowState(window);

		var index = -1;
		this.getTabs(gBrowser).some(function(aTab, aIndex) {
			if (aTab == current) return false;
			index = aIndex;
                        // The number of items in the session history
                        // is about and in one location is: When
                        // blank, nsISessionStore do not leave in the
                        // history tab. In other words, it takes
                        // advantage of the fact, you are not left in the
                        // history of the "closed tabs". I mean you
                        // can close the tab.
			aTab.linkedBrowser.contentWindow.location.replace('about:blank');
			gBrowser.removeTab(aTab);
			return true;
		});

		var self = this;
		window.setTimeout(function() {
			self.enable();
			self.startRendering();
			delete current;
		}, 10);

		if (index < 0) return;

		var newWin = window.openDialog(location.href, '_blank', 'chrome,all,dialog=no', 'about:blank');
		newWin.addEventListener('load', function() {
			newWin.removeEventListener('load', arguments.callee, false);
			newWin.setTimeout(function() {
				newWin.TabKiller.stopRendering();
				newWin.TabKiller.disable();

				index += newWin.TabKiller.getTabs(newWin.gBrowser).length;
				SS.setWindowState(newWin, state, false);
				delete state;

				var tabs = newWin.TabKiller.getTabs(newWin.gBrowser);
				newWin.gBrowser.selectedTab = tabs[index];
				newWin.focus();

				window.setTimeout(function() {
					tabs.forEach(function(aTab, aIndex) {
						if (aIndex == index) return;
                                                  // A duplicate of
                                                  // the original tab of the
                                                  // window, this tab is in
                                                  // the session history
                                                  // may contain more than one
                                                  // item. So I turn
                                                  // off and close all the
                                                  // sessions history.
						try {
							if (aTab.linkedBrowser.sessionHistory)
								aTab.linkedBrowser.sessionHistory.PurgeHistory(aTab.linkedBrowser.sessionHistory.count);
						}
						catch(e) {
						}
						aTab.linkedBrowser.contentWindow.location.replace('about:blank');
					});
					window.setTimeout(function() {
						tabs.forEach(function(aTab, aIndex) {
								if (aIndex == index) return;
								newWin.gBrowser.removeTab(aTab);
							});
						newWin.TabKiller.enable();
						newWin.TabKiller.startRendering();

						delete index;
						delete tabs;
						delete newWin;
					}, 10);
				}, 10);
			}, 10);
		}, false);
	},

	disable : function() {
		this.consoleService.logStringMessage("tabkiller.disable()");
		this.tempDisabled = true;
		var strip = this.getTabStrip(gBrowser);
		strip.collapsed = false;
		strip.hidden    = false;
		strip.ordinal   = 65000;
		strip.style.overflow  = 'hidden !important';
		strip.style.maxHeight = '0 !important';
	},

	enable : function() {
		this.consoleService.logStringMessage("tabkiller.enable()");
		this.tempDisabled = false;
		var strip = this.getTabStrip(gBrowser);
		window.setTimeout(function() {
			strip.collapsed = true;
			strip.hidden    = true;
		}, 0);
	},

	handleEvent : function(aEvent) {
		this.consoleService.logStringMessage("tabkiller.handleEvent()");
		switch (aEvent.type) {
			case 'load':
				this.init();
				break;
		}
	}

};


TabKiller.__proto__ = window['piro.sakura.ne.jp'].prefs;
window.addEventListener('load', TabKiller, false);
