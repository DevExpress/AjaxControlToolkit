Type.registerNamespace("Sys.Extended.UI.AjaxFileUpload");

// Utils
Sys.Extended.UI.AjaxFileUpload.Utils = function() {

    this.generateGuid = function() {
        var result, i, j;
        result = '';
        for(j = 0; j < 32; j++) {
            if(j == 8 || j == 12 || j == 16 || j == 20)
                result = result + '-';
            i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            result = result + i;
        }
        return result;
    };

    this.getFileName = function(fullPath) {

        var result = "";
        if(!fullPath)
            return '';

        if(!fullPath.value && fullPath.name)
            result = fullPath.name;
        else {
            if(!fullPath.value && typeof (fullPath) !== "string")
                throw "Invalid parameter. fullPath parameter must be a string of full path or file element.";

            if(fullPath.value)
                fullPath = fullPath.value;

            if(fullPath) {
                var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                var filename = fullPath.substring(startIndex);
                if(filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                    filename = filename.substring(1);
                }

                result = filename;
            }
        }

        return encodeURIComponent(result);
    };

    this.getFileType = function(file) {
        if(!file)
            throw 'file must defined or not null';

        if(!file.value && file.name)
            return file.name.substring(file.name.lastIndexOf('.') + 1);

        if(file.value)
            file = file.value;

        if(typeof (file) !== "string")
            throw "can't resolve file type.";

        return file.substring(file.lastIndexOf('.') + 1);
    };

    this.sizeToString = function(bytes) {
        if(!bytes || bytes <= 0)
            return '0 Kb';

        var s = ['bytes', 'kb', 'MB', 'GB', 'TB', 'PB'];
        var e = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    };

    this.checkHtml5BrowserSupport = function() {
        return window.File
            && window.FileReader && window.FileList
            && window.Blob && (new XMLHttpRequest()).upload;
    };

};

// Item
Sys.Extended.UI.AjaxFileUpload.Item = function(parentId, fileItem, onRemoveItem) {
    this._deleteButton = null;
    this._parentId = parentId;
    this._inputElementValue = fileItem.value;
    this._id = fileItem.id;
    this._slices = fileItem.slices;
    this._sliceIndex = 0;

    this._fileInfoContainer = null;
    this._fileStatusText = null;
    this._isUploaded = false;
    this._isUploading = false;
    this._fileSize = 0;
    this._fileName = "";
    this._fileType = "";
    this._bytesUploaded = 0;

    this._ui = this.initUI(onRemoveItem);
};

Sys.Extended.UI.AjaxFileUpload.Item.prototype = {
    initUI: function(onRemoveItem) {

        var self = this, file = this._inputElementValue, utils = new Sys.Extended.UI.AjaxFileUpload.Utils(),
            isHtml5Support = utils.checkHtml5BrowserSupport(),

            // generate unique id for each item
            id = this._id,

            // create line item container
            container = $common.createElementFromTemplate({
                nodeName: "div",
                properties: {
                    id: this._parentId + '_FileItemContainer_' + id
                },
                cssClasses: ['ajax__fileupload_fileItemInfo']
            }),

            // create file info/status container
            fileInfoContainer = $common.createElementFromTemplate({
                nodeName: "div",
                properties: {
                    id: this._parentId + '_FileInfoContainer_' + id,
                    style: {
                        display: 'inline-block'
                    }
                }
            }),

            // create file info placeholder
            fileInfoText = $common.createElementFromTemplate({
                nodeName: "span",
                properties: {
                    id: this._parentId + '_FileItemInfo_' + id
                },
                cssClasses: ['ajax__fileupload_fileItemInfo']
            }),

            // create file status placeholder
            fileStatusText = $common.createElementFromTemplate({
                nodeName: "span",
                properties: {
                    id: this._parentId + '_FileItemStatus_' + id
                },
                cssClasses: ['uploadstatus']
            }),

            // init remove button
            deleteButton = $common.createElementFromTemplate({
                nodeName: "div",
                properties: {
                    id: this._parentId + '_FileItemDeleteButton_' + id
                },
                cssClasses: ['removeButton']
            });

        this._fileName = utils.getFileName(file);
        var fileNameToDisplay = decodeURIComponent(this._fileName);

        if(isHtml5Support) {
            this._fileSize = file.size;
            var fType = file.type ? '<span class="filetype">(' + file.type + ')</span>' : '';
            fileInfoText.innerHTML = '<span class="filename">' + fileNameToDisplay + '</span> '
                + fType
                + ' - <span class="filesize">' + utils.sizeToString(file.size) + '</span> ';
            this._fileType = file.type;
        } else {

            fileInfoText.innerHTML = '<span class="filename">' + fileNameToDisplay + '</span>';
            this._fileType = utils.getFileType(file);
        }

        fileInfoContainer.appendChild(fileInfoText);
        fileInfoContainer.appendChild(fileStatusText);

        $common.setText(deleteButton, Sys.Extended.UI.Resources.AjaxFileUpload_Remove);
        $addHandlers(deleteButton, {
            'click': Function.createDelegate(this, function() {
                onRemoveItem(self);
            })
        });

        // build the line item
        if(Sys.Browser.agent == Sys.Browser.InternetExplorer && Sys.Browser.version <= 8) {
            container.appendChild(deleteButton);
            container.appendChild(fileInfoContainer);
        }
        else {
            container.appendChild(fileInfoContainer);
            container.appendChild(deleteButton);
        }


        this._fileInfoContainer = fileInfoContainer;
        this._deleteButton = deleteButton;
        this._fileStatusText = fileStatusText;

        return container;
    },

    setStatus: function(fileStatusText, text) {
        $common.setText(this._fileStatusText, ' (' + text + ')');
        this._fileInfoContainer.setAttribute('class', fileStatusText + 'State');
    },

    disabled: function(on) {
        if(on)
            this._deleteButton.disabled = 'disabled';
        else
            this._deleteButton.disabled = '';
    },

    hide: function() {
        this._deleteButton.style.visibility = 'hidden';
    },

    destroy: function() {
        $common.removeElement(this._inputElementValue);
        $common.removeElement(this._deleteButton);
        $common.removeElement(this._ui);
    },

    get_inputElementValue: function() {
        return this._inputElementValue;
    },

    appendNodeTo: function(parent) {
        parent.appendChild(this._ui);
    },

    removeNodeFrom: function(parent) {
        parent.removeChild(this._ui);
    }
};

// Processor
Sys.Extended.UI.AjaxFileUpload.Processor = function(control, elements) {

    var utils = new Sys.Extended.UI.AjaxFileUpload.Utils(),
        xhrPoll = new XMLHttpRequest();

    this._iframe = null;
    this._iframeName = control.get_id() + '_uploadIframe';
    this._form = null;

    this.initialize = function() {
        this.attachEvents();
        this.createIFrame();
        this.createForm();
    };

    this.attachEvents = function() {
        this.onFileSelected$delegate = Function.createDelegate(this, this.onFileSelectedHandler);
        this.attachFileInputEvents(elements.inputFile, true);

        var self = this;

        // Capture uploading percentage report from server
        xhrPoll.onreadystatechange = function(e) {
            if(xhrPoll.readyState == 4) {

                if(xhrPoll.status == 200) {

                    // Update percentage
                    var percent = xhrPoll.responseText;
                    if(percent) {
                        percent = parseFloat(percent).toFixed(2);
                        control.setPercent(percent);
                    }

                    // Keep polling as long as upload is not completed
                    if(percent < 100)
                        setTimeout(function() {
                            self.pollingServerProgress(true);
                        }, 500);

                } else {

                    // We won't do any error handler for polling, since upload error handled by upload request it self.

                }
            }
        };
    };

    this.attachFileInputEvents = function(fileInput, attach) {
        if(attach)
            $addHandlers(fileInput, { 'change': this.onFileSelected$delegate });
        else
            $common.removeHandlers(fileInput, { 'change': this.onFileSelected$delegate });
    },

    this.onFileSelectedHandler = function(e) {
        /// User selects file through browser open file dialog. 
        /// We generate file item and add it into file list, and recreate new element for next file.

        // generate file item to be uploaded
        var fileItem = {
            id: utils.generateGuid(),
            value: elements.inputFile,
            type: utils.getFileType(elements.inputFile.value)
        };


        if(control.fileTypeIsValid(fileItem.type)) {
            control.addFileToQueue(fileItem);
            this.createInputFileElement();
        } else {
            control.confirmFileIsInvalid(fileItem);
        }

    };

    this.createInputFileElement = function() {
        var currentInputFile = elements.inputFile;

        // disfunction current input file element
        currentInputFile.style.zIndex = -999;
        $common.setLocation(currentInputFile, { x: -99999, y: -99999 });
        this.attachFileInputEvents(currentInputFile, false);

        // create new input file element in same location
        var id = control.get_id() + '_file_' + utils.generateGuid(),
            newInputFile = $common.createElementFromTemplate({
                nodeName: 'input',
                properties: {
                    id: id,
                    name: "act-file-data",
                    type: 'file',
                    style: {
                        zIndex: 0,
                        cursor: 'pointer',
                        position: 'absolute'
                    }
                }
            }, currentInputFile.parentNode);

        $common.setElementOpacity(newInputFile, 0);
        this.attachFileInputEvents(newInputFile, true);

        // set current input file with the new one
        elements.inputFile = newInputFile;
    };

    this.startUpload = function() {
        // Get un-uploaded file on the top from queue and start upload it.

        var form = this._form,
            fileItem = control.getNextFile();

        if(!fileItem) {
            control._currentFileId = null;
            this.setThrobber(false);
            control.done();
            return;
        }

        // set file item status
        control.setAsUploading(fileItem);

        var inputElement = fileItem.get_inputElementValue();

        // set current file id
        control._currentFileId = fileItem._id;

        this.setThrobber(true);

        // clear all form children
        while(form.firstChild) {
            form.removeChild(form.firstChild);
        }

        inputElement.name = 'act-file-data';

        // only add 1 file input element to be uploaded
        form.appendChild(inputElement);
        form.setAttribute("action", control._uploadUrl + '?contextKey=' + control.get_id() + '&fileId=' + control._currentFileId + '&fileName=' + fileItem._fileName + '&usePoll=' + (control.get_serverPollingSupport() ? "true" : "false"));

        // upload it now
        form.submit();
    };

    this.cancelUpload = function() {
        // send message to server to cancel this upload
        var xhr = new XMLHttpRequest(),
            self = this;

        // aborting server polling request
        if(xhrPoll)
            xhrPoll.abort();

        xhr.open("POST", '?contextKey=' + control.get_id() + "&cancel=1&guid=" + control._currentFileId, true);
        xhr.onreadystatechange = function() {
            self.setThrobber(false);
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {
                    control.cancelUpload();
                } else {
                    // cancelation is error. 
                    self.raiseUploadError(xhr);
                    throw "Failed to cancel upload.";
                }
            }
        };
        xhr.send(null);
    },

    this.createIFrame = function() {

        var name = this._iframeName,
            iframe = document.createElement("IFRAME");

        iframe.width = "0";
        iframe.height = "0";
        iframe.style.display = "none";
        iframe.src = "about:blank";
        iframe.id = name;
        iframe.name = name;
        iframe.security = "restricted";
        document.body.appendChild(iframe);
        iframe.contentWindow.name = name;
        $addHandlers(iframe, {
            load: Function.createDelegate(this, this.onIFrameLoadedHandler)
        });

        this._iframe = iframe;
    };

    this.onIFrameLoadedHandler = function(e) {
        // Event handler to capture when iframe receive response from server.

        if(!control._currentFileId)
            return;

        try {

            var iframe = this._iframe, doc = null;

            // Only test the iframe data, exception should thrown if something went wrong.
            if(iframe.contentDocument)
                // Firefox, Opera
                doc = iframe.contentDocument;
            else if(iframe.contentWindow)
                // Internet Explorer
                doc = iframe.contentWindow.document;
            else if(iframe.document)
                // Others?
                doc = iframe.document;

            if(doc == null)
                throw "Document not initialized";

            // finalizing and upload next file
            control.doneAndUploadNextFile(control.getCurrentFileItem());

        } catch(e) {

            // Cancelation / aborting upload can causing 'Access is denied' or 'Permission denied' on IE 9 bellow,
            // let's consider this exception is not trully error exception from server.
            if(!control._canceled || !(e.message && (e.message.indexOf("Access is denied") > -1 || e.message.indexOf("Permission denied") > -1))) {
                this.raiseUploadError(e);
                throw e;
            }
        }
    };

    this.setThrobber = function(value) {
        // Show or hide throbber when processing upload.

        if(control.get_serverPollingSupport()) {
            control.setPercent(0);
            $common.setVisible(elements.progressBar, value ? true : false);
            $common.setVisible(elements.progressBarContainer, value ? true : false);
            this.pollingServerProgress(value);
            return;
        }

        if(control.get_throbber() != null) {
            control.get_throbber().style.display = value ? "" : "none";
        }
    };

    this.pollingServerProgress = function(value) {
        // Get percentage of uploading progress from server.

        if(!value || !control._currentFileId)
            return;

        xhrPoll.open("GET", '?contextKey=' + control.get_id() + "&poll=1&guid=" + control._currentFileId, true);
        xhrPoll.send(null);
    };

    this.createForm = function() {
        // Create form that we use to upload file one by one taken from queue.

        var form,
            formId = "___postForm" + control.get_id();

        try {
            form = document.createElement('<form method="post" enctype="multipart/form-data" id="' + formId + '" target="' + this._iframeName + '">');
        } catch(ex) {
            form = document.createElement('form');
            form.setAttribute("id", formId);
            form.setAttribute("method", "post");
            form.setAttribute("target", this._iframe.id);
            form.setAttribute("enctype", "multipart/form-data");
        }

        form.style.visibility = 'hidden';
        form.style.display = 'none';
        document.body.appendChild(form);

        this._form = form;
    };

    this.raiseUploadError = function(xhr) {

        control.raiseUploadError(xhr);
        control.setFileStatus(control._currentFileId, 'error', Sys.Extended.UI.Resources.AjaxFileUpload_error);

        if(xhrPoll)
            xhrPoll.abort();
        control._currentFileId = null;
    };

};

// ProcessorHtml5
Sys.Extended.UI.AjaxFileUpload.ProcessorHtml5 = function(control, elements) {

    var utils = new Sys.Extended.UI.AjaxFileUpload.Utils(),
        chunkSize = control.get_chunkSize() * 1000,
        tmpXhrLoaded = 0,
        xhrReq = null;

    this.initialize = function() {
        $common.setVisible(elements.dropZone, true);
        elements.dropZone.innerHTML = Sys.Extended.UI.Resources.AjaxFileUpload_DropFiles;

        this.attachEvents();
    };

    this.attachEvents = function() {

        this.onFileDropped$delegate = Function.createDelegate(this, this.onFileDroppedHandler);
        this.onFileDragOver$delegate = Function.createDelegate(this, this.onFileDragOverHandler);
        this.onFileSelected$delegate = Function.createDelegate(this, this.onFileSelectedHandler);

        elements.inputFile.addEventListener("change", this.onFileSelected$delegate, false);
        elements.dropZone.addEventListener("drop", this.onFileDropped$delegate, false);
        elements.dropZone.addEventListener("dragover", this.onFileDragOver$delegate, false);

    };

    // #region event handlers 

    this.onFileDroppedHandler = function(e) {
        e.stopPropagation();
        e.preventDefault();
        this.addFilesToQueue(e.dataTransfer.files);
    };

    this.onFileDragOverHandler = function(e) {
        e.stopPropagation();
        e.preventDefault();
    };

    this.onFileSelectedHandler = function(e) {
        this.addFilesToQueue(e.target.files);
    };

    // #endregion

    this.addFilesToQueue = function(files) {
        // Validate and generate file item from HTML5 files.

        for(var i = 0; i < files.length; i++) {

            var blob = files[i],
                slices = 0;

            // slice file into several chunks when it's too big
            if(blob.size > chunkSize) {
                slices = Math.ceil(blob.size / chunkSize);
            }

            // create file item to be added on queue
            var fileItem = {
                id: utils.generateGuid(),
                value: files[i],
                type: utils.getFileType(files[i]),
                uploaded: false,
                slices: slices
            };

            // validate it, add it if it's OK
            if(control.fileTypeIsValid(fileItem.type)) {
                if(!control.addFileToQueue(fileItem))
                    break;
            } else {
                control.confirmFileIsInvalid(fileItem);
            }
        }

        // reset input file value so 'change' event can be fired again with same file name.
        elements.inputFile.value = null;
    };

    this.cancelUpload = function() {

        // abort ajax upload request 
        if(xhrReq) xhrReq.abort();

        control.cancelUpload();
    },

    this.startUpload = function() {
        // Get un-uploaded file on the top from queue and start upload it.

        var fileItem = control.getNextFile();

        if(fileItem) {
            if(fileItem._sliceIndex === 0)
                control.setPercent(0);
            $common.setVisible(elements.progressBarContainer, true);
            this.upload(fileItem);
        } else {
            control._currentFileId = null;
            control.setPercent(0);
            $common.setVisible(elements.progressBarContainer, false);
            control.done();
        }
    };

    this.upload = function(fileItem) {
        if(!control._isUploading)
            return;

        // ensure progress bar is visible
        $common.setVisible(elements.progressBar, true);

        // set file item status
        control.setAsUploading(fileItem);

        // preparing upload data
        var blob = fileItem.get_inputElementValue(),
            fileName = fileItem._fileName,
            chunked = fileItem._slices && (fileItem._slices > 0),
            firstChunk = fileItem._sliceIndex == 0;

        if(chunked) {
            var start = fileItem._sliceIndex * chunkSize,
                stop = start + chunkSize;
            blob = blob.slice(start, stop > blob.size ? blob.size : stop);
        }

        // preparing xhr request
        var form = new FormData(),
            id = control._currentFileId = fileItem._id,
            xhrReq = new XMLHttpRequest(),
            self = this,
            xhrDelegate = function(method) { return function(e) { method.call(self, id, e); }; };

        xhrReq.upload.addEventListener("progress", xhrDelegate(this.onProgressHandler), false);
        xhrReq.addEventListener("load", xhrDelegate(this.onUploadCompleteHandler), false);
        xhrReq.addEventListener("error", xhrDelegate(this.onUploadFailedHandler), false);
        xhrReq.addEventListener("abort", xhrDelegate(this.onUploadCanceledHandler), false);
        xhrReq.open("POST", control._uploadUrl + '?contextKey=' + control.get_id() + '&fileId=' + id + '&fileName=' + fileName + '&chunked=' + (chunked ? "true" : "false") + '&firstChunk=' + firstChunk, true);
        form.append("act-file-data", blob);
        xhrReq.send(form);
    };

    this.onProgressHandler = function(id, xhr) {
        // if lengthComputable is available, then let's provide progress bar animation.

        if(!control._isUploading)
            return;


        if(xhr.lengthComputable) {

            tmpXhrLoaded = xhr.loaded;

            var fileItem = control.getFileItem(id),
                slices = fileItem._slices,

                // calculate all uploaded bytes 
                allBytesUploaded = fileItem._bytesUploaded + tmpXhrLoaded,

                // estimation of total file size
                calculatedFileSize =
                    slices - fileItem._sliceIndex == 1
                        ? allBytesUploaded
                        : xhr.total * slices,

                // calculate all uploaded bytes in percent
                percentComplete =
                    slices == 0
                        ? (xhr.loaded * 100 / xhr.total).toFixed(2)
                        : ((allBytesUploaded / calculatedFileSize) * 100).toFixed(2);

            control.setPercent(percentComplete);
        }
    };

    this.onUploadCompleteHandler = function(id, xhr) {
        var self = this,
            fileItem = control.getFileItem(id),
            file = fileItem.get_inputElementValue();


        if(fileItem._slices && fileItem._slices > 0 && fileItem._sliceIndex + 1 < fileItem._slices) {

            // uploaded data is chunk of file that is not the last chunk, so we move to next chunk and upload it
            fileItem._sliceIndex++;
            fileItem._bytesUploaded += tmpXhrLoaded;
            tmpXhrLoaded = 0;
            self.startUpload();

        } else {

            // hide remove button
            fileItem.hide();

            // set statuses as uploaded
            fileItem.setStatus('uploaded', Sys.Extended.UI.Resources.AjaxFileUpload_Uploaded);
            control.setStatusMessage(String.format(Sys.Extended.UI.Resources.AjaxFileUpload_UploadingHtml5File,
                file.name, utils.sizeToString(file.size)));

            // finalizing and upload next file
            control.doneAndUploadNextFile(fileItem);
        }
    };

    this.onUploadFailedHandler = function(id, xhr) {
        var fileItem = control.getFileItem(id);
        fileItem._isUploading = false;
        control.setFileStatus(id, 'error', Sys.Extended.UI.Resources.AjaxFileUpload_error);
        control.raiseUploadError(xhr);
    };

    this.onUploadCanceledHandler = function(id, xhr) {
        var fileItem = control.getFileItem(id);
        fileItem._isUploading = false;
        control.setFileStatus(fileItem, 'canceled', Sys.Extended.UI.Resources.AjaxFileUpload_Canceled);
    };
};

// StartEventArgs
Sys.Extended.UI.AjaxFileUploadStartEventArgs = function(filesInQueue, serverArguments) {
    if(arguments.length != 2) throw Error.parameterCount();

    Sys.Extended.UI.AjaxFileUploadStartEventArgs.initializeBase(this);
    this._filesInQueue = filesInQueue;
    this._serverArguments = serverArguments;
};

Sys.Extended.UI.AjaxFileUploadStartEventArgs.prototype = {
    get_filesInQueue: function() {
        return this._filesInQueue;
    },
    get_serverArguments: function() {
        return this._serverArguments;
    }
};

Sys.Extended.UI.AjaxFileUploadStartEventArgs.registerClass('Sys.Extended.UI.AjaxFileUploadStartEventArgs', Sys.EventArgs);

// EventArgs
Sys.Extended.UI.AjaxFileUploadEventArgs = function(fileId, statusMessage, fileName, fileSize, contentType, postedUrl, fileIndex, fileQueueLength) {
    if(arguments.length != 8) throw Error.parameterCount();

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
    get_fileId: function() {
        return this._fileId;
    },
    get_fileName: function() {
        return this._fileName;
    },
    get_statusMessage: function() {
        return this._statusMessage;
    },
    get_fileSize: function() {
        return this._fileSize;
    },
    get_contentType: function() {
        return this._contentType;
    },
    get_postedUrl: function() {
        return this._postedUrl;
    },
    set_postedUrl: function() {
        return this._postedUrl = value;
    },
    get_fileIndex: function() {
        return this._fileIndex;
    },
    get_fileQueueLength: function() {
        return this._fileQueueLength;
    }
};

Sys.Extended.UI.AjaxFileUploadEventArgs.registerClass('Sys.Extended.UI.AjaxFileUploadEventArgs', Sys.EventArgs);

// CompleteAllEventArgs
Sys.Extended.UI.AjaxFileUploadCompleteAllEventArgs = function(filesInQueue, filesUploaded, reason, serverArguments) {
    if(arguments.length != 4) throw Error.parameterCount();

    Sys.Extended.UI.AjaxFileUploadCompleteAllEventArgs.initializeBase(this);
    this._filesInQueue = filesInQueue;
    this._filesUploaded = filesUploaded;
    this._reason = reason;
    this._serverArguments = serverArguments;
};

Sys.Extended.UI.AjaxFileUploadCompleteAllEventArgs.prototype = {
    get_filesInQueue: function() {
        return this._filesInQueue;
    },
    get_reason: function() {
        return this._reason;
    },
    get_filesUploaded: function() {
        return this._filesUploaded;
    },
    get_serverArguments: function() {
        return this._serverArguments;
    }
};

Sys.Extended.UI.AjaxFileUploadCompleteAllEventArgs.registerClass('Sys.Extended.UI.AjaxFileUploadCompleteAllEventArgs', Sys.EventArgs);

// Control
Sys.Extended.UI.AjaxFileUpload.Control = function(element) {

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

    // fields
    this._uploadUrl = 'AjaxFileUploadHandler.axd';
    this._useHtml5Support = false;
    this._elements = null;
    this._processor = null;
    this._filesInQueue = [];
    this._isUploading = false;
    this._currentFileId = null;
    this._currentQueueIndex = 0;
    this._canceled = false;
};

Sys.Extended.UI.AjaxFileUpload.Control.prototype = {

    initialize: function() {

        var utils = new Sys.Extended.UI.AjaxFileUpload.Utils(),

            // element id
            id = this.get_id(),

            getElement = function(name) {
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

        if(this._useHtml5Support) {

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

    dispose: function() {
        Sys.Extended.UI.AjaxFileUpload.Control.callBaseMethod(this, "dispose");
    },

    setDefaultElementsLayout: function(elements) {

        $common.setVisible(elements.inputFile, true);
        elements.uploadOrCancelButton.style.visibility = "hidden";
        $common.setVisible(elements.fileStatusContainer, true);

        elements.selectFileButton.innerHTML = Sys.Extended.UI.Resources.AjaxFileUpload_SelectFile;
        elements.uploadOrCancelButton.innerHTML = Sys.Extended.UI.Resources.AjaxFileUpload_Upload;

        this.setStatusMessage(Sys.Extended.UI.Resources.AjaxFileUpload_SelectFileToUpload);
    },

    attachEvents: function(elements) {
        this.onUploadOrCancelButtonClicked$delegate = Function.createDelegate(this, this.onUploadOrCancelButtonClickedHandler);
        $addHandlers(elements.uploadOrCancelButton, { 'click': this.onUploadOrCancelButtonClicked$delegate });
    },

    onUploadOrCancelButtonClickedHandler: function(e) {
        // Event handler for click event on upload button. Upload button will act as a toggle driven by _isUploading field, for Upload and Cancel action.
        // if _isUploading set to true, it indicates that this button will act as Cancel, otherwise is Upload.

        var files = this._filesInQueue;
        if(!files.length) {
            alert(Sys.Extended.UI.Resources.AjaxFileUpload_SelectFileToUpload);
            return;
        }

        var uploaded = 0;
        for(var i = 0; i < files.length; i++) {
            if(files[i]._isUploaded)
                uploaded++;
        }

        if(uploaded == files.length) {
            alert(Sys.Extended.UI.Resources.AjaxFileUpload_AllFilesUploaded);
            return;
        }

        // Enabling control based on now state
        this.enableControls(this._isUploading);

        // Toggling state
        this._isUploading = !this._isUploading;
        if(this._isUploading) {
            this._canceled = false;

            // Tell server upload is started
            var xhr = new XMLHttpRequest(),
                self = this;

            xhr.open("POST", '?contextKey=' + this.get_id()
                + "&start=1&queue=" + this._filesInQueue.length);
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4) {
                    if(xhr.status == 200) {
                        self._processor.startUpload();
                        self.raiseUploadStart(Sys.Serialization.JavaScriptSerializer.deserialize(xhr.responseText));
                    } else {
                        self.raiseUploadError(xhr);
                        throw "Failed to starting upload.";
                    }
                }
            };
            xhr.send(null);

        } else {
            this._canceled = true;
            this._processor.cancelUpload();

            // reset all file items state
            for(var i = 0; i < files.length; i++) {
                if(!files[i]._isUploaded) {
                    files[i]._isUploading = false;
                }
            }
        }
    },

    enableControls: function(enable) {
        // If set to true, it will set control state to be enable (ready to upload), 
        // otherwise control will disable and button state turns to Cancel button.

        var btn = this._elements.uploadOrCancelButton;
        $common.setText(btn, enable ? Sys.Extended.UI.Resources.AjaxFileUpload_Upload : Sys.Extended.UI.Resources.AjaxFileUpload_Cancel);
        btn.setAttribute('class', enable ? 'ajax__fileupload_uploadbutton' : 'ajax_fileupload_cancelbutton');

        // Lock/unlock input element, so user won't add new file while uploading.
        $common.setVisible(this._elements.inputFile, enable);

        if(this._useHtml5Support) {
            this._elements.dropZone.disable = !enable;
            this._elements.inputFile.disable = !enable;
        }
    },

    done: function() {
        // Call this method when all files has been uploaded.
        // This method will reset states of control.

        this._isUploading = false;
        this.enableControls(true);
        this.setStatusMessage(Sys.Extended.UI.Resources.AjaxFileUpload_AllFilesUploaded + " " + Sys.Extended.UI.Resources.AjaxFileUpload_SelectFileToUpload);
        $common.setVisible(this._elements.uploadOrCancelButton, false);

        // Tell to server that all files has been uploaded.
        var xhr = new XMLHttpRequest(),
            self = this,
            currentFile = this._filesInQueue[this._currentQueueIndex - 1];

        xhr.open("POST", '?contextKey=' + this.get_id()
            + "&complete=1&queue=" + this._filesInQueue.length
            + "&uploaded=" + (this._currentQueueIndex - (currentFile._isUploaded ? 0 : 1))
            + "&reason=" + (this._canceled ? "cancel" : "done"));

        xhr.onreadystatechange = function() {
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {
                    self.raiseUploadCompleteAll(Sys.Serialization.JavaScriptSerializer.deserialize(xhr.responseText));
                } else {
                    self.raiseUploadError(xhr);
                    throw "Failed to completing upload.";
                }
            }
        };
        xhr.send(null);

        // Reset queue
        this._filesInQueue = [];
        this._currentQueueIndex = 0;
    },

    removeFileFromQueueHandler: function(e) {
        // never remove file being uploaded.
        if(!e || e._isUploading)
            return;

        // remove from queue.
        Array.remove(this._filesInQueue, e);

        // remove element.
        e.removeNodeFrom(this._elements.queueContainer);

        // hide container if queue is empty.
        if(!this._elements.queueContainer.hasChildNodes()) {
            $common.setVisible(this._elements.queueContainer, false);
            $common.setVisible(this._elements.uploadOrCancelButton, false);
        }

        // update files count information.
        this._showFilesCount();
    },

    addFileToQueue: function(item) {
        // Processor will call this method to add selected file to queue.
        // Will return true if file item successfully added, otherwise are false.

        var max = this.get_maximumNumberOfFiles();
        if(max > 0 && this._filesInQueue.length >= max) {
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

    _showFilesCount: function() {
        // This will show number of files in queue or message to select file(s) when there is no file in queue.

        var empty = (this._filesInQueue.length == 0);

        this.setStatusMessage(empty
            ? Sys.Extended.UI.Resources.AjaxFileUpload_SelectFileToUpload
            : String.format(Sys.Extended.UI.Resources.AjaxFileUpload_FileInQueue, this._filesInQueue.length.toString()));
    },


    fileTypeIsValid: function(fileType) {
        // Check whether file type is allowed to be uploaded by checking it against "AlowedFileTypes" property

        if(!this._allowedFileTypes)
            return true;

        var allowedFileTypes = this._allowedFileTypes.split(',');

        for(var i = 0; i < allowedFileTypes.length; i++) {
            var ftype = allowedFileTypes[i];
            if(fileType.toLocaleLowerCase() == ftype.toLocaleLowerCase())
                return true;
        }

        return false;
    },

    confirmFileIsInvalid: function(fileItem) {
        // Send alert to user that file type is not acceptable. Processor uses this method after validation.

        var utils = new Sys.Extended.UI.AjaxFileUpload.Utils();
        alert(String.format(Sys.Extended.UI.Resources.AjaxFileUpload_WrongFileType, utils.getFileName(fileItem.value), fileItem.type));
    },

    doneAndUploadNextFile: function(fileItem) {
        // Mark fileItem as uploaded, and upload next file in queue.

        // send message to server to finalize this upload
        var xhr = new XMLHttpRequest(),
            self = this;

        xhr.open("POST", "?contextKey=" + this.get_id() + "&done=1&guid=" + fileItem._id, true);
        xhr.onreadystatechange = function(e) {
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {

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

    cancelUpload: function() {

        var fileItem = this.getCurrentFileItem();

        // Reset file item state
        fileItem._isUploaded = false;
        fileItem._isUploading = false;

        // Update status
        this.setStatusMessage(Sys.Extended.UI.Resources.AjaxFileUpload_UploadCanceled);

        // Mark all rest un-uploaded files to be canceled
        for(var i = 0; i < this._filesInQueue.length; i++) {
            var file = this._filesInQueue[i];
            if(!file._isUploaded) {
                this.setFileStatus(file, 'cancelled', Sys.Extended.UI.Resources.AjaxFileUpload_Canceled);
            }
        }
    },

    setAsUploading: function(fileItem) {
        // Set file item status is uploading.

        fileItem._isUploading = true;
        fileItem._isUploaded = false;

        this._currentQueueIndex = Array.indexOf(this._filesInQueue, fileItem) + 1;

        this.setFileStatus(fileItem, 'uploading', Sys.Extended.UI.Resources.AjaxFileUpload_Uploading);
        this.setStatusMessage('Uploading ' + this._currentQueueIndex + ' of ' + this._filesInQueue.length + ' file(s)');
    },

    setFileStatus: function(fileItem, fileStatusText, text) {
        if(typeof (fileItem) === "string")
            fileItem = this.getFileItem(fileItem);
        if(fileItem)
            fileItem.setStatus(fileStatusText, text);
    },

    setStatusMessage: function(msg) {
        this._elements.fileStatusContainer.innerHTML = msg;
    },

    setPercent: function(percent) {
        var progressBar = this._elements.progressBar;
        if(percent <= 0)
            percent = "0";
        else if(percent >= 100)
            percent = "100";

        progressBar.style.width = percent + '%';
        $common.setText(progressBar, String.format(Sys.Extended.UI.Resources.AjaxFileUpload_UploadedPercentage, percent));
    },

    get_allowedFileTypes: function() {
        return this._allowedFileTypes;
    },
    set_allowedFileTypes: function(value) {
        this._allowedFileTypes = value;
    },

    get_contextKey: function() {
        return this._contextKey;
    },
    set_contextKey: function(value) {
        this._contextKey = value;
    },

    get_postBackUrl: function() {
        return this._postBackUrl;
    },
    set_postBackUrl: function(value) {
        this._postBackUrl = value;
    },

    get_mode: function() {
        return this._mode;
    },
    set_mode: function(value) {
        this._mode = value;
    },

    get_serverPollingSupport: function() {
        return this._serverPollingSupport;
    },
    set_serverPollingSupport: function(value) {
        this._serverPollingSupport = value;
    },

    get_throbber: function() {
        return this._throbber;
    },
    set_throbber: function(value) {
        this._throbber = value;
    },

    get_maximumNumberOfFiles: function() {
        return this._maximumNumberOfFiles;
    },
    set_maximumNumberOfFiles: function(value) {
        this._maximumNumberOfFiles = value;
    },

    get_chunkSize: function() {
        return this._chunkSize;
    },
    set_chunkSize: function(value) {
        this._chunkSize = value;
    },

    add_uploadStart: function(handler) {
        this.get_events().addHandler("uploadStart", handler);
    },
    remove_uploadStart: function(handler) {
        this.get_events().removeHandler("uploadStart", handler);
    },

    add_uploadComplete: function(handler) {
        this.get_events().addHandler("uploadComplete", handler);
    },
    remove_uploadComplete: function(handler) {
        this.get_events().removeHandler("uploadComplete", handler);
    },

    add_uploadCompleteAll: function(handler) {
        this.get_events().addHandler("uploadCompleteAll", handler);
    },
    remove_uploadCompleteAll: function(handler) {
        this.get_events().removeHandler("uploadCompleteAll", handler);
    },

    raiseUploadStart: function(e) {
        // Invoke uploadStart event
        var eh = this.get_events().getHandler("uploadStart");
        if(eh) {
            var eventArgs = new Sys.Extended.UI.AjaxFileUploadStartEventArgs(e.FilesInQueue, e.ServerArguments);
            eh(this, eventArgs);
        }
    },

    raiseUploadComplete: function(e) {
        var fileItem = this.getCurrentFileItem();

        if(!fileItem || !e || e.FileId !== fileItem._id)
            throw "Invalid finalizing upload server response.";

        // Mark and reset state that current file is uploaded
        this.setFileStatus(fileItem, 'uploaded', Sys.Extended.UI.Resources.AjaxFileUpload_Uploaded);
        this.setStatusMessage('Uploaded ' + this._currentQueueIndex + ' of ' + this._filesInQueue.length + ' file(s)');

        fileItem._isUploaded = true;
        fileItem._isUploading = false;
        fileItem.hide();

        // Invoke uploadComplete event
        var eh = this.get_events().getHandler("uploadComplete");
        if(eh) {
            var fileIndex = Array.indexOf(this._filesInQueue, fileItem),
                eventArgs = new Sys.Extended.UI.AjaxFileUploadEventArgs(e.FileId, "Success", e.FileName,
                e.FileSize, e.ContentType,
                e.PostedUrl, fileIndex,
                this._filesInQueue.length);
            eh(this, eventArgs);
        }
    },

    raiseUploadCompleteAll: function(e) {
        var eh = this.get_events().getHandler("uploadCompleteAll");
        if(eh) {
            var eventArgs = new Sys.Extended.UI.AjaxFileUploadCompleteAllEventArgs(e.FilesInQueue, e.FilesUploaded, e.Reason, e.ServerArguments);
            eh(this, eventArgs);
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
        }

        this._canceled = false;
        this._isUploading = false;
        this.enableControls(true);
    },

    getCurrentFileItem: function() {
        // Get file item based on current file id.
        return this.getFileItem(this._currentFileId);
    },

    getNextFile: function() {
        if(!this._isUploading)
            return null;

        for(var i = 0; i < this._filesInQueue.length; i++) {
            var file = this._filesInQueue[i];
            if(!file._isUploaded) {
                return file;
            }
        }

        return null;
    },

    getFileItem: function(id) {        
        for(var i = 0; i < this._filesInQueue.length; i++) {
            var file = this._filesInQueue[i];
            if(file._id === id) {
                return file;
            }
        }

        return null;
    }
};

Sys.Extended.UI.AjaxFileUpload.Control.registerClass("Sys.Extended.UI.AjaxFileUpload.Control", Sys.Extended.UI.ControlBase);