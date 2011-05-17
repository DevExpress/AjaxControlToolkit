// (c) 2010 CodePlex Foundation
Type.registerNamespace('Sys.Extended.UI.Seadragon');

Sys.Extended.UI.Seadragon.Job = function(src, callback) {
    this._image = null;
    this._timeout = null;
    this._src = src;
    this._callback = callback;
    this.TIMEOUT = 5000;
}
Sys.Extended.UI.Seadragon.Job.prototype = {
    _finish: function(success) {
        this._image.onload = null;
        this._image.onabort = null;
        this._image.onerror = null;


        if (this._timeout) {
            window.clearTimeout(this._timeout);
        }

        var image = this._image;
        var callback = this._callback;
        window.setTimeout(function() {
            callback(this._src, success ? image : null);
        }, 1);
    },
    _onloadHandler: function() {
        this._finish(true);
    },
    _onerrorHandler: function() {
        this._finish(false);
    },
    start: function() {
        this._image = new Image();
        this._image.onload = Function.createDelegate(this, this._onloadHandler);
        this._image.onabort = Function.createDelegate(this, this._onerrorHandler);
        this._image.onerror = Function.createDelegate(this, this._onerrorHandler);

        this._timeout = window.setTimeout(Function.createDelegate(this, this._onerrorHandler), this.TIMEOUT);

        this._image.src = this._src;
    }
}
Sys.Extended.UI.Seadragon.Job.registerClass('Sys.Extended.UI.Seadragon.Job', null, Sys.IDisposable);


Sys.Extended.UI.Seadragon.ImageLoader = function(imageLoaderLimit) {
	this._downloading = 0;
	this.imageLoaderLimit = imageLoaderLimit;
}
Sys.Extended.UI.Seadragon.ImageLoader.prototype = {
    _onComplete: function(callback, src, image) {
        this._downloading--;
        if (typeof (callback) == "function") {
            try {
                callback(image);
            } catch (e) {
                Seadragon.Debug.error(e.name + " while executing " + src +
                            " callback: " + e.message, e);
            }
        }
    },
    loadImage: function(src, callback) {
        if (this._downloading >= this.imageLoaderLimit) {
            return false;
        }

        var func = Seadragon.Utils.createCallback(null, Function.createDelegate(this, this._onComplete), callback);
        var job = new Sys.Extended.UI.Seadragon.Job(src, func);

        this._downloading++;
        job.start();

        return true;
    }
}
Sys.Extended.UI.Seadragon.ImageLoader.registerClass('Sys.Extended.UI.Seadragon.ImageLoader', null, Sys.IDisposable);

