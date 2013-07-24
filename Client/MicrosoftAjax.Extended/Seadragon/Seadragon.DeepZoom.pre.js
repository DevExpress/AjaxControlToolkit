Type.registerNamespace('Sys.Extended.UI.Seadragon');

Sys.Extended.UI.Seadragon.DziError = function(message) {
    Sys.Extended.UI.Seadragon.DziError.initializeBase(this, [message]);
    this.message = message;
};
Sys.Extended.UI.Seadragon.DziError.registerClass('Sys.Extended.UI.Seadragon.DziError', Error);

Sys.Extended.UI.Seadragon.DziTileSource = function(width, height, tileSize, tileOverlap, tilesUrl, fileFormat, displayRects) {
    Sys.Extended.UI.Seadragon.DziTileSource.initializeBase(this, [width, height, tileSize, tileOverlap, null, null]);
    this._levelRects = {};
    this.tilesUrl = tilesUrl;

    this.fileFormat = fileFormat;
    this.displayRects = displayRects;
    this._init();
};
Sys.Extended.UI.Seadragon.DziTileSource.prototype = {
    _init: function() {
        if (!this.displayRects) {
            return;
        }

        for (var i = this.displayRects.length - 1; i >= 0; i--) {
            var rect = this.displayRects[i];
            for (var level = rect.minLevel; level <= rect.maxLevel; level++) {
                if (!this._levelRects[level]) {
                    this._levelRects[level] = [];
                }
                this._levelRects[level].push(rect);
            }
        }
    },
    getTileUrl: function(level, x, y) {
        // using array join because it's faster than string concatenation
        return [this.tilesUrl, level, '/', x, '_', y, '.', this.fileFormat].join('');
    },

    tileExists: function(level, x, y) {
        var rects = this._levelRects[level];

        if (!rects || !rects.length) {
            return true;
        }

        for (var i = rects.length - 1; i >= 0; i--) {
            var rect = rects[i];

            // check level
            if (level < rect.minLevel || level > rect.maxLevel) {
                continue;
            }

            // transform rectangle coordinates to this level
            var scale = this.getLevelScale(level);
            var xMin = rect.x * scale;
            var yMin = rect.y * scale;
            var xMax = xMin + rect.width * scale;
            var yMax = yMin + rect.height * scale;

            // convert to rows and columns -- note that we're ignoring tile
            // overlap, but it's a reasonable approximation. it errs on the side
            // of false positives, which is much better than false negatives.
            xMin = Math.floor(xMin / this.tileSize);
            yMin = Math.floor(yMin / this.tileSize);
            xMax = Math.ceil(xMax / this.tileSize);
            yMax = Math.ceil(yMax / this.tileSize);

            if (xMin <= x && x < xMax && yMin <= y && y < yMax) {
                return true;
            }
        }

        return false;
    }
};
Sys.Extended.UI.Seadragon.DziTileSource.registerClass('Sys.Extended.UI.Seadragon.DziTileSource', Sys.Extended.UI.Seadragon.TileSource);
Sys.Extended.UI.Seadragon._DziTileSourceHelper = function() {

};
Sys.Extended.UI.Seadragon._DziTileSourceHelper.prototype = {
    createFromXml: function(xmlUrl, xmlString, callback) {
        var async = typeof (callback) == "function";
        var error = null;

        if (!xmlUrl) {
            this.error = Seadragon.Strings.getString("Errors.Empty");
            if (async) {
                window.setTimeout(function() {
                    callback(null, error);
                }, 1);
                return null;
            }
            throw new Sys.Extended.UI.Seadragon.DziError(error);
        }

        // extract tile url
        var urlParts = xmlUrl.split('/');
        var filename = urlParts[urlParts.length - 1];
        var lastDot = filename.lastIndexOf('.');

        if (lastDot > -1) {
            urlParts[urlParts.length - 1] = filename.slice(0, lastDot);
        }

        var tilesUrl = urlParts.join('/') + "_files/";
        function finish(func, obj) {
            try {
                return func(obj, tilesUrl);
            } catch (e) {
                if (async) {
                    error = this.getError(e).message;
                    return null;
                } else {
                    throw this.getError(e);
                }
            }
        }
        if (async) {
            if (xmlString) {
                var handler = Function.createDelegate(this, this.processResponse);
                window.setTimeout(function() {
                    var source = finish(handler, Seadragon.Utils.parseXml(xmlString));
                    callback(source, error);    // call after finish sets error
                }, 1);
            } else {
                var handler = Function.createDelegate(this, this.processResponse);
                Seadragon.Utils.makeAjaxRequest(xmlUrl, function(xhr) {
                    var source = finish(handler, xhr);
                    callback(source, error);    // call after finish sets error
                });
            }

            return null;
        }

        // synchronous version
        if (xmlString) {
            return finish(Function.createDelegate(this, this.processXml), Seadragon.Utils.parseXml(xmlString));
        } else {
            return finish(Function.createDelegate(this, this.processResponse), Seadragon.Utils.makeAjaxRequest(xmlUrl));
        }
    },
    processResponse: function(xhr, tilesUrl) {
        if (!xhr) {
            throw new Sys.Extended.UI.Seadragon.DziError(Seadragon.Strings.getString("Errors.Security"));
        } else if (xhr.status !== 200 && xhr.status !== 0) {
            // chrome has bug where it sends "OK" for 404
            var status = xhr.status;
            var statusText = (status == 404) ? "Not Found" : xhr.statusText;
            throw new Sys.Extended.UI.Seadragon.DziError(Seadragon.Strings.getString("Errors.Status", status, statusText));
        }

        var doc = null;

        if (xhr.responseXML && xhr.responseXML.documentElement) {
            doc = xhr.responseXML;
        } else if (xhr.responseText) {
            doc = Seadragon.Utils.parseXml(xhr.responseText);
        }

        return this.processXml(doc, tilesUrl);
    },

    processXml: function(xmlDoc, tilesUrl) {
        if (!xmlDoc || !xmlDoc.documentElement) {
            throw new Sys.Extended.UI.Seadragon.DziError(Seadragon.Strings.getString("Errors.Xml"));
        }

        var root = xmlDoc.documentElement;
        var rootName = root.tagName;

        if (rootName == "Image") {
            try {
                return this.processDzi(root, tilesUrl);
            } catch (e) {
                var defMsg = Seadragon.Strings.getString("Errors.Dzi");
                throw (e instanceof Sys.Extended.UI.Seadragon.DziError) ? e : new Sys.Extended.UI.Seadragon.DziError(defMsg);
            }
        } else if (rootName == "Collection") {
            throw new Sys.Extended.UI.Seadragon.DziError(Seadragon.Strings.getString("Errors.Dzc"));
        } else if (rootName == "Error") {
            return this.processError(root);
        }

        throw new Sys.Extended.UI.Seadragon.DziError(Seadragon.Strings.getString("Errors.Dzi"));
    },

    processDzi: function(imageNode, tilesUrl) {
        var fileFormat = imageNode.getAttribute("Format");

        if (!Seadragon.Utils.imageFormatSupported(fileFormat)) {
            throw new Sys.Extended.UI.Seadragon.DziError(Seadragon.Strings.getString("Errors.ImageFormat",
                    fileFormat.toUpperCase()));
        }

        var sizeNode = imageNode.getElementsByTagName("Size")[0];
        var dispRectNodes = imageNode.getElementsByTagName("DisplayRect");

        var width = parseInt(sizeNode.getAttribute("Width"), 10);
        var height = parseInt(sizeNode.getAttribute("Height"), 10);
        var tileSize = parseInt(imageNode.getAttribute("TileSize"));
        var tileOverlap = parseInt(imageNode.getAttribute("Overlap"));
        var dispRects = [];

        for (var i = 0; i < dispRectNodes.length; i++) {
            var dispRectNode = dispRectNodes[i];
            var rectNode = dispRectNode.getElementsByTagName("Rect")[0];

            dispRects.push(new Seadragon.DisplayRect(
                parseInt(rectNode.getAttribute("X"), 10),
                parseInt(rectNode.getAttribute("Y"), 10),
                parseInt(rectNode.getAttribute("Width"), 10),
                parseInt(rectNode.getAttribute("Height"), 10),
                0,  // ignore MinLevel attribute, bug in Deep Zoom Composer
                parseInt(dispRectNode.getAttribute("MaxLevel"), 10)
            ));
        }
        return new Sys.Extended.UI.Seadragon.DziTileSource(width, height, tileSize, tileOverlap,
                tilesUrl, fileFormat, dispRects);
    },

    processError: function(errorNode) {
        var messageNode = errorNode.getElementsByTagName("Message")[0];
        var message = messageNode.firstChild.nodeValue;

        throw new Sys.Extended.UI.Seadragon.DziError(message);
    },
    getError: function(e) {
        if (!(e instanceof DziError)) {
            // shouldn't happen, but if it does, fail fast or at least log it
            Seadragon.Debug.error(e.name + " while creating DZI from XML: " + e.message);
            e = new Sys.Extended.UI.Seadragon.DziError(Seadragon.Strings.getString("Errors.Unknown"));
        }

    }
};
//Static objects
Sys.Extended.UI.Seadragon.DziTileSourceHelper = new Sys.Extended.UI.Seadragon._DziTileSourceHelper();