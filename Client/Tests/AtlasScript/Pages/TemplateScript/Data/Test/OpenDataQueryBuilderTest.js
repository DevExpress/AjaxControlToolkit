Type.registerNamespace("Sys.Data.Test");

Sys.Data.Test.OpenDataQueryBuilderTest = function() {
    this.compareObjects = function(expectedObject, actualObject, msg) {
        for (var p in expectedObject) {
            var expected = expectedObject[p], actual = actualObject[p];
            if (typeof (expected) === "object") {
                for (var expectedv in expected) {
                    var ex = expected[expectedv], ac = actual[expectedv];
                    AtlasUnit.Assert.areEqual(typeof (ex), typeof (ac), "Field '" + p + "." + expectedv + "' not of the correct type." + (msg ? (" " + msg) : ""));
                    if (typeof (ex) === "object") {
                        for (var v in ex) {
                            var exv = ex[v], acv = ac[v];
                            AtlasUnit.Assert.areEqual(exv, acv, "Field '" + p + "." + expectedv + "." + v + " ' does not match." + (msg ? (" " + msg) : ""));
                        }
                    }
                    else {
                        AtlasUnit.Assert.areEqual(expectedex, ac, "Field '" + p + "." + expectedv + "' does not match." + (msg ? (" " + msg) : ""));
                    }
                }
            }
            else {
                AtlasUnit.Assert.areEqual(expected, actual, "Field  '" + p + "' does not match." + (msg ? (" " + msg) : ""));
            }
        }
    }
    
    this.verifyParameters = function(expectedParams, actualParams, msg) {
        this.compareObjects(expectedParams, actualParams, msg+"");
        this.compareObjects(actualParams, expectedParams, "REVERSE: " + (msg+""));
    }
    
    this.testNoExistingParams = function() {
        var q = new Sys.Data.OpenDataQueryBuilder("uri");
        AtlasUnit.Assert.areEqual("uri", q.get_resourcePath());
        this.verifyParameters({}, q.get_queryParameters());
    }
    
    this.testExistingParams = function() {
        var q = new Sys.Data.OpenDataQueryBuilder("uri?a=b&c=d");
        AtlasUnit.Assert.areEqual("uri", q.get_resourcePath());
        this.verifyParameters({a:'b',c:'d'}, q.get_queryParameters());
    }

    this.testSetParams = function() {
        var q = new Sys.Data.OpenDataQueryBuilder("uri");
        q.set_queryParameters({a:'b',c:'d'});
        q.set_orderby("foo");
        this.verifyParameters({a:'b',c:'d','$orderby':'foo'}, q.get_queryParameters());
    }

    this.testOrderBy = function() {
        var q = new Sys.Data.OpenDataQueryBuilder("uri");
        q.set_orderby("foo");
        this.verifyParameters({'$orderby':'foo'}, q.get_queryParameters());
    }
    
    this.testSkip = function() {
        var q = new Sys.Data.OpenDataQueryBuilder("uri");
        q.set_skip(5);
        this.verifyParameters({'$skip':5}, q.get_queryParameters());
    }
    
    this.testTop = function() {
        var q = new Sys.Data.OpenDataQueryBuilder("uri");
        q.set_top(8);
        this.verifyParameters({'$top':8}, q.get_queryParameters());
    }

    this.testFilter = function() {
        var q = new Sys.Data.OpenDataQueryBuilder("uri");
        q.set_filter("foo");
        this.verifyParameters({'$filter':'foo'}, q.get_queryParameters());
    }
    
    this.testExpand = function() {
        var q = new Sys.Data.OpenDataQueryBuilder("uri");
        q.set_expand("foo");
        this.verifyParameters({'$expand':'foo'}, q.get_queryParameters());
    }
}
Sys.Data.Test.OpenDataQueryBuilderTest.registerClass("Sys.Data.Test.OpenDataQueryBuilderTest");
Sys.Data.Test.OpenDataQueryBuilderTest["AtlasUnit.IsTestFixture"] = true;
