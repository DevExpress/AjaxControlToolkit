?Type.registerNamespace("Sys.Extended.UI.AjaxFileUpload");
Type.registerNamespace("AjaxFileUpload");

Sys.Extended.UI.AjaxFileUpload.Processor = function (control, elements) {
    
    var utils = new Sys.Extended.UI.AjaxFileUpload.Utils();

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
        
        this.setThrobber(true);
        
        // set file item status
        control.setAsUploading(fileItem);
        
        var inputElement = fileItem.get_inputElementValue();

        // set current file id
        control._currentFileId = fileItem._id;

        // clear all form children
        while (form.firstChild) {
            form.removeChild(form.firstChild);
        }

        inputElement.name= 'act-file-data';
        
        // only add 1 file input element to be uploaded
        form.appendChild(inputElement);
        form.setAttribute("action", control._uploadUrl + '?contextKey=' + control._contextKey + '&fileId=' + control._currentFileId + '&fileName=' + fileItem._fileName);
        
        // upload it now
        form.submit();
    };

    this.cancelUpload = function() {
        // send message to server to cancel this upload
        var xhr = new XMLHttpRequest(),
            self = this;
        xhr.open("POST", "?cancel=1&guid=" + control._currentFileId, true);
        xhr.onreadystatechange = function () {
            self.setThrobber(false);
            if (xhr.readyState == 4 && xhr.status == 200) {
                // set file status as canceled
                control.setFileStatus(control._currentFileId, 'cancelled', Sys.Extended.UI.Resources.AjaxFileUpload_Canceled);
                control.setStatusMessage(Sys.Extended.UI.Resources.AjaxFileUpload_UploadCanceled);
            } else {
                // cancelation is error. 
                control.setFileStatus(control._currentFileId, 'error', Sys.Extended.UI.Resources.AjaxFileUpload_error);
                control.raiseUploadError(xhr);
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
            if (!(e.message && (e.message.indexOf("Access is denied") > -1 || e.message.indexOf("Permission denied") > -1))) {
                control.setFileStatus(control._currentFileId, 'error', Sys.Extended.UI.Resources.AjaxFileUpload_error);
                control.raiseUploadError(e);
                throw e;
            }
        } 
    };

    this.setThrobber = function (value) {
        /// <summary>
        /// Show or hide throbber when processing upload.
        /// </summary>
        /// <param name="value"></param>
        
        if (control.get_throbber() != null) {
            control.get_throbber().style.display = value ? "" : "none";
        }
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

};
