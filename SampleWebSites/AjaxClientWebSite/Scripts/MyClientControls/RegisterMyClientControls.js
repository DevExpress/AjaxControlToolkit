Sys.loader.defineScripts({
    releaseUrl: "%/../MyClientControls/" + "{0}.js",
    debugUrl: "%/../MyClientControls/" + "{0}.js"
},
    [
        { name: "ImageView",
            executionDependencies: ["Templates"],
            behaviors: ["My.Controls.ImageView"],
            isLoaded: !!(window.My && My.Controls && My.Controls.ImageView)
        }
    ]
);

