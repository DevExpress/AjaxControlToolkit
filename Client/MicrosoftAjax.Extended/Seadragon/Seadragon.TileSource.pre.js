Type.registerNamespace('Sys.Extended.UI.Seadragon');


Sys.Extended.UI.Seadragon.TileSource = function(width, height, tileSize, tileOverlap, minLevel, maxLevel) {
    this.aspectRatio = width / height;
    this.dimensions = new Sys.Extended.UI.Seadragon.Point(width, height);
    this.minLevel = minLevel ? minLevel : 0;
    this.maxLevel = maxLevel ? maxLevel :
            Math.ceil(Math.log(Math.max(width, height)) / Math.log(2));
    this.tileSize = tileSize ? tileSize : 0;
    this.tileOverlap = tileOverlap ? tileOverlap : 0;
};
Sys.Extended.UI.Seadragon.TileSource.prototype = {
    getLevelScale: function(level) {
        // equivalent to Math.pow(0.5, numLevels - level);
        return 1 / (1 << (this.maxLevel - level));
    },

    getNumTiles: function(level) {
        var scale = this.getLevelScale(level);
        var x = Math.ceil(scale * this.dimensions.x / this.tileSize);
        var y = Math.ceil(scale * this.dimensions.y / this.tileSize);

        return new Sys.Extended.UI.Seadragon.Point(x, y);
    },

    getPixelRatio: function(level) {
        var imageSizeScaled = this.dimensions.times(this.getLevelScale(level));
        var rx = 1.0 / imageSizeScaled.x;
        var ry = 1.0 / imageSizeScaled.y;

        return new Sys.Extended.UI.Seadragon.Point(rx, ry);
    },

    getTileAtPoint: function(level, point) {
        var pixel = point.times(this.dimensions.x).times(this.getLevelScale(level));

        var tx = Math.floor(pixel.x / this.tileSize);
        var ty = Math.floor(pixel.y / this.tileSize);

        return new Sys.Extended.UI.Seadragon.Point(tx, ty);
    },

    getTileBounds: function(level, x, y) {
        // work in scaled pixels for this level
        var dimensionsScaled = this.dimensions.times(this.getLevelScale(level));

        // find position, adjust for no overlap data on top and left edges
        var px = (x === 0) ? 0 : this.tileSize * x - this.tileOverlap;
        var py = (y === 0) ? 0 : this.tileSize * y - this.tileOverlap;

        // find size, adjust for no overlap data on top and left edges
        var sx = this.tileSize + (x === 0 ? 1 : 2) * this.tileOverlap;
        var sy = this.tileSize + (y === 0 ? 1 : 2) * this.tileOverlap;

        // adjust size for single-tile levels where the image size is smaller
        // than the regular tile size, and for tiles on the bottom and right
        // edges that would exceed the image bounds
        sx = Math.min(sx, dimensionsScaled.x - px);
        sy = Math.min(sy, dimensionsScaled.y - py);

        // finally, normalize...
        // note that isotropic coordinates ==> only dividing by scaled x!
        var scale = 1.0 / dimensionsScaled.x;
        return new Sys.Extended.UI.Seadragon.Rect(px * scale, py * scale, sx * scale, sy * scale);
    },

    getTileUrl: function(level, x, y) {
        throw new Error("Method not implemented.");
    },

    tileExists: function(level, x, y) {
        var numTiles = this.getNumTiles(level);
        return level >= this.minLevel && level <= this.maxLevel &&
                x >= 0 && y >= 0 && x < numTiles.x && y < numTiles.y;
    }
};
Sys.Extended.UI.Seadragon.TileSource.registerClass('Sys.Extended.UI.Seadragon.TileSource', null, Sys.IDisposable);
