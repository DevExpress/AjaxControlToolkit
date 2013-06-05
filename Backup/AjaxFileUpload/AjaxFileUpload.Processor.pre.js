Type.registerNamespace("Sys.Extended.UI.AjaxFileUpload");
Type.registerNamespace("AjaxFileUpload");

Sys.Extended.UI.AjaxFileUpload.Processor = function (control, elements) {
    
    var utils = new Sys.Extended.UI.AjaxFileUpload.Utils(),
        xhrPoll = new XMLHttpRequest();

    this._iframe = null;
    this._iframeName = control.get_id() + '_uploadIframe';
    this._form = null;
    
    this.initialize = function () {
        this.attachEvents();
        this.createIFrame();
        this.createForm();
    };

    this.attachEvents = function () {
        this.onFileSelected$delegate = Function.createDelegate(this, this.onFileSelectedHandler);
        this.attachFileInputEvents(elements.inputFile, true);

        var self = this;
        
        // Capture uploading percentage report from server
        xhrPoll.onreadystatechange = function (e) {
            if (xhrPoll.readyState == 4) {

                if (xhrPoll.status == 200) {

                    // Update percentage
                    var percent = xhrPoll.responseText;
                    if (percent) {
                        percent = parseFloat(percent).toFixed(2);
                        control.setPercent(percent);
                    }

                    // Keep polling as long as upload is not completed
                    if (percent < 100)
                        setTimeout(function() {
                            self.pollingServerProgress(true);
                        }, 500);
                    
                } else {
                    
                    // We won't do any error handler for polling, since upload error handled by upload request it self.
                    
                }
            }
        };
    };
    
    this.attachFileInputEvents = function (fileInput, attach) {
        if (attach)
            $addHandlers(fileInput, { 'change': this.onFileSelected$delegate });
        else
            $common.removeHandlers(fileInput, { 'change': this.onFileSelected$delegate });
    },
    
    this.onFileSelectedHandler = function (e) {
        /// <summary>
        /// User selects file through browser open file dialog. 
        /// We generate file item and add it into file list, and recreate new element for next file.
        /// </summary>
        /// <param name="e"></param>
        
        // generate file item to be uploaded
        var fileItem = {
            id: utils.generateGuid(),
            value: elements.inputFile,
            type: utils.getFileType(elements.inputFile.value)
        };
        

        if (control.fileTypeIsValid(fileItem.type)) {
            control.addFileToQueue(fileItem);
            this.createInputFileElement();
        } else {
            control.confirmFileIsInvalid(fileItem);
        }

    };

    this.createInputFileElement = function () {
        /// <summary>
        /// Create hidden input element file.
        /// </summary>

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

    this.startUpload = function () {
        /// <summary>
        /// Get un-uploaded file on the top from queue and start upload it.
        /// </summary>

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
        while (form.firstChild) {
            form.removeChild(form.firstChild);
        }

        inputElement.name= 'act-file-data';
        
        // only add 1 file input element to be uploaded
        form.appendChild(inputElement);
        form.setAttribute("action", control._uploadUrl + '?contextKey=' + control._contextKey + '&fileId=' + control._currentFileId + '&fileName=' + fileItem._fileName + '&usePoll=' + (control.get_serverPollingSupport() ? "true" : "false") + '&storeToAzure=' + control.get_storeToAzure() + '&acn=' + control.get_azureContainerName());
        
        // upload it now
        form.submit();
    };

    this.cancelUpload = function () {
        /// <summary>
        /// Send request to server to abort current upload progress.
        /// </summary>

        // send message to server to cancel this upload
        var xhr = new XMLHttpRequest(),
            self = this;

        // aborting server polling request
        if (xhrPoll)
            xhrPoll.abort();
        
        xhr.open("POST", '?contextKey=' + control._contextKey + "&cancel=1&guid=" + control._currentFileId, true);
        xhr.onreadystatechange = function () {
            self.setThrobber(false);
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    // set file status as canceled
                    control.setFileStatus(control._currentFileId, 'cancelled', Sys.Extended.UI.Resources.AjaxFileUpload_Canceled);
                    control.setStatusMessage(Sys.Extended.UI.Resources.AjaxFileUpload_UploadCanceled);
                    control._currentFileId = null;
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
        //iframe.src = "javascript:'<script>window.onload=function(){document.write(\\'<script>document.domain=\\\"" + document.domain + "\\\";<\\\\/script>\\');document.close();};<\/script>'";
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

    this.onIFrameLoadedHandler = function (e) {
        /// <summary>
        /// Event handler to capture when iframe receive response from server.
        /// </summary>
        /// <param name="e"></param>
        
        if (!control._currentFileId)
            return;

        try {
            
            var iframe = this._iframe, doc = null;
            
            // Only test the iframe data, exception should thrown if something went wrong.
            if (iframe.contentDocument)
                // Firefox, Opera
                doc = iframe.contentDocument;
            else if (iframe.contentWindow)
                // Internet Explorer
                doc = iframe.contentWindow.document;
            else if (iframe.document)
                // Others?
                doc = iframe.document;

            if (doc == null)
                throw "Document not initialized";

            // finalizing and upload next file
            control.doneAndUploadNextFile(control.getCurrentFileItem());

        } catch (e) {
            
            // Cancelation / aborting upload can causing 'Access is denied' or 'Permission denied' on IE 9 bellow,
            // let's consider this exception is not trully error exception from server.
            if (!control._canceled || !(e.message && (e.message.indexOf("Access is denied") > -1 || e.message.indexOf("Permission denied") > -1))) {
                this.raiseUploadError(e);
                throw e;
            }
        } 
    };

    this.setThrobber = function (value) {
        /// <summary>
        /// Show or hide throbber when processing upload.
        /// </summary>
        /// <param name="value"></param>

        if (control.get_serverPollingSupport()) {
            control.setPercent(0);
            $common.setVisible(elements.progressBar, value ? true : false);
            $common.setVisible(elements.progressBarContainer, value ? true : false);
            this.pollingServerProgress(value);
            return;
        }
        
        if (control.get_throbber() != null) {
            control.get_throbber().style.display = value ? "" : "none";
        }
    };

    this.pollingServerProgress = function (value) {
        /// <summary>
        /// Get percentage of uploading progress from server.
        /// </summary>
        /// <param name="value"></param>

        if (!value || !control._currentFileId)
            return;

        xhrPoll.open("GET", '?contextKey=' + control._contextKey + "&poll=1&guid=" + control._currentFileId, true);
        xhrPoll.send(null);
    };

    this.createForm = function () {
        /// <summary>
        /// Create form that we use to upload file one by one taken from queue.
        /// </summary>
        
        var form,
            formId = "___postForm" + control.get_id();
        
        try {
            form = document.createElement('<form method="post" enctype="multipart/form-data" id="' + formId + '" target="' + this._iframeName + '">');
        } catch (ex) {
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

    this.raiseUploadError = function (xhr) {
        
        control.raiseUploadError(xhr);
        control.setFileStatus(control._currentFileId, 'error', Sys.Extended.UI.Resources.AjaxFileUpload_error);
        
        if (xhrPoll)
            xhrPoll.abort();
        control._currentFileId = null;
    };

};
