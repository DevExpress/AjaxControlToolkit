// (c) 2010 CodePlex Foundation
Type.registerNamespace('Sys.Extended.UI.Seadragon');
Type.registerNamespace('Seadragon');
Sys.Extended.UI.Seadragon.Config = function() {

    this.debugMode = true;

    this.animationTime = 1.5;

    this.blendTime = 0.5;

    this.alwaysBlend = false;

    this.autoHideControls = true;

    this.immediateRender = false;

    this.wrapHorizontal = false;

    this.wrapVertical = false;

    this.minZoomDimension = 0.8;

    this.maxZoomPixelRatio = 2;

    this.visibilityRatio = 0.5;

    this.springStiffness = 5.0;

    this.imageLoaderLimit = 2;

    this.clickTimeThreshold = 200;

    this.clickDistThreshold = 5;

    this.zoomPerClick = 2.0;

    this.zoomPerSecond = 2.0;

    this.showNavigationControl = true;

    this.maxImageCacheCount = 100;

    this.minPixelRatio = 0.5;

    this.mouseNavEnabled = true;

    this.navImages = {
        zoomIn: {
            REST: '<%= WebResource("Seadragon.images.zoomin_rest.png") %>',
            GROUP: '<%= WebResource("Seadragon.images.zoomin_grouphover.png") %>',
            HOVER: '<%= WebResource("Seadragon.images.zoomin_hover.png") %>',
            DOWN: '<%= WebResource("Seadragon.images.zoomin_pressed.png") %>'
        },
        zoomOut: {
            REST: '<%= WebResource("Seadragon.images.zoomout_rest.png") %>',
            GROUP: '<%= WebResource("Seadragon.images.zoomout_grouphover.png") %>',
            HOVER: '<%= WebResource("Seadragon.images.zoomout_hover.png") %>',
            DOWN: '<%= WebResource("Seadragon.images.zoomout_pressed.png") %>'
        },
        home: {
            REST: '<%= WebResource("Seadragon.images.home_rest.png") %>',
            GROUP: '<%= WebResource("Seadragon.images.home_grouphover.png") %>',
            HOVER: '<%= WebResource("Seadragon.images.home_hover.png") %>',
            DOWN: '<%= WebResource("Seadragon.images.home_pressed.png") %>'
        },
        fullpage: {
            REST: '<%= WebResource("Seadragon.images.fullpage_rest.png") %>',
            GROUP: '<%= WebResource("Seadragon.images.fullpage_grouphover.png") %>',
            HOVER: '<%= WebResource("Seadragon.images.fullpage_hover.png") %>',
            DOWN: '<%= WebResource("Seadragon.images.fullpage_pressed.png") %>'
        }
    }
}
Sys.Extended.UI.Seadragon.Config.registerClass('Sys.Extended.UI.Seadragon.Config', null, Sys.IDisposable);
