Type.registerNamespace("Sys.Extended.UI.HtmlEditor");
Sys.Extended.UI.HtmlEditor.LastFocusedEditPanel = null;

Sys.Extended.UI.HtmlEditor.EditPanel = function(element) {
    Sys.Extended.UI.HtmlEditor.EditPanel.initializeBase(this, [element]);

    this._loaded = false;
    this._eAfter = null;
    this._toolbars = null;
    this._modePanels = null;
    this._contentChangedElement = null;
    this._contentElement = null;
    this._contentForceElement = null;
    this._activeModeElement = null;
    this._suppressTabInDesignMode = false;
    this._keyboardEnabled = true;
    this._noPaste = false;
    this._hotkeys = null;
    this._showAnchors = false;
    this._showPlaceHolders = false;
    this._startEnd = true;
    this._relativeImages = true;

    this._documentCssPath = null;
    this._designPanelCssPath = null;
    this._imagePath_1x1 = null;
    this._imagePath_flash = null;
    this._imagePath_media = null;
    this._imagePath_anchor = null;
    this._imagePath_placeHolder = null;
    this._autofocus = true;
    this._initialCleanUp = false;
    this._noScript = false;
    this._noUnicode = false;
    this._cachedToolbarIds = null;
    this._contentPrepared = false;
    this._activeMode = null;
    this._pageRequestManager = null;
    this._formOnSubmitSaved = null;
    this._validators = null;

    this._app_onload$delegate = Function.createDelegate(this, this._app_onload);
    this._onsubmit$delegate = Function.createDelegate(this, this._onsubmit);
    this._disposed = true;
}

Sys.Extended.UI.HtmlEditor.EditPanel.prototype = {

    get_relativeImages: function() {
        return this._relativeImages;
    },

    set_relativeImages: function(value) {
        this._relativeImages = value;

        if(this._loaded)
            this.raisePropertyChanged("relativeImages");
    },

    get_startEnd: function() {
        return this._startEnd;
    },

    set_startEnd: function(value) {
        this._startEnd = value;

        if(this._loaded)
            this.raisePropertyChanged("startEnd");
    },

    get_showPlaceHolders: function() {
        return this._showPlaceHolders;
    },

    set_showPlaceHolders: function(value) {
        this._showPlaceHolders = value;

        if(this._loaded)
            this.raisePropertyChanged("showPlaceHolders");
    },

    get_showAnchors: function() {
        return this._showAnchors;
    },

    set_showAnchors: function(value) {
        this._showAnchors = value;

        if(this._loaded)
            this.raisePropertyChanged("showAnchors");
    },

    get_hotkeys: function() {
        return this._hotkeys;
    },

    set_hotkeys: function(value) {
        this._hotkeys = value;

        if(this._loaded)
            this.raisePropertyChanged("noPaste");
    },

    get_noPaste: function() {
        return this._noPaste;
    },

    set_noPaste: function(value) {
        this._noPaste = value;

        if(this._loaded)
            this.raisePropertyChanged("noPaste");
    },

    get_suppressTabInDesignMode: function() {
        return this._suppressTabInDesignMode;
    },

    set_suppressTabInDesignMode: function(value) {
        this._suppressTabInDesignMode = value;

        if(this._loaded)
            this.raisePropertyChanged("suppressTabInDesignMode");
    },

    get_keyboardEnabled: function() {
        return this._keyboardEnabled;
    },

    set_keyboardEnabled: function(value) {
        this._keyboardEnabled = value;

        if(this._loaded)
            this.raisePropertyChanged("keyboardEnabled");
    },

    get_noUnicode: function() {
        return this._noUnicode;
    },

    set_noUnicode: function(value) {
        this._noUnicode = value;

        if(this._loaded)
            this.raisePropertyChanged("noUnicode");
    },

    get_noScript: function() {
        return this._noScript;
    },

    set_noScript: function(value) {
        this._noScript = value;

        if(this._loaded)
            this.raisePropertyChanged("noScript");
    },

    get_initialCleanUp: function() {
        return this._initialCleanUp;
    },

    set_initialCleanUp: function(value) {
        this._initialCleanUp = value;

        if(this._loaded)
            this.raisePropertyChanged("initialCleanUp");
    },

    get_imagePath_1x1: function() {
        return this._imagePath_1x1;
    },

    set_imagePath_1x1: function(value) {
        this._imagePath_1x1 = value;
    },

    get_imagePath_flash: function() {
        return this._imagePath_flash;
    },

    set_imagePath_flash: function(value) {
        this._imagePath_flash = value;
    },

    get_imagePath_media: function() {
        return this._imagePath_media;
    },

    set_imagePath_media: function(value) {
        this._imagePath_media = value;
    },

    get_imagePath_anchor: function() {
        return this._imagePath_anchor;
    },

    set_imagePath_anchor: function(value) {
        this._imagePath_anchor = value;
    },

    get_imagePath_placeHolder: function() {
        return this._imagePath_placeHolder;
    },

    set_imagePath_placeHolder: function(value) {
        this._imagePath_placeHolder = value;
    },

    get_documentCssPath: function() {
        return this._documentCssPath;
    },

    set_documentCssPath: function(value) {
        this._documentCssPath = value;

        if(this._loaded)
            this.raisePropertyChanged("documentCssPath");
    },

    get_designPanelCssPath: function() {
        return this._designPanelCssPath;
    },

    set_designPanelCssPath: function(value) {
        this._designPanelCssPath = value;

        if(this._loaded)
            this.raisePropertyChanged("designPanelCssPath");
    },

    get_autofocus: function() {
        return this._autofocus;
    },

    set_autofocus: function(value) {
        this._autofocus = value;

        if(this._loaded)
            this.raisePropertyChanged("autofocus");
    },

    get_content: function() {
        if(this._activeMode == null) {
            if(this.get_contentElement() != null)
                return this._getContentForPostback();

            return "";
        }

        return this.getContent();
    },

    set_content: function(value) {
        if(!this.get_isInitialized() || !this._loaded) {
            if(this.get_contentElement() != null)
                this.get_contentElement().value = value.replace(/\"/g, "&quot;");

            return;
        }

        this.setContent(value);
        this._contentPrepared = false;

        if(this._loaded)
            this.raisePropertyChanged("content");
    },

    get_activeMode: function() {
        if(this._activeMode == null)
            return Sys.Extended.UI.HtmlEditor.ActiveModeType.Design;

        return this._activeMode;
    },

    set_activeMode: function(value) {
        if(!Sys.Extended.UI.HtmlEditor.ActiveModeType_checkValue(value))
            throw Error.argumentOutOfRange("value, function: Sys.Extended.UI.HtmlEditor.EditPanel.set_activeMode");

        var oldMode = this._activeMode,
            retval = true;

        if(this._loaded && oldMode != null && oldMode != value) {
            var eBefore = new Sys.Extended.UI.HtmlEditor.ActiveModeChangedArgs(oldMode, value, this);
            this.raiseBeforeActiveModeChanged(eBefore);

            this._eAfter = new Sys.Extended.UI.HtmlEditor.ActiveModeChangedArgs(oldMode, value, this);
            retval = this._setMode(value);
        } else {
            this._activeMode = value;
        }

        this.get_activeModeElement().value = value;

        return retval;
    },

    get_contentChangedElement: function() {
        return this._contentChangedElement;
    },

    set_contentChangedElement: function(value) {
        this._contentChangedElement = value;
    },

    get_contentElement: function() {
        return this._contentElement;
    },

    set_contentElement: function(value) {
        this._contentElement = value;
    },

    get_contentForceElement: function() {
        return this._contentForceElement;
    },

    set_contentForceElement: function(value) {
        this._contentForceElement = value;
    },

    get_activeModeElement: function() {
        return this._activeModeElement;
    },

    set_activeModeElement: function(value) {
        this._activeModeElement = value;
    },

    setCancelOnPostback: function() {
        if(this._loaded)
            this.get_contentForceElement().value = "";
    },

    setAcceptOnPostback: function() {
        if(this._loaded)
            this.get_contentForceElement().value = "1";
    },

    get_toolbars: function() {
        if(this._toolbars == null)
            this._toolbars = [];

        return this._toolbars;
    },

    set_toolbars: function(value) {
        this.get_toolbars().push(value);
    },

    get_toolbarIds: function() {
    },

    set_toolbarIds: function(value) {
        if(!this.get_isInitialized()) {
            this._cachedToolbarIds = value;

            return;
        }

        var arr = value.split(";");
        for(var i = 0; i < arr.length; i++)
            if(arr[i].length > 0)
                this.set_toolbars($find(arr[i]));
    },

    get_modePanels: function() {
        if(this._modePanels == null)
            this._modePanels = [];

        return this._modePanels;
    },

    set_modePanel: function(value) {
        this.get_modePanels().push(value);
    },

    get_modePanelIds: function() {
    },

    set_modePanelIds: function(value) {
        var arr = value.split(";");

        for(var i = 0; i < arr.length; i++)
            this.set_modePanel($find(arr[i]));
    },

    add_focused: function(handler) {
        this.get_events().addHandler("focused", handler);
    },

    remove_focused: function(handler) {
        this.get_events().removeHandler("focused", handler);
    },

    raiseFocused: function(e) {
        var eh = this.get_events().getHandler("focused");

        if(eh)
            eh(this, e);
    },

    add_activeModeChanged: function(handler) {
        this.get_events().addHandler("activeModeChanged", handler);
    },

    remove_activeModeChanged: function(handler) {
        this.get_events().removeHandler("activeModeChanged", handler);
    },

    raiseActiveModeChanged: function(e) {
        var eh = this.get_events().getHandler("activeModeChanged");

        if(eh)
            eh(this, e);
    },

    add_beforeActiveModeChanged: function(handler) {
        this.get_events().addHandler("beforeActiveModeChanged", handler);
    },

    remove_beforeActiveModeChanged: function(handler) {
        this.get_events().removeHandler("beforeActiveModeChanged", handler);
    },

    raiseBeforeActiveModeChanged: function(e) {
        var eh = this.get_events().getHandler("beforeActiveModeChanged");

        if(eh)
            eh(this, e);
    },

    get_activePanel: function() {
        var modePanel = this.get_modePanels()[this.get_activeMode()];

        if(modePanel == null || typeof modePanel == "undefined")
            throw Error.argumentOutOfRange("activeMode, function: Sys.Extended.UI.HtmlEditor.EditPanel.get_activePanel");

        return modePanel;
    },

    initialize: function() {
        this.__appLoaded__ = false;
        Sys.Extended.UI.HtmlEditor.EditPanel.callBaseMethod(this, "initialize");
        this._disposed = false;
        Sys.Application.add_load(this._app_onload$delegate);

        if(Sys && Sys.WebForms && Sys.WebForms.PageRequestManager) {
            this._pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();

            if(this._pageRequestManager) {
                this._partialUpdateEndRequestHandler = Function.createDelegate(this, this._partialUpdateEndRequest);
                this._pageRequestManager.add_endRequest(this._partialUpdateEndRequestHandler);

                this._invokingRequestHandler = Function.createDelegate(this, this._invokingRequest);
                Sys.Net.WebRequestManager.add_invokingRequest(this._invokingRequestHandler);

                this._completedRequestHandler = Function.createDelegate(this, this._completedRequest);
                Sys.Net.WebRequestManager.add_completedRequest(this._completedRequestHandler);
            }
        }

        Sys.Extended.UI.HtmlEditor.addFormOnSubmit(this._onsubmit$delegate, this);
    },

    dispose: function() {
        this._loaded = false;
        this._disposed = true;

        if(this._pageRequestManager) {
            if(this._invokingRequestHandler) {
                this._pageRequestManager.remove_endRequest(this._partialUpdateEndRequestHandler);
                this._partialUpdateEndRequestHandler = null;

                Sys.Net.WebRequestManager.remove_invokingRequest(this._invokingRequestHandler);
                this._invokingRequestHandler = null;

                Sys.Net.WebRequestManager.remove_completedRequest(this._completedRequestHandler);
                this._completedRequestHandler = null;
            }

            this._pageRequestManager = null;
        }

        Sys.Extended.UI.HtmlEditor.removeFormOnSubmit(this._onsubmit$delegate);

        Sys.Application.remove_load(this._app_onload$delegate);
        this.disableToolbars();
        Sys.Extended.UI.HtmlEditor.EditPanel.callBaseMethod(this, "dispose");
    },

    _onsubmit: function(e) {
        if(!this._contentPrepared) {
            this._prepareContentForPostback(this.get_content());
            this._contentPrepared = true;
        }

        return true;
    },

    _invokingRequest: function(sender, args) {
        if(this._contentPrepared)
            return;

        var webRequest = args.get_webRequest(),
            body = webRequest.get_body();

        // change body here...
        var reg = new RegExp("([\\?&])(" + this.get_contentElement().name + "=)([^&$]*)([&$])", "g");
        this._prepareContentForPostback(this.get_content());
        body = body.replace(reg, "$1$2" + escape(this.get_contentElement().value) + "$4");

        this._contentPrepared = true;
        webRequest.set_body(body);
    },

    _completedRequest: function(sender, args) {
        this._contentPrepared = false;
    },

    _partialUpdateEndRequest: function(sender, args) {
        this._contentPrepared = false;

        if(Sys.Extended.UI.HtmlEditor.isIE && this.__blured) {
            this.__blured = false;
            this.get_activePanel()._focus();
        }
    },

    _app_onload: function(sender, e) {
        if(this.__appLoaded__)
            return;

        this.__appLoaded__ = true;
        if(this._disposed)
            return;

        var editPanel = this;
        this._loaded = true;

        this.set_activeMode(parseInt(this.get_activeModeElement().value));

        if(this._cachedToolbarIds != null) {
            this.set_toolbarIds(this._cachedToolbarIds);
            this._cachedToolbarIds = null;
        }

        this._validators = this.get_modePanels()[Sys.Extended.UI.HtmlEditor.ActiveModeType.Html].get_element().Validators;
        this._shouldResize = false;

        if(Sys.Extended.UI.HtmlEditor.isIE && document.compatMode != "BackCompat")
            this._shouldResize = true;

        if(this._shouldResize) {
            var modePanels = this.get_modePanels(),
                iframePanel = modePanels[Sys.Extended.UI.HtmlEditor.ActiveModeType.Design];

            if(iframePanel == null)
                iframePanel = modePanels[Sys.Extended.UI.HtmlEditor.ActiveModeType.Preview];

            var htmlPanel = modePanels[Sys.Extended.UI.HtmlEditor.ActiveModeType.Html];
            if(iframePanel != null && htmlPanel != null) {
                var iframePanelElement = iframePanel.get_element();
                iframePanelElement.style.display = "";

                var height = iframePanelElement.offsetHeight,
                    invisible = false,
                    save;

                if(height == 0) {
                    invisible = true;
                    save = Sys.Extended.UI.HtmlEditor.setElementVisibility(iframePanelElement.parentNode);
                    height = iframePanelElement.offsetHeight;
                }

                htmlPanel.get_element().style.height = height + "px";
                if(invisible) {
                    Sys.Extended.UI.HtmlEditor.restoreElementVisibility(save);
                    delete save;
                }

                iframePanelElement.style.display = "none";
            }
        }

        var content = this.get_contentElement().value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
        this.setContent(this._initialCleanUp ? Sys.Extended.UI.HtmlEditor.cleanUp(content.replace(/[\n\r]+/g, " ")) : content);

        this.setAcceptOnPostback();
    },

    _setActive: function() {
        for(var i = 0; i < this.get_toolbars().length; i++)
            this.get_toolbars()[i].set_activeEditPanel(this, true);

        if(this._eAfter != null) {
            this.raisePropertyChanged("activeMode");
            this.raiseActiveModeChanged(this._eAfter);
            this._eAfter = null;
        }
    },

    _focused: function(prize) {
        if(!(typeof prize != "undefined" && prize))
            for(var i = 0; i < this.get_toolbars().length; i++)
                this.get_toolbars()[i].set_activeEditPanel(this);

        //this.raiseFocused(new Sys.EventArgs());
        Sys.Extended.UI.HtmlEditor.LastFocusedEditPanel = this;
    },

    _really_focused: function() {
        this._focused();
        this.raiseFocused(new Sys.EventArgs());
    },

    updateToolbar: function() {
        this._focused();
    },

    getContent: function() {
        var ret = this.get_activePanel().get_content()
            .replace(/<\/?html(?=\s|>)(?:[^>]*?)>/gi, "")
            .replace(/<\/?head(?=\s|>)(?:[^>]*?)>/gi, "")
            .replace(/<\/?body(?=\s|>)(?:[^>]*?)>/gi, "")
            .replace(/^([\n\r]+)/, "").replace(/([\n\r]+)$/, "");

        if(!Sys.Extended.UI.HtmlEditor.isIE)
            ret = ret.replace(/^<br\s*[\/]*>$/, "");

        return ret;
    },

    setContent: function(content) {
        var temptext = content;
        if(this.get_noScript())
            temptext = temptext.replace(/(<script(?:[^>]*?)>(?:[^<]*?)<\/script(?:[^>]*?)>)/ig, "");

        temptext = temptext.replace(/<\/?html(?=\s|>)(?:[^>]*?)>/gi, "")
            .replace(/<\/?head(?=\s|>)(?:[^>]*?)>/gi, "")
            .replace(/<\/?body(?=\s|>)(?:[^>]*?)>/gi, "")
            .replace(/^([\n\r]+)/, "").replace(/([\n\r]+)$/, "");

        this._prepareContentForPostback(temptext);

        this.get_activePanel().set_content(temptext);
        this._validate(null, temptext);
    },

    _validate: function(event, content) {
        var validators = this._validators;
        if(validators != null && typeof validators != "undefined") {
            this._contentForValidation = content;

            try {
                for(var i = 0; i < validators.length; i++)
                    window.ValidatorValidate(validators[i], null, event);

                window.ValidatorUpdateIsValid();
            } catch(ex) { }

            this._contentForValidation = null;
        }
    },

    _prepareContentForPostback: function(value) {
        this.get_contentElement().value = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
    },

    _getContentForPostback: function() {
        return this.get_contentElement().value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");
    },

    _setMode: function(mode) {
        var activePanel = this.get_activePanel();
        if(!activePanel._activated) {
            var editPanel = this;
            setTimeout(function() {
                editPanel._setMode(mode);
            }, 10);

            return false;
        }

        var content = this.get_content();
        if(Sys.Extended.UI.HtmlEditor.isOpera)
            content = content.replace(/\r/ig, "");

        if(this._shouldResize && mode == Sys.Extended.UI.HtmlEditor.ActiveModeType.Html) {
            var iframePanel = this.get_activePanel(),
                htmlPanel = this.get_modePanels()[Sys.Extended.UI.HtmlEditor.ActiveModeType.Html];

            if(iframePanel != null && htmlPanel != null) {
                var iframePanelElement = iframePanel.get_element(),
                    height = iframePanelElement.offsetHeight,
                    invisible = false,
                    save;

                if(height == 0) {
                    invisible = true;
                    save = Sys.Extended.UI.HtmlEditor.setElementVisibility(iframePanelElement.parentNode);
                    height = iframePanelElement.offsetHeight;
                }

                htmlPanel.get_element().style.height = height + "px";
                if(invisible) {
                    Sys.Extended.UI.HtmlEditor.restoreElementVisibility(save);
                    delete save;
                }
            }
        }

        this.disableToolbars(mode);

        activePanel._deactivate();

        this._activeMode = mode;
        this.setContent(content);

        return true;
    },

    disableToolbars: function(mode) {
        for(var i = 0; i < this.get_toolbars().length; i++) {
            var toolbar = this.get_toolbars()[i];

            if(toolbar._loaded)
                toolbar.disable(mode);
        }
    },

    openWait: function() {
    },

    closeWait: function() {
    }
}

Sys.Extended.UI.HtmlEditor.EditPanel.registerClass("Sys.Extended.UI.HtmlEditor.EditPanel", Sys.UI.Control);