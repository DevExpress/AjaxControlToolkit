Sys.loader.defineScripts({
    debugUrl: "{0}.js",
    releaseUrl: "{0}.debug.js"
}, [
    {   name: "a",
        releaseUrl: "a.js",
        debugUrl: "a.debug.js",
        components: ["Sys.Foo", "Sys.Bar", { name: "BAZ", typeName: "Sys.Baz" }],
        behaviors: [{ name: "fooBehavior", typeName:"Sys.FooBehavior", parameters: [{name:"someNum", type:"Number", description: "Just any number"}] }]
    },
    {   name: "b"
    }   
]);

