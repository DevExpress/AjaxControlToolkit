Type.registerNamespace("Sys.Extended.UI.AjaxFileUpload");
Type.registerNamespace("AjaxFileUpload");

Sys.Extended.UI.AjaxFileUpload.Utils = function () {

    this.generateGuid = function() {
        var result, i, j;
        result = '';
        for (j = 0; j < 32; j++) {
            if (j == 8 || j == 12 || j == 16 || j == 20)
                result = result + '-';
            i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
            result = result + i;
        }
        return result;
    };

    this.getFileName = function (fullPath) {

        if (!fullPath)
            return '';
        
        if (!fullPath.value && fullPath.name)
            return fullPath.name;

        if (!fullPath.value && typeof (fullPath) !== "string")
            throw "Invalid parameter. fullPath parameter must be a string of full path or file element.";

        if (fullPath.value)
            fullPath = fullPath.value;

        if (fullPath) {
            var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
            var filename = fullPath.substring(startIndex);
            if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                filename = filename.substring(1);
            }
            return filename;
        }

        return '';
    };

    this.getFileType = function (file) {
        if (!file)
            throw 'file must defined or not null';

        if (!file.value && file.name)
            return file.name.substring(file.name.lastIndexOf('.') + 1);
        
        if (file.value)
            file = file.value;
        
        if (typeof (file) !== "string")
            throw "can't resolve file type.";

        return file.substring(file.lastIndexOf('.') + 1);
    };

    this.sizeToString = function(bytes) {
        if (!bytes || bytes <= 0)
            return '0 Kb';

        var s = ['bytes', 'kb', 'MB', 'GB', 'TB', 'PB'];
        var e = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    };

    this.checkHtml5BrowserSupport = function () {
        
        // IE10 Desktop (NOT Metro version) has FormData but it's buggy, 
        // so we want exclude it from Html5 supported browser
        var browser = Sys.Browser;
        if (browser.name == "Microsoft Internet Explorer" && browser.version <= 10)
            return false;
        
        return window.File
            && window.FileReader && window.FileList
            && window.Blob && (new XMLHttpRequest()).upload;
    };
    
};