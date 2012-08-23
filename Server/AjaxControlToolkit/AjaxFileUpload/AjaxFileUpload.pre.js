Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.AjaxFileUpload = function (element) {
    Sys.Extended.UI.AjaxFileUpload.initializeBase(this, [element]);

    this._postBackUrl = "";
    this._progressBar = null;
    this._inputFileElement = null;
    this._iframe = null;
    this._vForm = null;
    this._filesInQueue = new Array();
    this._currentQueueIndex = 0;
    this._webRequest = null;
    this._executor = null;
    this._isFileApiSupports = false;
    this._waitTimer = null;

    // properties    
    this._contextKey = null;
    this._throbber = null;
    this._guid = "";
    this._isCancelUpload = false;
    this._isUploading = false;
    this._maximumNumberOfFiles = 10;
    this._allowedFileTypes = '';

    // templates
    this._inputFileTemplate = null;

    this._inputFileElement = document.getElementById(this.get_id() + "_InputFileElement");
    this._queueContainer = document.getElementById(this.get_id() + "_QueueContainer");
    this._selectFileButton = document.getElementById(this.get_id() + "_SelectFileButton");
    this._uploadOrCancelButton = document.getElementById(this.get_id() + "_UploadOrCancelButton");

    this._progressBar = document.getElementById(this.get_id() + "_ProgressBar");
    this._progressBarContainer = document.getElementById(this.get_id() + "_ProgressBarContainer");
    this._fileStatusContainer = document.getElementById(this.get_id() + "_FileStatusContainer");

    this._footer = document.getElementById(this.get_id() + "_Footer");

    this._html5DropZone = document.getElementById(this.get_id() + "_Html5DropZone");
    this._html5InputFile = document.getElementById(this.get_id() + "_Html5InputFile");

    this._onFileSelected$delegate = Function.createDelegate(this, this._onFileSelected);
    this._onUploadOrAbort$delegate = Function.createDelegate(this, this._onUploadOrAbort);
    this._html5OnFileDropped$delegate = Function.createDelegate(this, this._html5OnFileDropped);
    this._html5OnDragOver$delegate = Function.createDelegate(this, this._html5OnDragOver);
    this._removeFromQueue$delegate = Function.createDelegate(this, this._removeFromQueue);

    // Hook into the ASP.NET WebForm_OnSubmit function to remove/disable input file controls prior to submission
    if ((typeof (WebForm_OnSubmit) == 'function') && !Sys.Extended.UI.AjaxFileUpload._originalWebForm_OnSubmit) {
        Sys.Extended.UI.AjaxFileUpload._originalWebForm_OnSubmit = WebForm_OnSubmit;
        WebForm_OnSubmit = Sys.Extended.UI.AjaxFileUpload.WebForm_OnSubmit;
    }
}

Sys.Extended.UI.AjaxFileUpload.prototype = {

    initialize: function () {
        Sys.Extended.UI.AjaxFileUpload.callBaseMethod(this, "initialize");

        if (window.File && window.FileReader && window.FileList && window.Blob && (new XMLHttpRequest()).upload)
            this._isFileApiSupports = true;

        this._initTemplates();
        this._initHandlers();
        this._initLayout();
        this._reset();
        this._showFilesCount();
    },

    _initTemplates: function () {
        this._inputFileTemplate = {
            nodeName: 'input',
            properties: {
                type: 'file',
                style: {
                    zIndex: 999,
                    cursor: 'pointer',
                    position: 'absolute'
                }
            }
        };
    },

    _initHandlers: function () {

        var fileElement = null;
        if (!this._isFileApiSupports) {
            fileElement = this._inputFileElement;
        }
        else {
            $addHandlers(this._html5DropZone, { 'drop': this._html5OnFileDropped$delegate });
            $addHandlers(this._html5DropZone, { 'dragover': this._html5OnDragOver$delegate });
            fileElement = this._html5InputFile;
        }

        this._attachFileInputHandlers(fileElement, true);
        $addHandlers(this._uploadOrCancelButton, { 'click': this._onUploadOrAbort$delegate });
    },

    _initLayout: function () {
        var footerSize = $common.getSize(this._footer);
        var uploadButtonWidth = $common.getSize(this._uploadOrCancelButton).width;
        var progressBarContainerSize = { height: footerSize.height, width: footerSize.width - uploadButtonWidth };

        if (!this._isFileApiSupports) {
            $common.setVisible(this._html5DropZone, false);
            $common.setVisible(this._html5InputFile, false);
            fileElement = this._inputFileElement;
        }
        else {
            $common.setVisible(this._inputFileElement, false);
        }
    },

    _attachFileInputHandlers: function (fileElement, on) {
        if (on)
            $addHandlers(fileElement,
                {
                    'change': this._onFileSelected$delegate
                });
        else
            $common.removeHandlers(fileElement,
                {
                    'change': this._onFileSelected$delegate
                });
    },

    _setStatusMessage: function (msg) {
        this._fileStatusContainer.innerHTML = msg;
    },

    dispose: function () {
        if (this._isFileApiSupports) {
            Sys.Extended.UI.AjaxFileUpload._removeEvent(this._html5DropZone, 'drop', this._html5OnFileDropped$delegate);
            Sys.Extended.UI.AjaxFileUpload._removeEvent(this._html5DropZone, 'dragover', this._html5OnDragOver$delegate);
            Sys.Extended.UI.AjaxFileUpload._removeEvent(this._html5InputFile, 'change', this._onFileSelected$delegate);
        }

        Sys.Extended.UI.AjaxFileUpload._removeEvent(this._uploadOrCancelButton, 'click', this._onUploadOrAbort$delegate);

        this._removeIframe();
        this._removeVForm();
        Sys.Extended.UI.AjaxFileUpload.callBaseMethod(this, "dispose");
    },

    // functions related to file upload for modern browsers
    _html5OnFileDropped: function (event) {
        event.stopPropagation();
        event.preventDefault();
        this._html5AddFileInQueue(event.rawEvent.dataTransfer.files);
    },

    _html5OnDragOver: function (event) {
        event.stopPropagation();
        event.preventDefault();
    },

    _html5UploadFile: function (fileItem) {
        this._guid = Sys.Extended.UI.AjaxFileUpload.utils.generateGuid();

        var uploadableFile = fileItem.get_fileInputElement();

        var fd = new FormData();
        fd.append("fileId", uploadableFile.id);
        fd.append("Filedata", uploadableFile.file);

        $common.setVisible(this._progressBar, true);
        this._setDisableControls(true);
        this._html5SetPercent(0);
        this._setStatusMessage(String.format(Sys.Extended.UI.Resources.AjaxFileUpload_UploadingHtml5File, uploadableFile.file.name, Sys.Extended.UI.AjaxFileUpload.utils.sizeToString(uploadableFile.file.size)));

        var url = this._postBackUrl;
        if (url.indexOf("?") != -1)
            url += "&";
        else
            url += "?";

        this._webRequest = new Sys.Net.WebRequest();
        this._executor = new Sys.Net.XMLHttpExecutor();
        this._webRequest.set_url(url + 'contextkey=' + this._contextKey + '&guid=' + this._guid);
        this._webRequest.set_httpVerb("POST");
        this._webRequest.add_completed(this.bind(this._html5OnRequestCompleted, this));

        //this._executor.add_load(this.bind(this._html5OnComplete, this));
        this._executor.add_progress(this.bind(this._html5OnProgress, this));
        this._executor.add_uploadAbort(this.bind(this._html5OnAbort, this));
        this._executor.add_error(this.bind(this._html5OnError, this));
        this._webRequest.set_executor(this._executor);

        this._executor.executeRequest(fd);
    },

    _html5OnRequestCompleted: function (executor, eventArgs) {
        var result = null;
        if (executor.get_responseAvailable()) {
            result = executor.get_responseData();
            result = result.substring(result.indexOf('{'), result.lastIndexOf('}') + 1);
            result = Sys.Serialization.JavaScriptSerializer.deserialize(result);
        }

        this._html5SetPercent(100);

        var uploader = this;
        setTimeout(function () {
            var uploadedFile = uploader._getCurrentFileItem().get_fileInputElement().file;
            var eventArgs;
            if (result != null) {
                eventArgs = new Sys.Extended.UI.AjaxFileUploadEventArgs(uploader._guid, "Success", result.FileName,
                result.FileSize, result.ContentType, result.PostedUrl, uploader._currentQueueIndex, uploader._filesInQueue.length);
            }
            else {
                eventArgs = new Sys.Extended.UI.AjaxFileUploadEventArgs(uploader._guid, "Success", uploadedFile.fileName,
                uploadedFile.fileSize, uploadedFile.type, '', uploader._currentQueueIndex, uploader._filesInQueue.length);
            }

            uploader._raiseUploadComplete(eventArgs);
            uploader._processNextFile();
        }, 100);
    },

    _html5OnProgress: function (executor, event) {
        if (event.lengthComputable) {
            this._html5SetPercent(Math.round(event.loaded * 100 / event.total));
        }
    },

    //_html5OnComplete: function (executor, event) {
    //        this._html5SetPercent(100);
    //        var uploader = this;
    //        setTimeout(function () {
    //            var uploadedFile = uploader._getCurrentFileItem().get_fileInputElement().file;
    //            var eventArgs = new Sys.Extended.UI.AjaxFileUploadEventArgs(uploader._guid, "Success", uploadedFile.fileName,
    //                uploadedFile.fileSize, uploadedFile.type);

    //            uploader._raiseUploadComplete(eventArgs);
    //            uploader._processNextFile();
    //        }, 100);
    //},

    _html5OnAbort: function (executor, event) {
        this._setAborted();
    },

    _html5OnError: function (executor, event) {
        this._reset();
        this._setError(Sys.Extended.UI.Resources.AjaxFileUpload_UploadError);
    },

    _html5SetPercent: function (percent) {
        this._progressBar.style.width = percent + '%';
        $common.setText(this._progressBar, String.format(Sys.Extended.UI.Resources.AjaxFileUpload_UploadedPercentage, percent));
    },

    _html5AddFileInQueue: function (files) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var fileType;
            if (file.type != '') {
                fileType = file.type.substring(file.type.lastIndexOf('/') + 1);
            }
            else {
                fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
            }
            if (this._validateFileType(fileType)) {
                var uploadableFile = new Object();
                uploadableFile.file = file;
                uploadableFile.id = Sys.Extended.UI.AjaxFileUpload.utils.generateGuid();
                this._addToQueue(uploadableFile);
            }
            else {
                // need to do anything?
            }
        }
    },


    // functions related to file upload for older browsers
    _createInputFileElement: function () {

        // disfunction current input file element
        this._inputFileElement.style.zIndex = -999;
        $common.setLocation(this._inputFileElement, { x: -99999, y: -99999 });
        this._attachFileInputHandlers(this._inputFileElement, false);

        // create new input file element
        var id = this.get_id() + '_file_' + Sys.Extended.UI.AjaxFileUpload.utils.generateGuid();
        this._inputFileElement = $common.createElementFromTemplate(this._inputFileTemplate, this._inputFileElement.parentNode);
        this._inputFileElement.setAttribute('id', id);
        this._inputFileElement.setAttribute('name', id);
        this._inputFileElement.style.zIndex = 0;
        $common.setElementOpacity(this._inputFileElement, 0);
        this._attachFileInputHandlers(this._inputFileElement, true);
    },

    _uploadInput_complete: function (eventArgs) {
        this._removeVForm();
        this._raiseUploadComplete(eventArgs);
        this._processNextFile();
    },

    _setQueueStatuses: function (status, text, startIndex) {
        for (var i = startIndex; i < this._filesInQueue.length; i++) {
            var fileItem = this._filesInQueue[i];
            if (fileItem)
                fileItem.setStatus(status, text);
        }
    },

    _setAborted: function () {
        this._setStatusMessage(Sys.Extended.UI.Resources.AjaxFileUpload_UploadCanceled);
        this._setQueueStatuses("cancelled", Sys.Extended.UI.Resources.AjaxFileUpload_Canceled, this._currentQueueIndex);
        this._uploadOrCancelButton.style.disabled = '';
        this._reset();
    },

    _setError: function (msg) {
        this._setStatusMessage(msg ? msg : Sys.Extended.UI.Resources.AjaxFileUpload_DefaultError);
        this._setQueueStatuses("error", Sys.Extended.UI.Resources.AjaxFileUpload_error, this._currentQueueIndex);
        this._reset();
    },

    _reset: function (clearQueue) {
        this._isCancelUpload = false;
        this._setDisableControls(false);
        this._currentQueueIndex = 0;

        this._html5DropZone.innerHTML = Sys.Extended.UI.Resources.AjaxFileUpload_DropFiles;
        this._selectFileButton.innerHTML = Sys.Extended.UI.Resources.AjaxFileUpload_SelectFile;
        this._uploadOrCancelButton.innerHTML = Sys.Extended.UI.Resources.AjaxFileUpload_Upload;

        if (this._isFileApiSupports)
            $common.setVisible(this._progressBar, false);
        else {
            this.setThrobber(false);
            this._removeIframe();
        }

        if (clearQueue) {
            this._filesInQueue = new Array();
            this._hideSelectFileButton(false);
        }
    },

    _processNextFile: function () {
        this._currentQueueIndex += 1;
        var fileItem = this._getCurrentFileItem();

        if (fileItem == null) {
            this._setStatusMessage(Sys.Extended.UI.Resources.AjaxFileUpload_AllFilesUploaded);
            this._reset(true);
            return;
        }

        if (fileItem._isUploaded) {
            this._processNextFile();
        }
        else {
            fileItem.setStatus('uploading', Sys.Extended.UI.Resources.AjaxFileUpload_Uploading);
            if (this._isFileApiSupports)
                this._html5UploadFile(fileItem);
            else
                this._uploadInputElement(fileItem);
        }
    },

    _uploadInputElement: function (fileItem) {

        var inputElement = fileItem.get_fileInputElement();
        var uploader = this;
        uploader._guid = Sys.Extended.UI.AjaxFileUpload.utils.generateGuid();
        setTimeout(function () {
            uploader._setStatusMessage(String.format(Sys.Extended.UI.Resources.AjaxFileUpload_UploadingInputFile, Sys.Extended.UI.AjaxFileUpload.utils.getFileName(inputElement.value)));
            uploader._setDisableControls(true);
            uploader.setThrobber(true);
        }, 0);

        var url = uploader._postBackUrl;
        if (url.indexOf("?") != -1)
            url += "&";
        else
            url += "?";

        uploader._createVForm();
        uploader._vForm.appendChild(inputElement);
        uploader._vForm.action = url + 'contextkey=' + this._contextKey + '&guid=' + this._guid;
        uploader._vForm.target = uploader._iframeName;

        setTimeout(function () {
            uploader._vForm.submit();
            uploader._waitTimer = setTimeout(function () { uploader._wait() }, 100);
        }, 0);
    },

    setThrobber: function (value) {
        if (this.get_throbber() != null) {
            this.get_throbber().style.display = value ? "" : "none";
        }
    },

    // common functions for file upload for modern/older browsers
    _onFileSelected: function (evt) {
        if (!this._isFileApiSupports) {
            var fileType = this._inputFileElement.value;
            fileType = fileType.substring(fileType.lastIndexOf('.') + 1);
            if (this._validateFileType(fileType)) {
                this._addToQueue(this._inputFileElement);
                this._createInputFileElement();
            }
        }
        else {
            this._html5AddFileInQueue(evt.target.files);
        }
    },

    _showFilesCount: function () {
        var empty = (this._queueContainer.childNodes.length == 0 && this._filesInQueue.length == 0);

        $common.setVisible(this._footer, !empty);
        $common.setVisible(this._queueContainer, !empty);

        if (empty) {
            this._setStatusMessage(Sys.Extended.UI.Resources.AjaxFileUpload_SelectFileToUpload);
            return;
        }

        var s = this._filesInQueue.length > 1 ? "s" : "";
        this._setStatusMessage(String.format(Sys.Extended.UI.Resources.AjaxFileUpload_FileInQueue, this._filesInQueue.length.toString()));
    },

    _createIframe: function () {
        this._onIframeLoad$delegate = Function.createDelegate(this, this._onIframeLoad);
        var iframe = document.createElement("IFRAME");
        iframe.width = "0";
        iframe.height = "0";
        iframe.style.display = "none";
        iframe.src = "about:blank";
        iframe.id = this._iframeName;
        iframe.name = this._iframeName;
        $addHandlers(iframe, {
            load: this._onIframeLoad$delegate
        });
        this._iframe = iframe;
        document.body.appendChild(this._iframe);
        iframe.contentWindow.name = this._iframeName;
    },

    _removeIframe: function () {
        this._removeTimer();
        if (this._iframe != null) {
            if (this._onIframeLoad$delegate != null) {
                $common.removeHandlers(this._iframe, {
                    load: this._onIframeLoad$delegate
                });
                this._onIframeLoad$delegate = null;
            }
            try {
                document.body.removeChild(this._iframe);
            }
            catch (ex) {
                this._frame.parentNode.removeChild(this._iframe);
            }
            this._iframe = null;
        }
    },


    _createVForm: function () {
        var vForm;
        var formId = "___postForm" + this.get_id();
        try {
            vForm = document.createElement('<form method="post" enctype="multipart/form-data" id="' + formId + '" target="' + this._iframe.id + '">');
        } catch (ex) {
            vForm = document.createElement('form');
            vForm.setAttribute("id", formId);
            vForm.setAttribute("method", "post");
            vForm.setAttribute("target", this._iframe.id);
            vForm.setAttribute("enctype", "multipart/form-data");
        }

        vForm.setAttribute("action", "/");
        vForm.style.visibility = 'hidden';
        vForm.style.display = 'none';
        this._vForm = vForm;
        document.body.appendChild(this._vForm);
    },

    _removeVForm: function () {
        try {
            if (this._vForm) document.body.removeChild(this._vForm);
        }
        catch (ex) { }
    },

    _removeTimer: function () {
        if (this._waitTimer != null) {
            window.clearTimeout(this._waitTimer);
            this._waitTimer = null;
        }
    },

    _onIframeLoad: function (e) {
        try {
            var frameDocument = this._iframe.contentWindow.document;
            if (frameDocument == null || frameDocument.location == null
                || !frameDocument.body || frameDocument.body.innerHTML == null
                || frameDocument.body.innerHTML == '')
                return;
            if (!this._isCancelUpload) {
                var resultString = frameDocument.body.innerHTML;
                resultString = resultString.substring(resultString.indexOf('{"FileId'));
                var result = Sys.Serialization.JavaScriptSerializer.deserialize(resultString);
                var eventArgs = new Sys.Extended.UI.AjaxFileUploadEventArgs(this._guid, result.StatusMessage, result.FileName, result.FileSize, result.ContentType, result.PostedUrl, this._currentQueueIndex, this._filesInQueue.length);
                if (eventArgs.get_statusMessage() == "Success") {
                    this._removeTimer();
                    this._uploadInput_complete(eventArgs);
                } else {
                    this._setDisableControls(false);
                }
            } else {
                this._removeTimer();
                this._setAborted();
            }

        } catch (ex) {
            this._removeTimer();
            this._setError(ex.message);
        }
    },

    _wait: function () {
        if (this._waitTimer == null) {
            return;
        }
        var uploader = this;
        try {
            this._waitTimer = setTimeout(function () { uploader._wait(); }, 100);
        } catch (ex) {
            setTimeout(function () { uploader._removeIframe(); uploader._removeVForm(); }, 100);
            this._waitTimer = null;
        }
    },

    _onUploadOrAbort: function () {
        if (this._isUploading) {
            this._cancelUpload();
        } else {
            this._doUpload();
        }

    },

    _doUpload: function () {

        if (!this._filesInQueue.length || this._filesInQueue.length < 1)
            return;

        this._currentQueueIndex = -1;
        if (!this._isFileApiSupports)
            this._createIframe();

        this._processNextFile();
    },

    _cancelUpload: function () {
        this._setQueueStatuses("canceling", Sys.Extended.UI.Resources.AjaxFileUpload_Cancelling);
        this._setStatusMessage(Sys.Extended.UI.Resources.AjaxFileUpload_CancellingUpload);
        this._uploadOrCancelButton.style.disabled = 'disabled';
        this._isCancelUpload = true;

        if (this._isFileApiSupports)
            this._executor.abort();
    },

    _getCurrentFileItem: function () {
        if (this._currentQueueIndex < this._filesInQueue.length)
            return this._filesInQueue[this._currentQueueIndex];
        return null;
    },

    _hideSelectFileButton: function (val) {
        if (this._isFileApiSupports) {
            this._html5DropZone.disabled = val ? 'disabled' : '';
            this._html5InputFile.disabled = val ? 'disabled' : '';

            $common.setVisible(this._html5DropZone, !val);
        }
        $common.setVisible(this._selectFileButton.parentNode, !val);
    },

    _addToQueue: function (element) {
        var fileItem = new Sys.Extended.UI.AjaxFileUploadItem(this.get_id(), element, this._removeFromQueue$delegate);
        this._filesInQueue.push(fileItem);
        this._showFilesCount();

        fileItem.appendNodeTo(this._queueContainer);
        fileItem.setStatus('pending', Sys.Extended.UI.Resources.AjaxFileUpload_Pending);

        if (this.get_maximumNumberOfFiles() > 0 && this._filesInQueue.length >= this.get_maximumNumberOfFiles()) {
            this._hideSelectFileButton(true);
        }
    },

    _removeFromQueue: function (fileItem) {
        Array.remove(this._filesInQueue, fileItem);
        this._showFilesCount();

        this._hideSelectFileButton(false);
    },

    bind: function (fn, bind) {
        return function () {
            fn.apply(bind, arguments);
        };
    },

    _setDisableControls: function (on) {

        this._isUploading = on;
        var value = on ? 'disabled' : '';

        $common.setText(this._uploadOrCancelButton, on ? Sys.Extended.UI.Resources.AjaxFileUpload_Cancel : Sys.Extended.UI.Resources.AjaxFileUpload_Upload);
        this._uploadOrCancelButton.setAttribute('class', on ? 'ajax_fileupload_cancelbutton' : 'ajax__fileupload_uploadbutton');

        if (this._isFileApiSupports) {
            this._html5DropZone.disabled = value;
            this._html5InputFile.disabled = value;
        }
        else {
            this._inputFileElement.disabled = value;
        }
    },

    _validateFileType: function (fileType) {
        if (this.get_allowedFileTypes() != '') {
            var fileTypes = this.get_allowedFileTypes().split(',');
            for (var i = 0; i < fileTypes.length; i++) {
                if (fileTypes[i].toLowerCase() == fileType.toLowerCase()) {
                    return true;
                }
            }
        }
        else {
            return true;
        }
        return false;
    },

    // properties
    get_contextKey: function () {
        return this._contextKey;
    },
    set_contextKey: function (value) {
        this._contextKey = value;
    },

    get_throbber: function () {
        return this._throbber;
    },
    set_throbber: function (value) {
        this._throbber = value;
    },

    get_postBackUrl: function () {
        return this._postBackUrl;
    },
    set_postBackUrl: function (value) {
        this._postBackUrl = value;
    },

    get_maximumNumberOfFiles: function () {
        return this._maximumNumberOfFiles;
    },
    set_maximumNumberOfFiles: function (value) {
        this._maximumNumberOfFiles = value;
    },

    get_allowedFileTypes: function () {
        return this._allowedFileTypes;
    },
    set_allowedFileTypes: function (value) {
        this._allowedFileTypes = value;
    },

    add_uploadComplete: function (handler) {
        this.get_events().addHandler("uploadComplete", handler);
    },
    remove_uploadComplete: function (handler) {
        this.get_events().removeHandler("uploadComplete", handler);
    },
    _raiseUploadComplete: function (e) {
        var fileItem = this._getCurrentFileItem();
        fileItem.setStatus('uploaded', Sys.Extended.UI.Resources.AjaxFileUpload_Uploaded);
        fileItem._isUploaded = true;
        fileItem.hide();
        var eh = this.get_events().getHandler("uploadComplete");
        if (eh) {
            eh(this, e);
        }
    },

    add_uploadError: function (handler) {
        this.get_events().addHandler("uploadError", handler);
    },
    remove_uploadError: function (handler) {
        this.get_events().removeHandler("uploadError", handler);
    },
    raiseUploadError: function (e) {
        var eh = this.get_events().getHandler("uploadError");
        if (eh) {
            eh(this, e);
        }
    }
};


Sys.Extended.UI.AjaxFileUpload._addEvent = function (el, evname, func) {
    if (el.attachEvent)
        el.attachEvent("on" + evname, func);
    else if (el.addEventListener)
        el.addEventListener(evname, func, true);
};

Sys.Extended.UI.AjaxFileUpload._removeEvent = function (el, evname, func) {
    if (el.detachEvent)
        el.detachEvent("on" + evname, func);
    else if (el.removeEventListener)
        el.removeEventListener(evname, func, true);
};

Sys.Extended.UI.AjaxFileUpload.utils = {
    generateGuid: function () {
        var result, i, j;
        result = '';
        for (j = 0; j < 32; j++) {
            if (j == 8 || j == 12 || j == 16 || j == 20)
                result = result + '-';
            i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            result = result + i;
        }
        return result;
    },

    getFileName: function (fullPath) {
        if (!fullPath)
            return '';

        if (fullPath) {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1);
            }
            return filename;
        }

        return '';
    },

    sizeToString: function (bytes) {
        if (!bytes || bytes <= 0)
            return '0 Kb';

        var s = ['bytes', 'kb', 'MB', 'GB', 'TB', 'PB'];
        var e = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    }
};

Sys.Extended.UI.AjaxFileUpload.registerClass("Sys.Extended.UI.AjaxFileUpload", Sys.Extended.UI.ControlBase);

Sys.Extended.UI.AjaxFileUpload.WebForm_OnSubmit = function () {
    /// <summary>
    /// Wraps ASP.NET's WebForm_OnSubmit in order to remove/disable input file controls prior to submission
    /// </summary>
    /// <returns type='Boolean'>
    /// Result of original WebForm_OnSubmit
    /// </returns>
    var result = Sys.Extended.UI.AjaxFileUpload._originalWebForm_OnSubmit();
    if (result) {
        var components = Sys.Application.getComponents();
        for (var i = 0; i < components.length; i++) {
            var component = components[i];
            if (Sys.Extended.UI.AjaxFileUpload.isInstanceOfType(component)) {
                component._html5InputFile.disabled = 'disabled';
                component._inputFileElement.disabled = 'disabled';
            }
        }
    }
    return result;
};


Sys.Extended.UI.AjaxFileUploadItem = function (parentId, fileInputElement, onRemoveItem) {

    this._deleteButton = null;
    this._parentId = parentId;
    this._fileInputElement = fileInputElement;
    this._container = null;
    this._fileInfoContainer = null;
    this._status = null;
    this._isUploaded = false;

    this._ui = this.initUI(onRemoveItem);
};

Sys.Extended.UI.AjaxFileUploadItem.prototype = {
    initUI: function (onRemoveItem) {

        var id = Sys.Extended.UI.AjaxFileUpload.utils.generateGuid();
        var height = this._lineItemHeight + 'px';

        // create line item container
        this._container = $common.createElementFromTemplate({
            nodeName: "div",
            properties: {
                id: this._parentId + '_FileItemContainer_' + id
            },
            cssClasses: ['ajax__fileupload_fileItemInfo']
        });

        // create file info/status container
        this._fileInfoContainer = document.createElement('div');
        this._fileInfoContainer.setAttribute('align', 'left');
        $common.setStyle(this._fileInfoContainer, { 'display': 'inline-block' });

        // init file info
        var fileInfoSpan = document.createElement('span');

        fileInfoSpan.setAttribute('id', this._parentId + '_FileItemInfo_' + id);
        if (this._fileInputElement.file) {
            var file = this._fileInputElement.file;
            fileInfoSpan.innerHTML = '<span class="filename">' + file.name + '</span> <span class="filetype">(' + file.type + ')</span> - <span class="filesize' + Sys.Extended.UI.AjaxFileUpload.utils.sizeToString(file.size) + '</span>';
        }
        else {
            fileInfoSpan.innerHTML = '<span class="filename">' + Sys.Extended.UI.AjaxFileUpload.utils.getFileName(this._fileInputElement.value) + '</span>';
        }
        this._fileInfoContainer.appendChild(fileInfoSpan);

        // init file status
        this._status = $common.createElementFromTemplate({
            nodeName: "span",
            properties: {
                id: this._parentId + '_FileItemStatus_' + id
            },
            cssClasses: ['uploadstatus']
        });
        this._fileInfoContainer.appendChild(this._status);

        // init remove button
        this._deleteButton = $common.createElementFromTemplate({
            nodeName: "div",
            properties: {
                id: this._parentId + '_FileItemDeleteButton_' + id
            },
            cssClasses: ['removeButton']
        });
        $common.setText(this._deleteButton, Sys.Extended.UI.Resources.AjaxFileUpload_Remove);

        var me = this;
        $addHandlers(this._deleteButton, { click:
            function () {
                return function () { onRemoveItem(me); me.destroy(); };
            } (this._deleteButton)
        });

        // build the line item
        if (Sys.Browser.agent == Sys.Browser.InternetExplorer && Sys.Browser.version <= 8) {
            this._container.appendChild(this._deleteButton);
            this._container.appendChild(this._fileInfoContainer);
        }
        else {
            this._container.appendChild(this._fileInfoContainer);
            this._container.appendChild(this._deleteButton);
        }
        return this._container;
    },

    setStatus: function (status, text) {
        $common.setText(this._status, ' (' + text + ')');
        this._fileInfoContainer.setAttribute('class', status + 'State');
    },

    disabled: function (on) {
        if (on)
            this._deleteButton.disabled = 'disabled';
        else
            this._deleteButton.disabled = '';
    },

    hide: function () {
        this._deleteButton.style.visibility = 'hidden';
    },

    destroy: function () {
        $common.removeElement(this._fileInputElement);
        $common.removeElement(this._deleteButton);
        $common.removeElement(this._ui);
    },

    get_fileInputElement: function () {
        return this._fileInputElement;
    },

    appendNodeTo: function (parent) {
        parent.appendChild(this._ui);
    },

    removeNodeFrom: function (parent) {
        parent.removeChild(this._ui);
    }
};

Sys.Extended.UI.AjaxFileUploadEventArgs = function (fileId, statusMessage, fileName, fileSize, contentType, postedUrl, fileIndex, fileQueueLength) {
    if (arguments.length != 8) throw Error.parameterCount();

    //Calling the base class constructor
    Sys.Extended.UI.AjaxFileUploadEventArgs.initializeBase(this);
    this._fileId = fileId;
    this._statusMessage = statusMessage;
    this._fileName = fileName;
    this._fileSize = fileSize;
    this._contentType = contentType;
    this._postedUrl = postedUrl;
    this._fileIndex = fileIndex;
    this._fileQueueLength = fileQueueLength;
};

Sys.Extended.UI.AjaxFileUploadEventArgs.prototype =
{
    get_fileId: function () {
        return this._fileId;
    },
    get_fileName: function () {
        return this._fileName;
    },
    get_statusMessage: function () {
        return this._statusMessage;
    },
    get_fileSize: function () {
        return this._fileSize;
    },
    get_contentType: function () {
        return this._contentType;
    },
    get_postedUrl: function () {
        return this._postedUrl;
    },
    set_postedUrl: function () {
        return this._postedUrl = value;
    },
    get_fileIndex: function () {
        return this._fileIndex;
    },
    get_fileQueueLength: function () {
        return this._fileQueueLength;
    }
};

Sys.Extended.UI.AjaxFileUploadEventArgs.registerClass('Sys.Extended.UI.AjaxFileUploadEventArgs', Sys.EventArgs);