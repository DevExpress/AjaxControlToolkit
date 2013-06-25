Type.registerNamespace('Sys.Extended.UI.Seadragon');

Sys.Extended.UI.Seadragon.Viewport = function(containerSize, contentSize, config) {
	this.zoomPoint = null;
	this.config = config;
	this._containerSize = containerSize;
	this._contentSize = contentSize;
	this._contentAspect = contentSize.x / contentSize.y;
	this._contentHeight = contentSize.y / contentSize.x;
	this._centerSpringX = new Seadragon.Spring(0, this.config);
	this._centerSpringY = new Seadragon.Spring(0, this.config);
	this._zoomSpring = new Seadragon.Spring(1, this.config);
	this._homeBounds = new Sys.Extended.UI.Seadragon.Rect(0, 0, 1, this._contentHeight);
	this.goHome(true);
	this.update();
};
Sys.Extended.UI.Seadragon.Viewport.prototype = {
	_getHomeZoom: function() {
		var aspectFactor = this._contentAspect / this.getAspectRatio();
		// if content is wider, we'll fit width, otherwise height
		return (aspectFactor >= 1) ? 1 : aspectFactor;
	},

	_getMinZoom: function() {
		var homeZoom = this._getHomeZoom();

		// for backwards compatibility, respect minZoomDimension if present
		if (this.config.minZoomDimension) {
			var zoom = (this._contentSize.x <= this._contentSize.y) ?
                this.config.minZoomDimension / this._containerSize.x :
                this.config.minZoomDimension / (this._containerSize.x * this._contentHeight);
		} else {
			var zoom = this.config.minZoomImageRatio * homeZoom;
		}

		return Math.min(zoom, homeZoom);
	},

	_getMaxZoom: function() {
		var zoom = this._contentSize.x * this.config.maxZoomPixelRatio / this._containerSize.x;
		return Math.max(zoom, this._getHomeZoom());
	},
	getAspectRatio: function() {
		return this._containerSize.x / this._containerSize.y;
	},
	getContainerSize: function() {
		return new Sys.Extended.UI.Seadragon.Point(this._containerSize.x, this._containerSize.y);
	},

	getBounds: function(current) {
		var center = this.getCenter(current);
		var width = 1.0 / this.getZoom(current);
		var height = width / this.getAspectRatio();

		return new Sys.Extended.UI.Seadragon.Rect(center.x - width / 2.0, center.y - height / 2.0,
            width, height);
	},

	getCenter: function(current) {
		var centerCurrent = new Sys.Extended.UI.Seadragon.Point(this._centerSpringX.getCurrent(),
                this._centerSpringY.getCurrent());
		var centerTarget = new Sys.Extended.UI.Seadragon.Point(this._centerSpringX.getTarget(),
                this._centerSpringY.getTarget());

		if (current) {
			return centerCurrent;
		} else if (!this.zoomPoint) {
			// no adjustment necessary since we're not zooming
			return centerTarget;
		}

		// to get the target center, we need to adjust for the zoom point.
		// we'll do this in the same way as the update() method.
		var oldZoomPixel = this.pixelFromPoint(this.zoomPoint, true);

		// manually calculate bounds based on this unadjusted target center.
		// this is mostly a duplicate of getBounds() above. note that this is
		// based on the TARGET zoom but the CURRENT center.
		var zoom = this.getZoom();
		var width = 1.0 / zoom;
		var height = width / this.getAspectRatio();
		var bounds = new Sys.Extended.UI.Seadragon.Rect(centerCurrent.x - width / 2.0,
                centerCurrent.y - height / 2.0, width, height);

		// the conversions here are identical to the pixelFromPoint() and
		// deltaPointsFromPixels() methods.
		var newZoomPixel = this.zoomPoint.minus(bounds.getTopLeft()).times(this._containerSize.x / bounds.width);
		var deltaZoomPixels = newZoomPixel.minus(oldZoomPixel);
		var deltaZoomPoints = deltaZoomPixels.divide(this._containerSize.x * zoom);

		// finally, shift center to negate the change.
		return centerTarget.plus(deltaZoomPoints);
	},

	getZoom: function(current) {
		if (current) {
			return this._zoomSpring.getCurrent();
		} else {
			return this._zoomSpring.getTarget();
		}
	},

	// Methods -- MODIFIERS

	applyConstraints: function(immediately) {
		// first, apply zoom constraints
		var actualZoom = this.getZoom();
		var constrainedZoom = Math.max(Math.min(actualZoom, this._getMaxZoom()), this._getMinZoom());
		if (actualZoom != constrainedZoom) {
			this.zoomTo(constrainedZoom, this.zoomPoint, immediately);
		}

		// then, apply pan constraints
		var bounds = this.getBounds();
		var visibilityRatio = this.config.visibilityRatio;

		// threshold in normalized coordinates
		var horThres = visibilityRatio * bounds.width;
		var verThres = visibilityRatio * bounds.height;

		// amount visible in normalized coordinates
		var left = bounds.x + bounds.width;
		var right = 1 - bounds.x;
		var top = bounds.y + bounds.height;
		var bottom = this._contentHeight - bounds.y;

		// adjust viewport horizontally -- in normalized coordinates!
		var dx = 0;
		if (this.config.wrapHorizontal) {
			// nothing to constrain
		} else if (left < horThres) {
			dx = horThres - left;
		} else if (right < horThres) {
			dx = right - horThres;
		}

		// adjust viewport vertically -- in normalized coordinates!
		var dy = 0;
		if (this.config.wrapVertical) {
			// nothing to constrain
		} else if (top < verThres) {
			dy = verThres - top;
		} else if (bottom < verThres) {
			dy = bottom - verThres;
		}

		// pan if we aren't zooming, otherwise set the zoom point if we are.
		// we've already implemented logic in fitBounds() for this.
		if (dx || dy) {
			bounds.x += dx;
			bounds.y += dy;
			this.fitBounds(bounds, immediately);
		}
	},

	ensureVisible: function(immediately) {
		// for backwards compatibility
		this.applyConstraints(immediately);
	},

	fitBounds: function(bounds, immediately) {
		var aspect = this.getAspectRatio();
		var center = bounds.getCenter();

		// resize bounds to match viewport's aspect ratio, maintaining center.
		// note that zoom = 1/width, and width = height*aspect.
		var newBounds = new Sys.Extended.UI.Seadragon.Rect(bounds.x, bounds.y, bounds.width, bounds.height);
		if (newBounds.getAspectRatio() >= aspect) {
			// width is bigger relative to viewport, resize height
			newBounds.height = bounds.width / aspect;
			newBounds.y = center.y - newBounds.height / 2;
		} else {
			// height is bigger relative to viewport, resize width
			newBounds.width = bounds.height * aspect;
			newBounds.x = center.x - newBounds.width / 2;
		}

		// stop movement first! this prevents the operation from missing
		this.panTo(this.getCenter(true), true);
		this.zoomTo(this.getZoom(true), null, true);

		// capture old values for bounds and width. we need both, but we'll
		// also use both for redundancy, to protect against precision errors.
		// note: use target bounds, since update() hasn't been called yet!
		var oldBounds = this.getBounds();
		var oldZoom = this.getZoom();

		// if we're already at the correct zoom, just pan and we're done.
		// we'll check both zoom and bounds for redundancy, to protect against
		// precision errors (see note below).
		var newZoom = 1.0 / newBounds.width;
		if (newZoom == oldZoom || newBounds.width == oldBounds.width) {
			this.panTo(center, immediately);
			return;
		}

		// otherwise, we need to zoom about the only point whose pixel transform
		// is constant between the old and new bounds. this is just tricky math.
		var refPoint = oldBounds.getTopLeft().times(this._containerSize.x / oldBounds.width).minus(
                newBounds.getTopLeft().times(this._containerSize.x / newBounds.width)).divide(
                this._containerSize.x / oldBounds.width - this._containerSize.x / newBounds.width);

		// note: that last line (cS.x / oldB.w - cS.x / newB.w) was causing a
		// divide by 0 in the case that oldBounds.width == newBounds.width.
		// that should have been picked up by the zoom check, but in certain
		// cases, the math is slightly off and the zooms are different. so now,
		// the zoom check has an extra check added.

		this.zoomTo(newZoom, refPoint, immediately);
	},

	goHome: function(immediately) {
		// calculate center adjusted for zooming
		var center = this.getCenter();

		// if we're wrapping horizontally, "unwind" the horizontal spring
		if (this.config.wrapHorizontal) {
			// this puts center.x into the range [0, 1) always
			center.x = (1 + (center.x % 1)) % 1;
			this._centerSpringX.resetTo(center.x);
			this._centerSpringX.update();
		}

		// if we're wrapping vertically, "unwind" the vertical spring
		if (this.config.wrapVertical) {
			// this puts center.y into the range e.g. [0, 0.75) always
			center.y = (this._contentHeight + (center.y % this._contentHeight)) % this._contentHeight;
			this._centerSpringY.resetTo(center.y);
			this._centerSpringY.update();
		}

		this.fitBounds(this._homeBounds, immediately);
	},

	panBy: function(delta, immediately) {
		// this breaks if we call self.getCenter(), since that adjusts the
		// center for zoom. we don't want that, so use the unadjusted center.
		var center = new Sys.Extended.UI.Seadragon.Point(this._centerSpringX.getTarget(),
                this._centerSpringY.getTarget());
		this.panTo(center.plus(delta), immediately);
	},

	panTo: function(center, immediately) {
		if (immediately) {
			this._centerSpringX.resetTo(center.x);
			this._centerSpringY.resetTo(center.y);
		} else {
			this._centerSpringX.springTo(center.x);
			this._centerSpringY.springTo(center.y);
		}
	},

	zoomBy: function(factor, refPoint, immediately) {
		this.zoomTo(this._zoomSpring.getTarget() * factor, refPoint, immediately);
	},

	zoomTo: function(zoom, refPoint, immediately) {
		// we used to constrain zoom automatically here; now it needs to be
		// explicitly constrained, via applyConstraints().
		//zoom = Math.max(zoom, getMinZoom());
		//zoom = Math.min(zoom, getMaxZoom());

		if (immediately) {
			this._zoomSpring.resetTo(zoom);
		} else {		
			this._zoomSpring.springTo(zoom);
		}

		this.zoomPoint = refPoint instanceof Sys.Extended.UI.Seadragon.Point ? refPoint : null;
	},

	resize: function(newContainerSize, maintain) {
		// default behavior: just ensure the visible content remains visible.
		// note that this keeps the center (relative to the content) constant.
		var oldBounds = this.getBounds();
		var newBounds = oldBounds;
		var widthDeltaFactor = newContainerSize.x / this._containerSize.x;

		// update container size, but make copy first
		this._containerSize = new Sys.Extended.UI.Seadragon.Point(newContainerSize.x, newContainerSize.y);

		if (maintain) {
			// no resize relative to screen, resize relative to viewport.
			// keep origin constant, zoom out (increase bounds) by delta factor.
			newBounds.width = oldBounds.width * widthDeltaFactor;
			newBounds.height = newBounds.width / this.getAspectRatio();
		}

		this.fitBounds(newBounds, true);
	},

	update: function() {
		var oldCenterX = this._centerSpringX.getCurrent();
		var oldCenterY = this._centerSpringY.getCurrent();
		var oldZoom = this._zoomSpring.getCurrent();

		// remember position of zoom point
		if (this.zoomPoint) {
			var oldZoomPixel = this.pixelFromPoint(this.zoomPoint, true);
		}

		// now update zoom only, don't update pan yet
		this._zoomSpring.update();

		// adjust for change in position of zoom point, if we've zoomed
		if (this.zoomPoint && this._zoomSpring.getCurrent() != oldZoom) {
			var newZoomPixel = this.pixelFromPoint(this.zoomPoint, true);
			var deltaZoomPixels = newZoomPixel.minus(oldZoomPixel);
			var deltaZoomPoints = this.deltaPointsFromPixels(deltaZoomPixels, true);

			// shift pan to negate the change
			this._centerSpringX.shiftBy(deltaZoomPoints.x);
			this._centerSpringY.shiftBy(deltaZoomPoints.y);
		} else {
			// don't try to adjust next time; this improves performance
			this.zoomPoint = null;
		}

		// now after adjustment, update pan
		this._centerSpringX.update();
		this._centerSpringY.update();

		return this._centerSpringX.getCurrent() != oldCenterX ||
                this._centerSpringY.getCurrent() != oldCenterY ||
                this._zoomSpring.getCurrent() != oldZoom;
	},

	// Methods -- CONVERSION HELPERS

	deltaPixelsFromPoints: function(deltaPoints, current) {
		return deltaPoints.times(this._containerSize.x * this.getZoom(current));
	},

	deltaPointsFromPixels: function(deltaPixels, current) {
		return deltaPixels.divide(this._containerSize.x * this.getZoom(current));
	},

	pixelFromPoint: function(point, current) {
		var bounds = this.getBounds(current);
		return point.minus(bounds.getTopLeft()).times(this._containerSize.x / bounds.width);
	},

	pointFromPixel: function(pixel, current) {
		var bounds = this.getBounds(current);
		return pixel.divide(this._containerSize.x / bounds.width).plus(bounds.getTopLeft());
	}
};
Sys.Extended.UI.Seadragon.Viewport.registerClass('Sys.Extended.UI.Seadragon.Viewport', null, Sys.IDisposable);

