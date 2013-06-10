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