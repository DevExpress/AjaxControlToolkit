/// <reference path="../../../client/microsoftajax.extended/common/common.pre.js" />

Type.registerNamespace("Sys.Extended.UI.AjaxFileUpload");
Type.registerNamespace("AjaxFileUpload");

Sys.Extended.UI.AjaxFileUpload.Item = function (parentId, fileItem, onRemoveItem) {

    

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
    initUI: function (onRemoveItem) {

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
       
        if (isHtml5Support) {
            this._fileSize = file.size;
            var fType = file.type ? '<span class="filetype">(' + file.type + ')</span>' : '';
            fileInfoText.innerHTML = '<span class="filename">' + this._fileName + '</span> '
                + fType
                + ' - <span class="filesize">' + utils.sizeToString(file.size) + '</span> ';
            this._fileType = file.type;
        } else {
            
            fileInfoText.innerHTML = '<span class="filename">' + this._fileName + '</span>';
            this._fileType = utils.getFileType(file);
        }
        
        fileInfoContainer.appendChild(fileInfoText);
        fileInfoContainer.appendChild(fileStatusText);
        
        $common.setText(deleteButton, Sys.Extended.UI.Resources.AjaxFileUpload_Remove);
        $addHandlers(deleteButton, {
            'click': Function.createDelegate(this, function () {
                onRemoveItem(self);
            })
        });

        // build the line item
        if (Sys.Browser.agent == Sys.Browser.InternetExplorer && Sys.Browser.version <= 8) {
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

    setStatus: function (fileStatusText, text) {
        $common.setText(this._fileStatusText, ' (' + text + ')');
        this._fileInfoContainer.setAttribute('class', fileStatusText + 'State');
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
        $common.removeElement(this._inputElementValue);
        $common.removeElement(this._deleteButton);
        $common.removeElement(this._ui);
    },

    get_inputElementValue: function () {
        return this._inputElementValue;
    },

    appendNodeTo: function (parent) {
        parent.appendChild(this._ui);
    },

    removeNodeFrom: function (parent) {
        parent.removeChild(this._ui);
    }
};