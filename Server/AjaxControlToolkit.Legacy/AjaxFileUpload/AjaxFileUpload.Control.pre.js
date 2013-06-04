Type.registerNamespace("Sys.Extended.UI.AjaxFileUpload");
Type.registerNamespace("AjaxFileUpload");

Sys.Extended.UI.AjaxFileUpload.Control = function (element) {

    Sys.Extended.UI.AjaxFileUpload.Control.initializeBase(this, [element]);

    // properties 
    this._allowedFileTypes = null;
    this._contextKey = null;
    this._postBackUrl = null;
    this._mode = 0;
    this._serverPollingSupport = false;
    this._throbber = null;
    this._maximumNumberOfFiles = 10;
    this._allowedFileTypes = '';
    this._chunkSize = 4096;
    this._storeToAzure = false;
    this._azureContainerName = '';
    
    // fields
    this._uploadUrl = 'AjaxFileUploadHandler.axd';
    this._useHtml5Support = false;
    this._elements = null;
    this._processor = null;
    this._filesInQueue = [];
    this._isUploading = false;
    this._currentFileId = null;
    this._canceled = false;
};

Sys.Extended.UI.AjaxFileUpload.Control.prototype = {

    initialize: function () {
        
        var utils = new Sys.Extended.UI.AjaxFileUpload.Utils(),
            
            // element id
            id = this.get_id(),
            
            getElement = function (name) {
                return document.getElementById(id + name);
            },
            
            // control elements
            elements = {
                queueContainer: getElement('_QueueContainer'),
                selectFileButton: getElement('_SelectFileButton'),
                uploadOrCancelButton: getElement('_UploadOrCancelButton'),
                fileStatusContainer: getElement('_FileStatusContainer'),
                footer: getElement('_Footer')
            };
        
        // determine browser supports for HTML5, only if browser supported and mode is not Server.           
        this._useHtml5Support = utils.checkHtml5BrowserSupport() && this._mode != 2;

        // define progress bar element
        elements.progressBar = getElement('_ProgressBar');
        elements.progressBarContainer = getElement('_ProgressBarContainer');
        
        if (this._useHtml5Support) {

            // define spesific elements for HTML5
            elements.inputFile = getElement('_Html5InputFile');
            elements.dropZone = getElement('_Html5DropZone');
        } else {
            
            // define spesific elements for non HTML5
            elements.inputFile = getElement('_InputFileElement');
        }
        this._elements = elements;

        // define processor
        var processor = this._useHtml5Support 
            ? new Sys.Extended.UI.AjaxFileUpload.ProcessorHtml5(this, elements)
            : new Sys.Extended.UI.AjaxFileUpload.Processor(this, elements);

        // set layout
        this.setDefaultElementsLayout(elements);
        
        // attach elements events
        this.attachEvents(elements);
        
        // initialize processor
        processor.initialize();

        this._processor = processor;
        Sys.Extended.UI.AjaxFileUpload.Control.callBaseMethod(this, "initialize");
    },

    dispose: function () {
        Sys.Extended.UI.AjaxFileUpload.Control.callBaseMethod(this, "dispose");
    },
    
    setDefaultElementsLayout: function (elements) {
        
        $common.setVisible(elements.inputFile, true);
        $common.setVisible(elements.uploadOrCancelButton, false);
        $common.setVisible(elements.fileStatusContainer, true);
        
        elements.selectFileButton.innerHTML = Sys.Extended.UI.Resources.AjaxFileUpload_SelectFile;
        elements.uploadOrCancelButton.innerHTML = Sys.Extended.UI.Resources.AjaxFileUpload_Upload;

        this.setStatusMessage(Sys.Extended.UI.Resources.AjaxFileUpload_SelectFileToUpload);
    },
    
    attachEvents: function (elements) {
        this.onUploadOrCancelButtonClicked$delegate = Function.createDelegate(this, this.onUploadOrCancelButtonClickedHandler);
        $addHandlers(elements.uploadOrCancelButton, { 'click': this.onUploadOrCancelButtonClicked$delegate });
    },
    
    onUploadOrCancelButtonClickedHandler: function (e) {
        /// <summary>
        /// Event handler for click event on upload button. Upload button will act as a toggle driven by _isUploading field, for Upload and Cancel action.
        /// if _isUploading set to true, it indicates that this button will act as Cancel, otherwise is Upload.
        /// </summary>
        /// <param name="e"></param>
        
        var files = this._filesInQueue;
        if (!files.length) {
            alert(Sys.Extended.UI.Resources.AjaxFileUpload_SelectFileToUpload);
            return;
        }

        var uploaded = 0;
        for (var i = 0; i < files.length; i++) {
            if (files[i]._isUploaded)
                uploaded++;
        }
        
        if (uploaded == files.length) {
            alert(Sys.Extended.UI.Resources.AjaxFileUpload_AllFilesUploaded);
            return;
        }
            
        // Enabling control based on now state
        this.enableControls(this._isUploading);
        
        // Toggling state
        this._isUploading = !this._isUploading;
        if (this._isUploading) {
            this._canceled = false;
            this._processor.startUpload();
        } else {
            this._canceled = true;
            this._processor.cancelUpload();
            
            // reset all file items state
            for (var i = 0; i < files.length; i++) {
                if (!files[i]._isUploaded) {
                    files[i]._isUploading = false;
                }
            }
        }
    },
    
    enableControls: function (enable) {
        /// <summary>
        /// If set to true, it will set control state to be enable (ready to upload), 
        /// otherwise control will disable and button state turns to Cancel button.
        /// </summary>
        /// <param name="enable"></param>
        
        var btn = this._elements.uploadOrCancelButton;
        $common.setText(btn, enable ? Sys.Extended.UI.Resources.AjaxFileUpload_Upload : Sys.Extended.UI.Resources.AjaxFileUpload_Cancel);
        btn.setAttribute('class', enable ? 'ajax__fileupload_uploadbutton' : 'ajax_fileupload_cancelbutton');

        // Lock/unlock input element, so user won't add new file while uploading.
        $common.setVisible(this._elements.inputFile, enable);
        
        if (this._useHtml5Support) {
            this._elements.dropZone.disable = !enable;
            this._elements.inputFile.disable = !enable;
        }
    },
    
    done: function () {
        /// <summary>
        /// Call this method when all files has been uploaded.
        /// This method will reset states of control.
        /// </summary>
        
        this._isUploading = false;
        this.enableControls(true);
        this.setStatusMessage(Sys.Extended.UI.Resources.AjaxFileUpload_AllFilesUploaded + " " + Sys.Extended.UI.Resources.AjaxFileUpload_SelectFileToUpload);
        $common.setVisible(this._elements.uploadOrCancelButton, false);
        
        // Reset queue
        this._filesInQueue = [];
    },
    
    removeFileFromQueueHandler: function (e) {
        /// <summary>
        /// Event handler of file item when user clicks remove button.
        /// </summary>
        /// <param name="e">FileItem to be removed.</param>
        
        // never remove file being uploaded.
        if (!e || e._isUploading)
            return;
        
        // remove from queue.
        Array.remove(this._filesInQueue, e);
        
        // remove element.
        e.removeNodeFrom(this._elements.queueContainer);
        
        // hide container if queue is empty.
        if (!this._elements.queueContainer.hasChildNodes()) {
            $common.setVisible(this._elements.queueContainer, false);
            $common.setVisible(this._elements.uploadOrCancelButton, false);
        }

        // update files count information.
        this._showFilesCount();
    },
    
    addFileToQueue: function (item) {
        /// <summary>
        /// Processor will call this method to add selected file to queue.
        /// Will return true if file item successfully added, otherwise are false.
        /// </summary>
        /// <param name="inputElementValue">Value from input file element</param>

        var max = this.get_maximumNumberOfFiles();
        if (max > 0 && this._filesInQueue.length >= max) {
            alert(Sys.Extended.UI.Resources.AjaxFileUpload_MaxNumberOfFilesExceeded);
            return false;
        }

        // assign event handler for remove button.
        var fileItem = new Sys.Extended.UI.AjaxFileUpload.Item(this.get_id(), item,
            Function.createDelegate(this, this.removeFileFromQueueHandler));
        
        // add element to queue container.
        fileItem.appendNodeTo(this._elements.queueContainer);

        // set default state of file item as pending.
        fileItem.setStatus('pending', Sys.Extended.UI.Resources.AjaxFileUpload_Pending);

        // Ensure the queue container is visible
        $common.setVisible(this._elements.queueContainer, true);
        $common.setVisible(this._elements.uploadOrCancelButton, true);

        // add into queue.
        this._filesInQueue.push(fileItem);
        
        // update files count information.
        this._showFilesCount();

        return true;
    },
    
    _showFilesCount: function () {
        /// <summary>
        /// This will show number of files in queue or message to select file(s) when there is no file in queue.
        /// </summary>
        
        var empty = (this._filesInQueue.length == 0);
        
        this.setStatusMessage(empty 
            ? Sys.Extended.UI.Resources.AjaxFileUpload_SelectFileToUpload
            : String.format(Sys.Extended.UI.Resources.AjaxFileUpload_FileInQueue, this._filesInQueue.length.toString()));
    },
    
        
    fileTypeIsValid: function (fileType) {
        /// <summary>
        /// Check whether file type is allowed to be uploaded by checking it against <code>AllowedFileTypes</code> property
        /// </summary>
        /// <param name="fileType"></param>
        /// <returns type=""></returns>
        
        if (!this._allowedFileTypes)
            return true;
        
        var allowedFileTypes = this._allowedFileTypes.split(',');

        for (var i = 0; i < allowedFileTypes.length; i++) {
            var ftype = allowedFileTypes[i];
            if (fileType.toLocaleLowerCase() == ftype.toLocaleLowerCase())
                return true;
        }

        return false;
    },
    
    confirmFileIsInvalid: function (fileItem) {
        /// <summary>
        /// Send alert to user that file type is not acceptable. Processor uses this method after validation.
        /// </summary>
        /// <param name="fileItem"></param>
        
        var utils = new Sys.Extended.UI.AjaxFileUpload.Utils();
        alert(String.format(Sys.Extended.UI.Resources.AjaxFileUpload_WrongFileType, utils.getFileName(fileItem.value), fileItem.type));
    },
    
    doneAndUploadNextFile: function (fileItem) {
        /// <summary>
        /// Mark fileItem as uploaded, and upload next file in queue.
        /// </summary>
        /// <param name="fileItem">Uploaded File</param>
        
        // send message to server to finalize this upload
        var xhr = new XMLHttpRequest(),
            self = this;
        
        xhr.open("POST", "?contextKey="+ this._contextKey +"&done=1&guid=" + fileItem._id, true);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {

                    // Mark as done and invoke event handler
                    self.raiseUploadComplete(Sys.Serialization.JavaScriptSerializer.deserialize(xhr.responseText));

                    // Upload next file
                    self._processor.startUpload();

                } else {
                    // finalizing is error. next file will not be uploaded.
                    self.setFileStatus(fileItem, 'error', Sys.Extended.UI.Resources.AjaxFileUpload_error);
                    self.raiseUploadError(xhr);
                    throw "error raising upload complete event and start new upload";
                }
            }
        };
        xhr.send(null);
    },
    
    setAsUploading: function (fileItem) {
        /// <summary>
        /// Set file item status is uploading.
        /// </summary>
        /// <param name="fileItem"></param>
        
        fileItem._isUploading = true;
        fileItem._isUploaded = false;
        this.setFileStatus(fileItem, 'uploading', Sys.Extended.UI.Resources.AjaxFileUpload_Uploading);
        this.setStatusMessage('Uploading ' + (Array.indexOf(this._filesInQueue, fileItem)+1) + ' of ' + this._filesInQueue.length + ' file(s)');
    },
    
    setFileStatus: function (fileItem, fileStatusText, text) {
        /// <summary>
        /// Set file item status
        /// </summary>
        /// <param name="fileItem">file item or id</param>
        /// <param name="fileStatusText">status text</param>
        /// <param name="text">status resource</param>

        if (typeof (fileItem) === "string")
            fileItem = this.getFileItem(fileItem);
        if (fileItem)
            fileItem.setStatus(fileStatusText, text);
    },
    
    setStatusMessage: function (msg) {
        /// <summary>
        /// Set status message.
        /// </summary>
        /// <param name="msg"></param>
        this._elements.fileStatusContainer.innerHTML = msg;
    },
    
    setPercent: function (percent) {
        /// <summary>
        /// Set percentage of progress bar.
        /// </summary>
        /// <param name="percent">percentage</param>
        var progressBar = this._elements.progressBar;
        if (percent <= 0)
            percent = "0";
        else if (percent >= 100)
            percent = "100";

        progressBar.style.width = percent + '%';
        $common.setText(progressBar, String.format(Sys.Extended.UI.Resources.AjaxFileUpload_UploadedPercentage, percent));
    },

    get_allowedFileTypes: function () {
        return this._allowedFileTypes;
    },
    set_allowedFileTypes: function (value) {
        this._allowedFileTypes = value;
    },

    get_contextKey: function () {
        return this._contextKey;
    },
    set_contextKey: function (value) {
        this._contextKey = value;
    },

    get_postBackUrl: function () {
        return this._postBackUrl;
    },
    set_postBackUrl: function (value) {
        this._postBackUrl = value;
    },
    
    get_mode: function () {
        return this._mode;
    },
    set_mode: function (value) {
        this._mode = value;
    },
    
    get_serverPollingSupport: function () {
        return this._serverPollingSupport;
    },
    set_serverPollingSupport: function (value) {
        this._serverPollingSupport = value;
    },

    get_throbber: function () {
        return this._throbber;
    },
    set_throbber: function (value) {
        this._throbber = value;
    },

    get_maximumNumberOfFiles: function () {
        return this._maximumNumberOfFiles;
    },
    set_maximumNumberOfFiles: function (value) {
        this._maximumNumberOfFiles = value;
    },
    
    get_chunkSize: function () {
        return this._chunkSize;
    },
    set_chunkSize: function (value) {
        this._chunkSize = value;
    },
    
    get_storeToAzure: function () {
        return this._storeToAzure;
    },
    set_storeToAzure: function (value) {
        this._storeToAzure = value;
    },
    
    get_azureContainerName: function () {
        return this._azureContainerName;
    },
    set_azureContainerName: function (value) {
        this._azureContainerName = value;
    },

    add_uploadComplete: function (handler) {
        this.get_events().addHandler("uploadComplete", handler);
    },

    remove_uploadComplete: function (handler) {
        this.get_events().removeHandler("uploadComplete", handler);
    },

    raiseUploadComplete: function (e) {
        /// <summary>
        /// This method called once file is succesfully uploaded.
        /// </summary>
        /// <param name="e">Uploaded file information</param>

        var fileItem = this.getCurrentFileItem();
        
        if (!fileItem || !e || e.FileId !== fileItem._id)
            throw "Invalid finalizing upload server response.";

        // Mark and reset state that current file is uploaded
        this.setFileStatus(fileItem, 'uploaded', Sys.Extended.UI.Resources.AjaxFileUpload_Uploaded);
        this.setStatusMessage('Uploaded ' + (Array.indexOf(this._filesInQueue, fileItem) + 1) + ' of ' + this._filesInQueue.length + ' file(s)');
        
        fileItem._isUploaded = true;
        fileItem._isUploading = false;
        fileItem.hide();

        // Invoke uploadComplete event
        var eh = this.get_events().getHandler("uploadComplete");
        if (eh) {
            var fileIndex = Array.indexOf(this._filesInQueue, fileItem),
                eventArgs = new Sys.Extended.UI.AjaxFileUploadEventArgs(e.FileId, "Success", e.FileName,
                e.FileSize, e.ContentType,
                e.PostedUrl, fileIndex,
                this._filesInQueue.length);
            eh(this, eventArgs);
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

        this._canceled = false;
        this._isUploading = false;
        this.enableControls(true);
    },
    
    getCurrentFileItem: function () {
        /// <summary>
        /// Get file item based on current file id.
        /// </summary>
        /// <returns type=""></returns>
        return this.getFileItem(this._currentFileId);
    },
    
    getNextFile: function () {
        /// <summary>
        /// Get next file in queue for upload.
        /// </summary>
        /// <returns type="">Will returns null if all files has been uploaded.</returns>
        if (!this._isUploading)
            return null;

        for (var i = 0; i < this._filesInQueue.length; i++) {
            var file = this._filesInQueue[i];
            if (!file._isUploaded) {
                return file;
            }
        }

        return null;
    },

    getFileItem: function (id) {
        /// <summary>
        /// Get file item based on id.
        /// </summary>
        /// <param name="id">id of file item to find.</param>
        /// <returns type="">File Item</returns>
        for (var i = 0; i < this._filesInQueue.length; i++) {
            var file = this._filesInQueue[i];
            if (file._id === id) {
                return file;
            }
        }

        return null;
    }
};

Sys.Extended.UI.AjaxFileUpload.Control.registerClass("Sys.Extended.UI.AjaxFileUpload.Control", Sys.Extended.UI.ControlBase);