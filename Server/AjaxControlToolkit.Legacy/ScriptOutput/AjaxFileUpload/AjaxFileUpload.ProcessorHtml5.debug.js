Type.registerNamespace("Sys.Extended.UI.AjaxFileUpload");
Type.registerNamespace("AjaxFileUpload");

Sys.Extended.UI.AjaxFileUpload.ProcessorHtml5 = function (control, elements) {

    var utils = new Sys.Extended.UI.AjaxFileUpload.Utils(),
        chunkSize = control.get_chunkSize() * 1000,
        tmpXhrLoaded = 0,
        xhrReq = null;

    this.initialize = function () {
        $common.setVisible(elements.dropZone, true);
        elements.dropZone.innerHTML = Sys.Extended.UI.Resources.AjaxFileUpload_DropFiles;

        this.attachEvents();
    };

    this.attachEvents = function () {
        
        this.onFileDropped$delegate = Function.createDelegate(this, this.onFileDroppedHandler);
        this.onFileDragOver$delegate = Function.createDelegate(this, this.onFileDragOverHandler);
        this.onFileSelected$delegate = Function.createDelegate(this, this.onFileSelectedHandler);
        
        elements.inputFile.addEventListener("change", this.onFileSelected$delegate, false);
        elements.dropZone.addEventListener("drop", this.onFileDropped$delegate, false);
        elements.dropZone.addEventListener("dragover", this.onFileDragOver$delegate, false);

    };
    

    this.onFileDroppedHandler = function (e) {
        e.stopPropagation();
        e.preventDefault();
        this.addFilesToQueue(e.dataTransfer.files);
    };
    
    this.onFileDragOverHandler = function (e) {
        e.stopPropagation();
        e.preventDefault();
    };

    this.onFileSelectedHandler = function (e) {
        this.addFilesToQueue(e.target.files);
    };
    
    


    this.addFilesToQueue = function (files) {
        /// <summary>
        /// Validate and generate file item from HTML5 files.
        /// </summary>
        /// <param name="files">HTML5 files.</param>
        
        for (var i = 0; i < files.length; i++) {

            var blob = files[i],
                slices = 0;
            
            if (blob.size > chunkSize) {
                slices = Math.ceil(blob.size / chunkSize);
            }

            var fileItem = {
                    id: utils.generateGuid(),
                    value: files[i],
                    type: utils.getFileType(files[i]),
                    uploaded: false,
                    slices: slices
                };
            
            if (control.fileTypeIsValid(fileItem.type)) {
                if (!control.addFileToQueue(fileItem))
                    break;
            } else {
                control.confirmFileIsInvalid(fileItem);
            }
        }

        elements.inputFile.value = null;
    };
    
    this.cancelUpload = function () {
        
        if (xhrReq) xhrReq.abort();
        
        control.setFileStatus(control._currentFileId, 'cancelled', Sys.Extended.UI.Resources.AjaxFileUpload_Canceled);
        control.setStatusMessage(Sys.Extended.UI.Resources.AjaxFileUpload_UploadCanceled);
    },

    this.startUpload = function () {
        /// <summary>
        /// Get un-uploaded file on the top from queue and start upload it.
        /// </summary>
        
        var fileItem = control.getNextFile();
        
        if (fileItem) {
            if (fileItem._sliceIndex === 0)
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

    this.upload = function (fileItem) {
        /// <summary>
        /// Process file item for uploading.
        /// </summary>
        /// <param name="fileItem">file item to be uploaded</param>
        
        if (!control._isUploading)
            return;

        $common.setVisible(elements.progressBar, true);
        
        control.setAsUploading(fileItem);

        var blob = fileItem.get_inputElementValue(),
            fileName = fileItem._fileName,
            chunked = fileItem._slices && (fileItem._slices > 0),
            firstChunk = fileItem._sliceIndex == 0;
        
        if (chunked) {
            var start = fileItem._sliceIndex * chunkSize,
                stop = start + chunkSize;            
            blob = blob.slice(start, stop > blob.size ? blob.size : stop);
        } 

        var form = new FormData(),
            id = control._currentFileId = fileItem._id,
            xhrReq = new XMLHttpRequest(),
            self = this,
            xhrDelegate = function (method) { return function (e) { method.call(self, id, e); }; };
        
        xhrReq.upload.addEventListener("progress", xhrDelegate(this.onProgressHandler), false);
        xhrReq.addEventListener("load", xhrDelegate(this.onUploadCompleteHandler), false);
        xhrReq.addEventListener("error", xhrDelegate(this.onUploadFailedHandler), false);
        xhrReq.addEventListener("abort", xhrDelegate(this.onUploadCanceledHandler), false);
        xhrReq.open("POST", control._uploadUrl + '?contextKey=' + control._contextKey + '&fileId=' + id + '&fileName=' + fileName + '&chunked=' + (chunked ? "true" : "false") + '&firstChunk=' + firstChunk + '&storeToAzure=' + control.get_storeToAzure() + '&acn='+control.get_azureContainerName(), true);
        form.append("act-file-data", blob);
        xhrReq.send(form);
    };

    this.onProgressHandler = function (id, xhr) {
        /// <summary>
        /// if lengthComputable is available, then let's provide progress bar animation.
        /// </summary>
        /// <param name="id">fileId</param>
        /// <param name="xhr"></param>
        

        if (!control._isUploading)
            return;
        

        if (xhr.lengthComputable) {

            tmpXhrLoaded = xhr.loaded;
            
            var fileItem = control.getFileItem(id),
                slices = fileItem._slices,
                
                allBytesUploaded = fileItem._bytesUploaded + tmpXhrLoaded,
                
                calculatedFileSize =
                    slices - fileItem._sliceIndex == 1
                        ? allBytesUploaded
                        : xhr.total * slices,

                percentComplete =
                    slices == 0 
                        ? (xhr.loaded * 100 / xhr.total).toFixed(2)
                        : ((allBytesUploaded / calculatedFileSize) * 100).toFixed(2);
            
            control.setPercent(percentComplete);
        }
    };

    this.onUploadCompleteHandler = function (id, xhr) {
        /// <summary>
        /// This handler invoked once all stream are uploaded.
        /// </summary>
        /// <param name="id">File Id</param>
        /// <param name="xhr">XHR sender</param>
        
        var self = this,
            fileItem = control.getFileItem(id),
            file = fileItem.get_inputElementValue();
        
        
        if (fileItem._slices && fileItem._slices > 0 && fileItem._sliceIndex + 1 < fileItem._slices) {
            
            fileItem._sliceIndex++;
            fileItem._bytesUploaded += tmpXhrLoaded;
            tmpXhrLoaded = 0;
            self.startUpload();
            
        } else {
            
            fileItem._isUploading = false;
            fileItem._isUploaded = true;
            
            fileItem.hide();
            
            fileItem.setStatus('uploaded', Sys.Extended.UI.Resources.AjaxFileUpload_Uploaded);
            control.setStatusMessage(String.format(Sys.Extended.UI.Resources.AjaxFileUpload_UploadingHtml5File,
                file.name, utils.sizeToString(file.size)));

            control.doneAndUploadNextFile(fileItem);
        }
    };

    this.onUploadFailedHandler = function (id, xhr) {
        /// <summary>
        /// Event handler when ajax request for upload is error.
        /// </summary>
        /// <param name="id">file id</param>
        /// <param name="xhr">xhr</param>
        var fileItem = control.getFileItem(id);
        fileItem._isUploading = false;
        control.setFileStatus(id, 'error', Sys.Extended.UI.Resources.AjaxFileUpload_error);
        control.raiseUploadError(xhr);
    };

    this.onUploadCanceledHandler = function (id, xhr) {
        /// <summary>
        /// Event handler when ajax request for upload is aborted.
        /// </summary>
        /// <param name="id">file id</param>
        /// <param name="xhr">xhr</param>
        var fileItem = control.getFileItem(id);
        fileItem._isUploading = false;
        control.setFileStatus(fileItem, 'canceled', Sys.Extended.UI.Resources.AjaxFileUpload_Canceled);
    };

    
};
