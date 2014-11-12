Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.AsyncFileUpload = function(element) {
    Sys.Extended.UI.AsyncFileUpload.initializeBase(this, [element]);

    this._hiddenField = null;
    this._inputFile = null;
    this._innerTB = null;
    this._postBackUrl = "";
    this._formName = "";
    this._iframe = null;
    this._waitTimer = null;
    this._completeBackColor = "";
    this._uploadingBackColor = "";
    this._errorBackColor = "";
    this._throbber = null;

    this._onchange$delegate = null;
    this._onload$delegate = null;
    this._app_onload$delegate = Function.createDelegate(this, this._app_onload);
    this._onmouseup$delegate = null;
}

Sys.Extended.UI.AsyncFileUpload.prototype = {

    get_throbber: function() {
        return this._throbber;
    },
    set_throbber: function(value) {
        this._throbber = value;
    },

    get_completeBackColor: function() {
        return this._completeBackColor;
    },
    set_completeBackColor: function(value) {
        this._completeBackColor = value;
    },

    get_errorBackColor: function() {
        return this._errorBackColor;
    },
    set_errorBackColor: function(value) {
        this._errorBackColor = value;
    },

    get_uploadingBackColor: function() {
        return this._uploadingBackColor;
    },
    set_uploadingBackColor: function(value) {
        this._uploadingBackColor = value;
    },

    get_inputFile: function() {
        return this._inputFile;
    },
    set_inputFile: function(value) {
        this._inputFile = value;
    },

    get_hiddenField: function() {
        return this._hiddenField;
    },
    set_hiddenField: function(value) {
        this._hiddenField = value;
    },

    get_innerTB: function() {
        return this._innerTB;
    },
    set_innerTB: function(value) {
        this._innerTB = value;
    },

    get_postBackUrl: function() {
        return this._postBackUrl;
    },
    set_postBackUrl: function(value) {
        this._postBackUrl = value;
    },

    get_formName: function() {
        return this._formName;
    },
    set_formName: function(value) {
        this._formName = value;
    },

    add_uploadStarted: function(handler) {
        this.get_events().addHandler("uploadStarted", handler);
    },
    remove_uploadStarted: function(handler) {
        this.get_events().removeHandler("uploadStarted", handler);
    },
    raiseUploadStarted: function(e) {
        var eh = this.get_events().getHandler("uploadStarted");
        if(eh) {
            return eh(this, e);
        }
        return true;
    },

    add_uploadComplete: function(handler) {
        this.get_events().addHandler("uploadComplete", handler);
    },
    remove_uploadComplete: function(handler) {
        this.get_events().removeHandler("uploadComplete", handler);
    },
    raiseUploadComplete: function(e) {
        var eh = this.get_events().getHandler("uploadComplete");
        if(eh) {
            eh(this, e);
        }
    },

    add_uploadError: function(handler) {
        this.get_events().addHandler("uploadError", handler);
    },
    remove_uploadError: function(handler) {
        this.get_events().removeHandler("uploadError", handler);
    },
    raiseUploadError: function(e) {
        var eh = this.get_events().getHandler("uploadError");
        if(eh) {
            eh(this, e);
            return true;
        }
        return false;
    },

    setThrobber: function(value) {
        if(this.get_throbber() != null) {
            this.get_throbber().style.display = value ? "" : "none";
        }
    },

    _onStart: function(fileName) {
        var valid = this.raiseUploadStarted(new Sys.Extended.UI.AsyncFileUploadEventArgs(fileName, null, null, null));
        if(typeof valid == 'undefined') {
            valid = true;
        }

        return valid;
    },

    initialize: function() {
        Sys.Extended.UI.AsyncFileUpload.callBaseMethod(this, "initialize");
        Sys.Application.add_load(this._app_onload$delegate);
        this._iframeName = this.get_element() + "_iframe";
        this.setThrobber(false);
    },

    dispose: function() {
        Sys.Application.remove_load(this._app_onload$delegate);
        if(this._onchange$delegate != null) {
            $common.removeHandlers(this._inputFile, {
                change: this._onchange$delegate
            });
            this._onchange$delegate = null;
        }
        if(this._onmouseup$delegate != null) {
            $common.removeHandlers(this._inputFile, {
                mouseup: this._onmouseup$delegate
            });
            this._onmouseup$delegate = null;
        }
        this._removeIframe();
        Sys.Extended.UI.AsyncFileUpload.callBaseMethod(this, "dispose");
    },

    _onmouseup: function() {
        var inputFile = this._inputFile;
        setTimeout(function() { inputFile.blur(); }, 0);
        return true;
    },

    _app_onload: function(sender, e) {
        this.setThrobber(false);
        if(this._inputFile != null) {
            if(this._onchange$delegate == null) {
                this._onchange$delegate = Function.createDelegate(this, this._onchange);
                $addHandlers(this._inputFile, {
                    change: this._onchange$delegate
                });
            }
            if(this._innerTB != null) {
                this._inputFile.blur();
                var inputFile = this._inputFile;
                setTimeout(function() { inputFile.blur(); }, 0);
                this._innerTB.style.width = (this._inputFile.offsetWidth - 107) + "px";
                this._inputFile.parentNode.style.width = this._inputFile.offsetWidth + "px";
                if(Sys.Browser.agent == Sys.Browser.InternetExplorer) {
                    this._onmouseup$delegate = Function.createDelegate(this, this._onmouseup);
                    $addHandlers(this._inputFile, {
                        mouseup: this._onmouseup$delegate
                    });
                }
            }
        }
    },

    _removeIframe: function() {
        this._removeTimer();
        if(this._iframe != null) {
            if(this._onload$delegate != null) {
                $common.removeHandlers(this._iframe, {
                    load: this._onload$delegate
                });
                this._onload$delegate = null;
            }
            document.body.removeChild(this._iframe);
            this._iframe = null;
        }
    },

    _removeTimer: function() {
        if(this._waitTimer != null) {
            window.clearTimeout(this._waitTimer);
            this._waitTimer = null;
        }
    },

    _onError: function(error) {
        var unhandledException = Sys.Extended.UI.Resources.AsyncFileUpload_UnhandledException;
        this.setThrobber(false);

        if(this.get_errorBackColor() != "") {
            if(this._innerTB != null) {
                this._innerTB.style.backgroundColor = this.get_errorBackColor();
            } else {
                this._inputFile.style.backgroundColor = this.get_errorBackColor();
            }
        }
        if(!this.raiseUploadError(new Sys.Extended.UI.AsyncFileUploadEventArgs(this._inputFile.value, null, null, error))) {
            alert(unhandledException + ": " + error);
        }
    },

    _onchange: function(e) {
        var value = this._inputFile.value;
        if(value == "") {
            return;
        }
        if(this._innerTB != null) {
            this._innerTB.value = value;
        }
        if(this._hiddenField != null) {
            this._hiddenField.value = value;
        }

        try {
            if(this._iframe == null) {
                this._onload$delegate = Function.createDelegate(this, this._onload);
                var iframe = document.createElement("IFRAME");
                iframe.width = "0";
                iframe.height = "0";
                iframe.style.display = "none";
                iframe.src = "about:blank";
                iframe.id = this._iframeName;
                iframe.name = this._iframeName;
                $addHandlers(iframe, {
                    load: this._onload$delegate
                });
                this._iframe = iframe;
                document.body.appendChild(this._iframe);
                iframe.contentWindow.name = this._iframeName;
            } else {
                this._removeIframe();
                var internalErrorMessage = Sys.Extended.UI.Resources.AsyncFileUpload_InternalErrorMessage;
                this._onError(internalErrorMessage);
            }
        } catch(ex) {
            this._onError(ex.message);
        }
    },

    _stopLoad: function(result) {
        var mainForm = document.getElementById(this._formName);
        this._removeTimer();
        this.setThrobber(false);
        mainForm.target = "_top";
        mainForm.action = this._postBackUrl;
        var length;
        var contentType = "";
        var temp = result.split("------");
        if(temp.length > 0) {
            if(temp[0] == "error") {
                this._onError(temp[1]);
                return;
            }
            length = parseInt(temp[0]);
        }
        if(temp.length > 1) {
            contentType = temp[1];
        }
        if(this.get_completeBackColor() != "") {
            if(this._innerTB != null) {
                this._innerTB.style.backgroundColor = this.get_completeBackColor();
            } else {
                this._inputFile.style.backgroundColor = this.get_completeBackColor();
            }
        }
        this.raiseUploadComplete(new Sys.Extended.UI.AsyncFileUploadEventArgs(this._inputFile.value, length, contentType, null));
    },

    _onload: function(e) {
        var cleanup = true;
        var uploader = this;
        var mainForm = document.getElementById(this._formName);
        try {
            var frameDocument = this._iframe.contentWindow.document;
            if(frameDocument == null || frameDocument.location == null) {
                var e = { "message": Sys.Extended.UI.Resources.AsyncFileUpload_UploadingProblem };
                throw (e);
            } else if(frameDocument.location.href == 'about:blank') {
                this._removeTimer();
                if(this.get_uploadingBackColor() != "") {
                    if(this._innerTB != null) {
                        this._innerTB.style.backgroundColor = this.get_uploadingBackColor();
                    } else {
                        this._inputFile.style.backgroundColor = this.get_uploadingBackColor();
                    }
                }

                var valid = this._onStart(this._inputFile.value);
                if(valid) {
                    var url = this._postBackUrl;
                    url += url.indexOf("?") === -1 ? "?" : "&";
                    mainForm.action = url + 'AsyncFileUploadID=' + this.get_element().id + '&rnd=' + Math.random().toString().replace(/\./g, "");
                    mainForm.target = this._iframeName;
                    cleanup = false;
                    this.setThrobber(true);
                    setTimeout(function() {
                        mainForm.submit();
                        uploader._waitTimer = setTimeout(function() { uploader._wait() }, 100);
                    }, 0);
                    return true;
                }
            } else {
                //----------------------------------------
                if(frameDocument.body.innerHTML == "") {
                    return true;
                }
                //                if (this._waitTimer == null) {
                //                    setTimeout(function() { uploader._removeIframe(); }, 100);
                //                    return true;
                //                }
                //----------------------------------------
                var result = frameDocument.getElementById(this.get_element().id);
                var length;
                var contentType = "";
                if(result != null) {
                    var temp = result.innerHTML.split("------");
                    if(temp.length > 0) {
                        if(temp[0] == "error") {
                            var e = { "message": temp[1] };
                            throw (e);
                        }
                        length = parseInt(temp[0]);
                    }
                    if(temp.length > 1) {
                        contentType = temp[1];
                    }
                } else {
                    var serverError = Sys.Extended.UI.Resources.AsyncFileUpload_UnknownServerError;
                    function replace_func(p0, p1) {
                        serverError = p1;
                        return "";
                    }
                    frameDocument.body.innerHTML.replace(/Exception\]:([^\n\r]+)[\n\r]/, replace_func);
                    var exMessage = Sys.Extended.UI.Resources.AsyncFileUpload_ServerResponseError + ": '" + serverError + "'";
                    var ret = confirm(exMessage + "\n\n" + Sys.Extended.UI.Resources.AsyncFileUpload_ConfirmToSeeErrorPage);
                    if(ret) {
                        var handle = window.open("", "NotFoundInAnswer", "toolbar=0,status=1,scrollbars=1,resizable=1,width=600,height=400");
                        function onOpen() {
                            try {
                                if(!handle.document)
                                    setTimeout(onOpen, 100);
                            }
                            catch(e) { return; }
                            var _doc = handle.document;
                            _doc.open();
                            _doc.write("<body>" + frameDocument.body.innerHTML + "</body>");
                            _doc.close();
                        }
                        setTimeout(onOpen, 0);
                    }
                    var e = { "message": exMessage };
                    throw (e);
                }

                this._removeTimer();
                mainForm.target = "_top";
                mainForm.action = this._postBackUrl;
                if(this.get_completeBackColor() != "") {
                    if(this._innerTB != null) {
                        this._innerTB.style.backgroundColor = this.get_completeBackColor();
                    } else {
                        this._inputFile.style.backgroundColor = this.get_completeBackColor();
                    }
                }
                this.setThrobber(false);
                this.raiseUploadComplete(new Sys.Extended.UI.AsyncFileUploadEventArgs(this._inputFile.value, length, contentType, null));
            }
        }
        catch(ex) {
            this._removeTimer();
            mainForm.target = "_top";
            mainForm.action = this._postBackUrl;
            this._onError(ex.message);
        }
        finally {
            if(cleanup) {
                setTimeout(function() { uploader._removeIframe(); }, 100);
            }
        }
    },

    _wait: function() {
        if(this._waitTimer == null) {
            return;
        }
        var uploader = this;
        try {
            var frameDocument = this._iframe.contentWindow.document;
            var location = frameDocument.location;
            var href = location.href;
            this._waitTimer = setTimeout(function() { uploader._wait() }, 100);
        } catch(ex) {
            setTimeout(function() { uploader._removeIframe(); }, 100);
            setTimeout(function() { uploader._onError(Sys.Extended.UI.Resources.AsyncFileUpload_UploadingProblem); }, 0);
            this._waitTimer = null;
        }
    }
}

Sys.Extended.UI.AsyncFileUpload.registerClass("Sys.Extended.UI.AsyncFileUpload", Sys.Extended.UI.ControlBase);

Sys.Extended.UI.AsyncFileUploadEventArgs = function(fileName, length, contentType, errorMessage) {
    if(arguments.length != 4) throw Error.parameterCount();

    //Calling the base class constructor
    Sys.Extended.UI.AsyncFileUploadEventArgs.initializeBase(this);
    this._fileName = fileName;
    this._length = length;
    this._contentType = contentType;
    this._errorMessage = errorMessage;
}

Sys.Extended.UI.AsyncFileUploadEventArgs.prototype =
{
    get_fileName: function() {
        var slashPos = this._fileName.lastIndexOf("/");
        var backSlashPos = this._fileName.lastIndexOf("\\");

        var fileName = this._fileName.substr(((slashPos > backSlashPos) ? slashPos : backSlashPos) + 1);
        return fileName;
    },
    get_path: function() {
        return this._fileName;
    },
    get_length: function() {
        return this._length;
    },
    get_contentType: function() {
        return this._contentType;
    },
    get_errorMessage: function() {
        return this._errorMessage;
    }
}

Sys.Extended.UI.AsyncFileUploadEventArgs.registerClass('Sys.Extended.UI.AsyncFileUploadEventArgs', Sys.EventArgs);