Type.registerNamespace("Sys.UI.Test");

Sys.UI.Test.DataViewTest = function() {
    var dv, helper = new Sys.Data.Test.MockRequestHelper();
    this.setUp = function() {
        this._element = document.createElement('div');
        this._element.className = "sys-template";
        this._element.id = "div1";
        this._dv = dv = new Sys.UI.DataView(this._element);
        this._helper = Sys.UI.Test.TemplateHelper;
        aborted = false;
        helper.setUp();
        Sys.Application._context = new Sys.UI.TemplateContext();
        Sys.Application._context._global = true;
    }

    this.tearDown = function() {
        helper.tearDown();
    }

    this.verifyChangeSet = function(expectedOp, expectedItem, change) {
        AtlasUnit.Assert.areEqual(expectedOp, change.action);
        var p, item = change.item;
        for (p in expectedItem) {
            AtlasUnit.Assert.areEqual(expectedItem[p], item[p], "Field '" + p + "' on change item does not match expected value.");
        }
        for (p in item) {
            if (p !== "_observerContext") {
                AtlasUnit.Assert.areEqual(expectedItem[p], item[p], "Field '" + p + "' on change item does not match expected value.");
            }
        }
    }

    this.testConstructor = function() {
        var element = document.createElement('div');
        var dv = new Sys.UI.DataView(element);
        AtlasUnit.Assert.areEqual(element, dv.get_element());
    }

    this.testDataProperty = function() {
        AtlasUnit.Assert.isNull(this._dv.get_data());
        var data = {};
        this._dv.set_data(data);
        AtlasUnit.Assert.areEqual(data, this._dv.get_data());
        this._dv.set_data(null);
        AtlasUnit.Assert.isNull(this._dv.get_data());
    }

    this.testTemplateProperty = function() {
        AtlasUnit.Assert.isNull(this._dv.get_itemTemplate(), "Should be null initially.");
        var template = document.createElement('div');
        this._dv.set_itemTemplate(template);
        AtlasUnit.Assert.areEqual(template, this._dv.get_itemTemplate(), "Unable to set element.");
        this._dv.set_itemTemplate("id");
        AtlasUnit.Assert.areEqual("id", this._dv.get_itemTemplate(), "Unable to set ID");
        template = new Sys.UI.Template(template);
        this._dv.set_itemTemplate(template);
        AtlasUnit.Assert.areEqual(template, this._dv.get_itemTemplate(), "Unable to set Sys.UI.Template");
        this._dv.set_itemTemplate(null);
        AtlasUnit.Assert.isNull(this._dv.get_itemTemplate(), "Unable to set null.");
    }

    this.testItemPlaceholderProperty = function() {
        AtlasUnit.Assert.isNull(this._dv.get_itemPlaceholder());
        var div = document.createElement("div");
        this._dv.set_itemPlaceholder(div);
        AtlasUnit.Assert.areEqual(div, this._dv.get_itemPlaceholder(), "Unable to set DOM Element");
        this._dv.set_itemPlaceholder("id");
        AtlasUnit.Assert.areEqual("id", this._dv.get_itemPlaceholder(), "Unable to set string ID.");
        this._dv.set_itemPlaceholder(null);
        AtlasUnit.Assert.isNull(this._dv.get_itemPlaceholder(), "Unable to set null.");
    }

    this.testItemPlaceholderPropertyInvalidType = function() {
        this._dv.set_data(null);
        this._dv.set_itemPlaceholder({});
        this._dv.refresh();
    }
    this.testItemPlaceholderPropertyInvalidType["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testItemPlaceholderPropertyInvalidType["AtlasUnit.ExpectedException"] = {
        message: "Sys.InvalidOperationException: 'itemPlaceholder' must be a DOM element or DOM element selector."
    }

    this.testTemplatePropertyInvalidType = function() {
        this._dv.set_data(null);
        this._dv.set_itemTemplate({});
        this._dv.refresh();
    }
    this.testTemplatePropertyInvalidType["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testTemplatePropertyInvalidType["AtlasUnit.ExpectedException"] = {
        message: "Sys.InvalidOperationException: 'itemTemplate' must be a DOM element or DOM element selector."
    }

    this.testTemplateContextProperty = function() {
        AtlasUnit.Assert.areEqual(Sys.Application.get_templateContext(), this._dv.get_templateContext());
        var obj = new Sys.UI.TemplateContext();
        this._dv.set_templateContext(obj);
        AtlasUnit.Assert.areEqual(obj, this._dv.get_templateContext());
    }

    this.testTemplateAndPlaceholderDefault = function() {
        this._element.innerHTML = "{{$dataItem}}";
        this._element.className = "sys-template";
        this._dv.set_data(1);
        this._dv.initialize();
        this._helper.verifyHTML(this._element, "1");
    }

    this.testTemplateAndPlaceholderExternalTemplate = function() {
        var div = document.createElement("div");
        div.innerHTML = "{{$dataItem}}";
        this._dv.set_itemTemplate(div);
        this._dv.set_data(1);
        this._dv.initialize();
        this._helper.verifyHTML(this._element, "1");
    }

    this.testRenderExternalTemplateNoPlaceholder = function() {
        var div = document.createElement("div");
        div.innerHTML = "<span>{{ item }}</span>";
        this._dv.set_itemTemplate(div);
        this._dv.set_data([{ item: 1 }, { item: 2 }, { item: 3}]);
        this._dv.initialize();
        this._helper.verifyHTML(this._element, "<span>1</span><span>2</span><span>3</span>");
        this._dv.refresh();
        this._helper.verifyHTML(this._element, "<span>1</span><span>2</span><span>3</span>");
    }

    this.testRenderExternalTemplateWithPlaceholder = function() {
        var div = document.createElement("div");
        div.innerHTML = "<span>{{ item }}</span>";
        this._dv.set_itemTemplate(div);
        this._element.innerHTML = "header<div id='placeholder1'>initialstuff</div>footer";
        this._dv.set_itemPlaceholder(Sys.UI.DomElement.getElementById('placeholder1', this._element));
        this._dv.set_data([{ item: 1 }, { item: 2 }, { item: 3}]);
        this._dv.initialize();
        this._helper.verifyHTML(this._element, "header<span>1</span><span>2</span><span>3</span><div style='display:none' id='placeholder1'>initialstuff</div>footer");
        Sys.Observer.add(this._dv.get_data(), { item: 4 });
        this._dv.refresh();
        this._helper.verifyHTML(this._element, "header<span>1</span><span>2</span><span>3</span><span>4</span><div style='display:none' id='placeholder1'>initialstuff</div>footer");
    }

    this.testRenderExternalTemplateWithPlaceholderFirst = function() {
        var div = document.createElement("div");
        div.innerHTML = "<span>{{ item }}</span>";
        this._dv.set_itemTemplate(div);
        this._element.innerHTML = "<div id='placeholder1'>initialstuff</div>footer";
        this._dv.set_itemPlaceholder(Sys.UI.DomElement.getElementById('placeholder1', this._element));
        this._dv.set_data([{ item: 1 }, { item: 2 }, { item: 3}]);
        this._dv.initialize();
        this._helper.verifyHTML(this._element, "<span>1</span><span>2</span><span>3</span><div style='display:none' id='placeholder1'>initialstuff</div>footer");
        Sys.Observer.add(this._dv.get_data(), { item: 4 });
        this._dv.refresh();
        this._helper.verifyHTML(this._element, "<span>1</span><span>2</span><span>3</span><span>4</span><div style='display:none' id='placeholder1'>initialstuff</div>footer");
    }

    this.testRenderExternalTemplateWithPlaceholderLast = function() {
        var div = document.createElement("div");
        div.innerHTML = "<span>{{ item }}</span>";
        this._dv.set_itemTemplate(div);
        this._element.innerHTML = "header<div id='placeholder1'>initialstuff</div>";
        this._dv.set_itemPlaceholder(Sys.UI.DomElement.getElementById('placeholder1', this._element));
        this._dv.set_data([{ item: 1 }, { item: 2 }, { item: 3}]);
        this._dv.initialize();
        this._helper.verifyHTML(this._element, "header<span>1</span><span>2</span><span>3</span><div id='placeholder1' style='display:none'>initialstuff</div>");
        Sys.Observer.add(this._dv.get_data(), { item: 4 });
        this._dv.refresh();
        this._helper.verifyHTML(this._element, "header<span>1</span><span>2</span><span>3</span><span>4</span><div id='placeholder1' style='display:none'>initialstuff</div>");
    }

    this.testRenderInlineTemplate = function() {
        this._element.innerHTML = "header<div id='template1' class='sys-template'><span>{{ item }}</span></div>footer";
        this._dv.set_itemTemplate(Sys.UI.DomElement.getElementById('template1', this._element));
        this._dv.set_data([{ item: 1 }, { item: 2 }, { item: 3}]);
        this._dv.initialize();
    }
    this.testRenderInlineTemplate["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testRenderInlineTemplate["AtlasUnit.ExpectedException"] = {
        message: "Sys.InvalidOperationException: DataView item template must not be a child element of the DataView."
    }

    this.testNoRenderUntilDataAssigned = function() {
        this._element.innerHTML = "<div id='dataviewcontent'></div>";
        this._element.className = "sys-template";
        this._dv.initialize();
        var e = Sys.UI.DomElement.getElementById('dataviewcontent', this._element);
        AtlasUnit.Assert.isTrue(!!e);
        this._dv.set_data(null);
        e = Sys.UI.DomElement.getElementById('dataviewcontent', this._element);
        AtlasUnit.Assert.isFalse(!!e);
    }

    this.testDirtyWhileUpdatingCausesRender = function() {
        var div = document.createElement("div");
        div.innerHTML = "<span>{{ item }}</span>";
        this._dv.set_itemTemplate(div);
        this._dv.set_data([{ item: 1 }, { item: 2 }, { item: 3}]);
        this._dv.initialize();
        this._helper.verifyHTML(this._element, "<span>1</span><span>2</span><span>3</span>");
        this._dv.beginUpdate();
        this._dv.set_data([{ item: 4 }, { item: 5}]);
        this._helper.verifyHTML(this._element, "<span>1</span><span>2</span><span>3</span>");
        this._dv.endUpdate();
        this._helper.verifyHTML(this._element, "<span>4</span><span>5</span>");
    }

    this.testNoTemplateDoesNotRender = function() {
        this._element.innerHTML = "abc";
        this._element.className = "";
        this._dv.set_data([1, 2, 3]);
        this._dv.initialize();
        this._helper.verifyHTML(this._element, "");
        AtlasUnit.Assert.areEqual(3, this._dv.get_contexts().length, "No template should still create contexts that are empty.");
        AtlasUnit.Assert.isNotNull(this._dv.get_contexts()[0].dataItem);
        AtlasUnit.Assert.isNotNull(this._dv.get_contexts()[1].dataItem);
        AtlasUnit.Assert.isNotNull(this._dv.get_contexts()[2].dataItem);
        var div = document.createElement("div");
        div.innerHTML = "<span>{{ $dataItem }}</span>";
        this._dv.set_itemTemplate(div);
        this._helper.verifyHTML(this._element, "<span>1</span><span>2</span><span>3</span>");
    }

    this.testFindContext = function() {
        var div = document.createElement("div");
        div.innerHTML = "<table><tbody class='sys-template'><tr><td><span>{{ item }}</span></td></tr></tbody></table>";
        var tbody = div.getElementsByTagName("tbody")[0];
        var dv = new Sys.UI.DataView(tbody);
        dv.set_data([{ item: 1 }, { item: 2 }, { item: 3}]);
        dv.initialize();
        this._helper.verifyHTML(div, "<table><tbody class=''><tr><td><span>1</span></td></tr><tr><td><span>2</span></td></tr><tr><td><span>3</span></td></tr></tbody></table>");
        var spans = tbody.getElementsByTagName("span");
        var item1 = dv.findContext(spans[0]),
            item2 = dv.findContext(spans[1]),
            item3 = dv.findContext(spans[2]);
        AtlasUnit.Assert.isNotNull(item1, "item1");
        AtlasUnit.Assert.isNotNull(item2, "item2");
        AtlasUnit.Assert.isNotNull(item3, "item3");
        AtlasUnit.Assert.areEqual(0, item1.index);
        AtlasUnit.Assert.areEqual(1, item2.index);
        AtlasUnit.Assert.areEqual(2, item3.index);
    }

    this.testPropertyChanged = function() {
        var sender = null, args, changed = [];
        function onChanged(s, a) {
            sender = s;
            args = a;
            changed.push(a.get_propertyName());
        }
        this._dv.add_propertyChanged(onChanged);
        this._dv.initialize();
        this._dv.set_data("hi");
        AtlasUnit.Assert.areEqual(this._dv, sender, "propertyChanged event didn't fire.");
        AtlasUnit.Assert.isTrue(Array.contains(changed, ("data")), "data");
        sender = null;
        this._dv.set_data("hi");
        AtlasUnit.Assert.isNull(sender);

        var e = document.createElement("div");
        this._dv.set_itemTemplate(e);
        AtlasUnit.Assert.areEqual(this._dv, sender);
        AtlasUnit.Assert.isTrue(Array.contains(changed, "itemTemplate"), "itemTemplate");
        sender = null;
        this._dv.set_itemTemplate(e);
        AtlasUnit.Assert.isNull(sender);

        this._dv.set_itemPlaceholder(e);
        AtlasUnit.Assert.areEqual(this._dv, sender);
        AtlasUnit.Assert.isTrue(Array.contains(changed, "itemPlaceholder"), "itemPlaceholder");
        sender = null;
        this._dv.set_itemPlaceholder(e);
        AtlasUnit.Assert.isNull(sender);
    }

    this.testPropertyChangedWhileUpdating = function() {
        var sender = null, args;
        function onChanged(s, a) {
            sender = s;
            args = a;
        }
        this._dv.add_propertyChanged(onChanged);
        this._dv.initialize();
        this._dv.beginUpdate();
        this._dv.set_data("hi");
        if (!sender) {
            AtlasUnit.Assert.areNotEqual("data", args);
        }
        this._dv.endUpdate();
        AtlasUnit.Assert.areEqual(this._dv, sender);
        AtlasUnit.Assert.areEqual("", args.get_propertyName());
    }

    this.testNestedDataViews = function() {
        this._helper.clearNamespaces();
        document.body.setAttribute("xmlns:dv", "javascript:Sys.UI.DataView");
        this._element.innerHTML = "<ol class='sys-template'><li>{{ data }}, {{ $index }}, {{ $id('id') }}<br/><ol sys:attach='dv' class='sys-template' dv:data='{{subData}}'><li>parent:{{ $context.parentContext.dataItem.data }}, {{ $context.parentContext.index}}, {{ $context.parentContext.getInstanceId('id') }}<br/>{{ data }}, {{ $index }}, {{ $id('id') }}</li></ol><br/></li></ol>";
        var dv = new Sys.UI.DataView(this._element.childNodes[0]);
        dv.set_data([
            { data: 'item1', subData: [{ data: 'sub1' }, { data: 'sub2' }, { data: 'sub3'}] },
            { data: 'item2', subData: [{ data: 'sub4' }, { data: 'sub5' }, { data: 'sub6'}] },
            { data: 'item3', subData: [{ data: 'sub7' }, { data: 'sub8' }, { data: 'sub9'}] }
        ]);
        dv.initialize();
        this._element.innerHTML = this._element.innerHTML; // strips unnecessary text nodes for easier verification
        this._helper.verifyHTML(this._element, '<ol class=""><li>item1, 0, id0<br/><ol class=""><li>parent:item1, 0, id0<br>sub1, 0, id0_0</li><li>parent:item1, 0, id0<br>sub2, 1, id0_1</li><li>parent:item1, 0, id0<br>sub3, 2, id0_2</li></ol><br/></li><li>item2, 1, id1<br/><ol class=""><li>parent:item2, 1, id1<br>sub4, 0, id1_0</li><li>parent:item2, 1, id1<br>sub5, 1, id1_1</li><li>parent:item2, 1, id1<br>sub6, 2, id1_2</li></ol><br/></li><li>item3, 2, id2<br/><ol class=""><li>parent:item3, 2, id2<br>sub7, 0, id2_0</li><li>parent:item3, 2, id2<br>sub8, 1, id2_1</li><li>parent:item3, 2, id2<br>sub9, 2, id2_2</li></ol><br/></li></ol>');
    }

    this.testDataViewOnSelectWithValueBinding = function() {
        this._helper.clearNamespaces();
        document.body.setAttribute("xmlns:dv", "javascript:Sys.UI.DataView");
        this._element.innerHTML = "<select class='sys-template' sys:value='{binding currentValue,source={{Sys.UI.Test.DataViewTest}}}'><option sys:value='{{value}}'>{{value}}</option></select>";
        var root = this._element.childNodes[0];
        Sys.UI.Test.DataViewTest.currentValue = "val2";
        var dv = new Sys.UI.DataView(root);
        var tc = Sys.query(root).activateElements();
        dv.set_data([{value:'val1'}, {value:'val2'}, {value:'val3'}]);
        dv.initialize();
        AtlasUnit.Assert.areEqual("val2", root.value, "Initial value was not set after options were created.");
        dv.refresh();
        AtlasUnit.Assert.areEqual("val2", root.value, "Value should be set again after a refresh.");
        Sys.Observer.setValue(Sys.UI.Test.DataViewTest, "currentValue", "optNew");
        AtlasUnit.Assert.isTrue(/|val2/.test(root.value), "No option with that value.");
        dv.set_data([{value:'optNew'}]);
        AtlasUnit.Assert.areEqual("optNew", root.value, "Value should be set again after new data renders.");
    }

    this.testCollectionChangedCausesRender = function() {
        var col = Sys.Observer.makeObservable([1, 2, 3]);
        this._element.innerHTML = "<span>{{$dataItem}}</span>";
        this._dv.set_data(col);
        this._dv.initialize();
        this._helper.verifyHTML(this._element, "<span>1</span><span>2</span><span>3</span>");
        col.remove(2);
        this._helper.verifyHTML(this._element, "<span>1</span><span>3</span>");
        var removed = false;
        col.remove_collectionChanged = function() {
            removed = true;
        }
        // try unobserved array
        var arr = [4, 5, 6];
        this._dv.set_data(arr);
        AtlasUnit.Assert.isTrue(removed, "Changing the data property should cause the DataView to unhook from the changed event.");
        this._helper.verifyHTML(this._element, "<span>4</span><span>5</span><span>6</span>");
        arr[arr.length] = 7;
        // added to the array directly, dataview cant know about the change
        this._helper.verifyHTML(this._element, "<span>4</span><span>5</span><span>6</span>");
        Sys.Observer.add(arr, 8);
        this._helper.verifyHTML(this._element, "<span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>");
    }

    this.testDataViewOnElements = function() {
        // try simple rendering of a dataview over some common elements
        function beginTag(tag, attributes) {
            var s = "<" + tag;
            if (attributes) s += " " + attributes;
            s += ">";
            return s;
        }
        function endTag(tag) {
            return "</" + tag + ">";
        }
        var data1 = { data: "data1" },
            data2 = { data: "data2" },
        // Test cases are as follows: [element the DV is attached to, child element of the template repeated for each item, additional html wrapped around dataview to give it full context, format of the {{ data }} reference inserted into the template]
        // e.g. ["tbody", "tr", "table", "<td>{0}</td>"] === <table><tbody id='target' class='sys-template'><tr><td>{0}</td></tr></tbody></table>
            elements = [["div", "span"], ["ol", "li"], ["ul", "li"], ["table", "tr", null, "<td>{0}</td>"], ["tbody", "tr", "table", "<td>{0}</td>"], ["thead", "tr", "table", "<th>{0}</th>"], ["tr", "td", "table"]];
        for (var i = 0; i < elements.length; i++) {
            var entry = elements[i], element = entry[0], childElement = entry[1], wrapWith = entry[2], dataFormat = (entry[3] || "{0}");
            var html = "";
            if (wrapWith) html += beginTag(wrapWith);
            html += beginTag(element, "id='target' class='sys-template'") +
                    beginTag(childElement) + String.format(dataFormat, "{{data}}") +
                    endTag(childElement) + endTag(element);
            if (wrapWith) html += endTag(wrapWith);
            var container = document.createElement('div');
            container.innerHTML = html;
            var target = Sys.UI.DomElement.getElementById('target', container);
            var dv = new Sys.UI.DataView(target);
            dv.set_data(data1);
            dv.initialize();
            html = container.innerHTML, desc = "test #" + i + ": html: " + container.innerHTML;
            AtlasUnit.Assert.areNotEqual(-1, html.indexOf('data1'), desc);
            AtlasUnit.Assert.areEqual(-1, html.indexOf('data2'), desc);
            dv.set_data(data2);
            html = container.innerHTML, desc = "test #" + i + ": html: " + container.innerHTML;
            AtlasUnit.Assert.areEqual(-1, html.indexOf('data1'), desc);
            AtlasUnit.Assert.areNotEqual(-1, html.indexOf('data2'), desc);
            dv.set_data(null);
            html = container.innerHTML, desc = "test #" + i + ": html: " + container.innerHTML;
            AtlasUnit.Assert.areEqual(-1, html.indexOf('data1'), desc);
            AtlasUnit.Assert.areEqual(-1, html.indexOf('data2'), desc);
        }
    }

    this.testDataProviderProperty = function() {
        var dp = this._dv.get_dataProvider();
        AtlasUnit.Assert.isNull(dp);
        // string
        this._dv.set_dataProvider("uri");
        AtlasUnit.Assert.areEqual("uri", this._dv.get_dataProvider());
        // datacontext
        dp = new Sys.Data.DataContext();
        this._dv.set_dataProvider(dp);
        AtlasUnit.Assert.areEqual(dp, this._dv.get_dataProvider());
        // wsp
        var wsp = new Sys.Net.WebServiceProxy();
        this._dv.set_dataProvider(wsp);
        AtlasUnit.Assert.areEqual(wsp, this._dv.get_dataProvider());
    }

    this.testDataProviderPropertyInvalidType = function() {
        this._dv.set_dataProvider({});
    }
    this.testDataProviderPropertyInvalidType["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testDataProviderPropertyInvalidType["AtlasUnit.ExpectedException"] = {
        message: "Sys.ArgumentException: Value must be a service URI, an instance of Sys.Net.WebServiceProxy, or class that implements Sys.Data.IDataProvider.\nParameter name: dataProvider"
    };

    this.testDataProviderProxy = function() {
        var wsp = new Sys.Net.WebServiceProxy();
        wsp.set_path("uri");
        wsp.set_timeout(8);
        this._dv.set_httpVerb("FOOMETHOD");
        this._dv.set_fetchOperation("query");
        var params = {};
        this._dv.set_fetchParameters(params);
        this._dv.set_dataProvider(wsp);
        this._dv.set_autoFetch(false);
        this._dv.initialize();
        this._dv.fetchData();
        helper.verifyRequest({ uri: "uri", timeout: 8 });
    }

    this.testDataProviderStaticProxy = function() {
        var wspc = Sys.UI.Test.DataViewTest.CustomProxy;
        this._dv.set_httpVerb("FOOMETHOD");
        this._dv.set_fetchOperation("query");
        var params = {};
        this._dv.set_fetchParameters(params);
        this._dv.set_dataProvider(wspc);
        this._dv.set_autoFetch(false);
        this._dv.initialize();
        this._dv.fetchData();
        helper.verifyRequest({ uri: "staticpath", timeout: 88 });
    }

    this.testDataProviderCustom = function() {
        var custom = new Sys.UI.Test.DataViewTest.CustomProvider();
        this._dv.set_timeout(8);
        this._dv.set_httpVerb("FOOMETHOD");
        this._dv.set_fetchOperation("query");
        var params = {};
        this._dv.set_fetchParameters(params);
        this._dv.set_dataProvider(custom);
        this._dv.set_autoFetch(false);
        this._dv.initialize();
        var context = {};
        this._dv.fetchData(null, null, Sys.Data.MergeOption.overwriteChanges, context);
        AtlasUnit.Assert.areEqual("query", custom.query);
        AtlasUnit.Assert.areEqual(params, custom.parameters);
        AtlasUnit.Assert.areEqual(Sys.Data.MergeOption.overwriteChanges, custom.mergeOption);
        AtlasUnit.Assert.areEqual("FOOMETHOD", custom.httpVerb);
        AtlasUnit.Assert.areEqual(8, custom.timeout);
        AtlasUnit.Assert.areEqual(context, custom.userContext);
    }

    this.testRenderingRenderedEvent = function() {
        var dv = this._dv;
        var sender1 = null, args1 = null;
        var sender2 = null, args2 = null;
        var onRendering = false, onRendered = false;
        dv.add_rendering(function(s, a) {
            sender1 = s;
            args1 = a;
        });
        dv.add_rendered(function(s, a) {
            sender2 = s;
            args2 = a;
        });
        dv.onRendering = function() { onRendering = true; }
        dv.onRendered = function() { onRendered = true; }
        dv.initialize();
        var data = [];
        dv.set_data(data);
        AtlasUnit.Assert.areEqual(sender1, dv);
        AtlasUnit.Assert.areEqual(Sys.UI.DataViewEventArgs, Object.getType(args1));
        AtlasUnit.Assert.areEqual(sender2, dv);
        AtlasUnit.Assert.areEqual(Sys.UI.DataViewEventArgs, Object.getType(args2));
        AtlasUnit.Assert.areEqual(data, dv.get_viewData());
        AtlasUnit.Assert.isTrue(onRendering, "onRendering should be called.");
        AtlasUnit.Assert.isTrue(onRendered, "onRendered should be called");
    }

    this.testRenderingCancel = function() {
        var data1 = [], data2 = [];
        data1.toString = function() { return "data1"; }
        data2.toString = function() { return "data2"; }
        this._dv.set_data(data1);
        this._dv.initialize();
        this._dv.add_rendering(function(s, a) {
            a.set_cancel(true);
        });
        this._dv.add_rendered(function() {
            AtlasUnit.fail("Rendered event should not fire.");
        });
        this._dv.set_data(data2);
        AtlasUnit.Assert.areEqual(data2, this._dv.get_data());
        AtlasUnit.Assert.areEqual(data1, this._dv.get_viewData());
    }

    this.testRenderingChangeData = function() {
        var data1 = [], data2 = [];
        data1.toString = function() { return "data1"; }
        data2.toString = function() { return "data2"; }
        this._dv.initialize();
        this._dv.add_rendering(function(s, a) {
            a.data = data2;
        });
        this._dv.add_rendered(function(s, a) {
            AtlasUnit.Assert.areEqual(data2, a.data);
        });
        this._dv.set_data(data1);
        AtlasUnit.Assert.areEqual(data1, this._dv.get_data());
        AtlasUnit.Assert.areEqual(data2, this._dv.get_viewData());
    }
    
    this.testRenderingChangeTemplate = function() {
        var data1 = [88];
        this._dv.initialize();
        var t1 = document.createElement("div");
        t1.innerHTML = "<b>{{$dataItem}}</b>";
        var t2 = document.createElement("div");
        t2.innerHTML = "<i>{{$dataItem}}</i>";
        this._dv.set_itemTemplate(t1);
        this._dv.add_rendering(function(s, a) {
            AtlasUnit.Assert.areEqual(t1, a.itemTemplate.get_element(), "Value should default to the DataView itemTemplate.");
            a.itemTemplate = t2;
        });
        this._dv.add_rendered(function(s, a) {
            AtlasUnit.Assert.areEqual(t2, a.itemTemplate);
        });
        this._dv.set_data([88]);
        this._helper.verifyHTML(this._element, "<i>88</i>");
    }    
    
    this.testRenderingChangePlaceholder = function() {
        this._dv.initialize();
        this._element.innerHTML = "<div><span id='p0'></span></div>";
        this._element.childNodes[0].appendChild(document.createComment("commentend"));
        this._element.childNodes[0].appendChild(document.createTextNode("\r\n\t\f    "));
        this._element.childNodes[0].insertBefore(document.createTextNode("\r\n\t\f    "), this._element.childNodes[0].firstChild);
        this._element.childNodes[0].insertBefore(document.createComment("commentstart"), this._element.childNodes[0].firstChild);
        // must build that DOM manually because IE ignores whitespace textnodes and comments when using innerHTML
        // <div><!--commentstart-->	    <span id=p0></span><!--commentend-->	    </div>
        var container = document.createElement("div");
        container.innerHTML = "[<div id='p1'></div>|<div id='p2'></div>]";
        var p0 = Sys.UI.DomElement.getElementById('p0', this._element);
        var p1 = Sys.UI.DomElement.getElementById('p1', container);
        var p2 = Sys.UI.DomElement.getElementById('p2', container);
        var t = document.createElement("div");
        t.innerHTML = "<i>{{text}}</i>";
        this._dv.set_itemTemplate(t);
        this._dv.set_itemPlaceholder(p0);
        
        this._dv.add_itemRendering(function(s, a) {
            var data = a.data;
            a.itemPlaceholder = [p0,p1,p2][data.place];
        });
        this._dv.set_data([
            {text:'text1', place:1},
            {text:'text2', place:2},
            {text:'text3', place:0},
            {text:'text4', place:1}
        ]);
        // each item is distributed into different placeholders in different containers
        this._helper.verifyHTML(container, "[<i>text1</i><i>text4</i><div style='display:none' id='p1'></div>|<i>text2</i><div style='display:none' id='p2'></div>]");
        this._helper.verifyHTML(this._element, "<div><i>text3</i><span style='display:none' id='p0'></span></div>");
        // the p0 placeholder is 'alone' in its parent node, so it should be cleared out via innerHTML
        var placeholders = this._dv._placeholders;
        AtlasUnit.Assert.areEqual(p0, placeholders[2], "p0 is expected to be the 3rd placeholder that was encountered.");
        var disposed=false, removed=false, added=false;
        var realParent = p0.parentNode;
        var fakep0;
        var parentNode = {
            removeChild: function(c) {
                if (c === fakep0) {
                    p0.parentNode.removeChild(p0);
                    removed = true;
                }
            },
            appendChild: function(c) {
                if (c === fakep0) {
                    realParent.innerHTML = "";
                    realParent.appendChild(p0);
                    added = true;
                }
            },
            innerHTML: "notset"
        };
        fakep0 = placeholders[2] = {
            __msajaxphcount: p0.__msajaxphcount,
            parentNode: parentNode
        }
        Sys.Application.oldDispose = Sys.Application.disposeElement;
        try {
            Sys.Application.disposeElement = function(e, childrenOnly) {
                if (e === parentNode) {
                    AtlasUnit.Assert.areEqual(true, childrenOnly, "Should dispose of the containers children only.");
                    disposed = true;
                    Sys.Application.oldDispose(realParent, childrenOnly);
                }
                else {
                    Sys.Application.oldDispose(e, childrenOnly);
                }
            }
            this._dv.set_data([{text:'text1', place:0}]);
        }
        finally {
            Sys.Application.disposeElement = Sys.Application.oldDispose;
        }
        AtlasUnit.Assert.isTrue(disposed, "Old created elements should be disposed of.");
        AtlasUnit.Assert.isTrue(removed && added, "Placeholder should be temporarily removed then added back during clearing. Removed=" + removed + ", Added=" + added);
        AtlasUnit.Assert.areEqual("", parentNode.innerHTML, "innerHTML should be cleared.");
        
        // items are cleared out of their original placeholders
        this._helper.verifyHTML(container, "[<div style='display:none' id='p1'></div>|<div style='display:none' id='p2'></div>]");
        this._helper.verifyHTML(this._element, "<div><i>text1</i><span style='display:none' id='p0'></span></div>");
        this._dv.set_data(null);
        this._helper.verifyHTML(this._element, "<div><span style='display:none' id='p0'></span></div>");
        this._dv.dispose();
        AtlasUnit.Assert.isNull(this._dv._containers, "Rendered containers should be ref released.");
        AtlasUnit.Assert.isNull(this._dv._placeholders, "Rendered placeholders should be ref released.");
    }        

    this.testAutoFetchProperty = function() {
        AtlasUnit.Assert.isFalse(this._dv.get_autoFetch());
        this._dv.set_autoFetch(true);
        AtlasUnit.Assert.isTrue(this._dv.get_autoFetch());
        this._dv.set_autoFetch("false");
        AtlasUnit.Assert.isFalse(this._dv.get_autoFetch());
        this._dv.set_autoFetch("true");
        AtlasUnit.Assert.isTrue(this._dv.get_autoFetch());
    }

    this.testHttpVerbProperty = function() {
        AtlasUnit.Assert.areEqual("POST", this._dv.get_httpVerb());
        this._dv.set_httpVerb("GET");
        AtlasUnit.Assert.areEqual("GET", this._dv.get_httpVerb());
    }

    this.testFetchParametersProperty = function() {
        AtlasUnit.Assert.isNull(this._dv.get_fetchParameters());
        var params = { "foo": "bar" };
        this._dv.set_fetchParameters(params);
        AtlasUnit.Assert.areEqual(params, this._dv.get_fetchParameters());
        this._dv.set_fetchParameters(null);
    }

    this.testTimeoutProperty = function() {
        AtlasUnit.Assert.areEqual(0, this._dv.get_timeout());
        this._dv.set_timeout(88);
        AtlasUnit.Assert.areEqual(88, this._dv.get_timeout());
        this._dv.set_timeout(0);
        AtlasUnit.Assert.areEqual(0, this._dv.get_timeout());
    }

    this.testQueryProperty = function() {
        AtlasUnit.Assert.areEqual("", this._dv.get_fetchOperation());
        this._dv.set_fetchOperation("test");
        AtlasUnit.Assert.areEqual("test", this._dv.get_fetchOperation());
        this._dv.set_fetchOperation("");
        AtlasUnit.Assert.areEqual("", this._dv.get_fetchOperation());
    }

    this.testSelectedIndexProperty = function() {
        var dv = this._dv,
            data = [{ id: 1 }, { id: 2}];
        dv.set_initialSelectedIndex(1);
        dv.set_data(data);
        dv.initialize();
        AtlasUnit.Assert.areEqual(1, dv.get_selectedIndex(), "Initial index should be applied after init.");
        dv.set_selectedIndex(0);
        AtlasUnit.Assert.areEqual(0, dv.get_selectedIndex(), "Set index to 0.");
        dv.set_selectedIndex(-1);
        AtlasUnit.Assert.areEqual(-1, dv.get_selectedIndex(), "Set index to -1");
        data = Array.clone(data);
        dv.set_data(data);
        AtlasUnit.Assert.areEqual(1, dv.get_selectedIndex(), "Resetting data should revert to initialSelectedIndex.");
        dv.set_initialSelectedIndex(-1);
        data = Array.clone(data);
        dv.set_data(data);
        AtlasUnit.Assert.areEqual(-1, dv.get_selectedIndex(), "Resetting data should revert to initialSelectedIndex even after changing initialSelectedIndex.");
        dv.set_selectedIndex(1);
        Sys.Observer.insert(data, 0, { id: 3 });
        Sys.Observer.add(data, { id: 4 });
        AtlasUnit.Assert.areEqual(2, dv.get_selectedIndex(), "SelectedIndex should track the item when an item is inserted above it.");
        Sys.Observer.removeAt(data, 0);
        AtlasUnit.Assert.areEqual(1, dv.get_selectedIndex(), "SelectedIndex should track the item when an item is removed above it.");
        Sys.Observer.removeAt(data, 1);
        AtlasUnit.Assert.areEqual(-1, dv.get_selectedIndex(), "SelectedIndex should revert to -1 when the selected item is removed.");
        dv.set_initialSelectedIndex(10);
        dv.set_data(Array.clone(data));
        AtlasUnit.Assert.areEqual(-1, dv.get_selectedIndex(), "SelectedIndex should revert to -1 when the data resets but initialSelectedIndex is out of range.");
        dv.set_data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        AtlasUnit.Assert.areEqual(10, dv.get_selectedIndex());
    }

    this.testSelectCommand = function() {
        var dv = this._dv;
        var template = document.createElement("div");
        template.innerHTML = "<span>{{$dataItem}}</span>";
        dv.set_itemTemplate(template);
        dv.set_data([1,2,3]);
        dv.initialize();
        var span0 = dv.get_contexts()[0].nodes[0],
            span1 = dv.get_contexts()[1].nodes[0],
            span2 = dv.get_contexts()[2].nodes[0];
        var args = new Sys.CommandEventArgs("select", span1, null, null);
        dv.onBubbleEvent(span1, args);
        AtlasUnit.Assert.areEqual(1, dv.get_selectedIndex());
        dv.onBubbleEvent(span2, args);
        AtlasUnit.Assert.areEqual(2, dv.get_selectedIndex());
        dv.onBubbleEvent(span0, args);
        AtlasUnit.Assert.areEqual(0, dv.get_selectedIndex());
        // using command argument (int)
        args._commandArgument = 2;
        dv.onBubbleEvent(span0, args);
        AtlasUnit.Assert.areEqual(2, dv.get_selectedIndex());
        // using command argument (string)
        args._commandArgument = "1";
        dv.onBubbleEvent(span2, args);
        AtlasUnit.Assert.areEqual(1, dv.get_selectedIndex());
        // using command argument to 0
        args._commandArgument = 0;
        dv.onBubbleEvent(span2, args);
        AtlasUnit.Assert.areEqual(0, dv.get_selectedIndex());
        // using command argument to -1
        args._commandArgument = -1;
        dv.onBubbleEvent(span2, args);
        AtlasUnit.Assert.areEqual(-1, dv.get_selectedIndex());
        // using command source
        args._commandArgument = null;
        args._commandSource = span2;
        dv.onBubbleEvent(document.createElement('div'), args);
        AtlasUnit.Assert.areEqual(2, dv.get_selectedIndex());
    }

    this.testInitialSelectedIndexProperty = function() {
        AtlasUnit.Assert.areEqual(-1, this._dv.get_initialSelectedIndex());
        this._dv.set_initialSelectedIndex(0);
        AtlasUnit.Assert.areEqual(0, this._dv.get_initialSelectedIndex());
        this._dv.set_initialSelectedIndex(1000);
        AtlasUnit.Assert.areEqual(1000, this._dv.get_initialSelectedIndex());
        this._dv.set_initialSelectedIndex(-1);
        AtlasUnit.Assert.areEqual(-1, this._dv.get_initialSelectedIndex());
    }

    this.testSelectedDataProperty = function() {
        var dv = this._dv,
            data = [{ id: 1 }, { id: 2}];
        dv.set_data(data);
        dv.set_initialSelectedIndex(-1);
        var propertyName, selectedDataChanged;
        function changed(s, a) {
            propertyName = a.get_propertyName();
            selectedDataChanged = selectedDataChanged || (propertyName === "selectedData");
        }
        dv.add_propertyChanged(changed);
        dv.initialize();
        dv.set_selectedIndex(0);
        AtlasUnit.Assert.isTrue(selectedDataChanged, "index changed from -1 to 0.");
        selectedDataChanged = false;
        dv.set_selectedIndex(1);
        AtlasUnit.Assert.isTrue(selectedDataChanged, "index changed from 0 to 1.");
        selectedDataChanged = false;
        dv.set_selectedIndex(1);
        AtlasUnit.Assert.isFalse(selectedDataChanged, "index changed from 1 to 1, no real change.");
        dv.set_initialSelectedIndex(1);
        dv.set_data(dv.get_data());
        AtlasUnit.Assert.isFalse(selectedDataChanged, "data set to the same array.");
        var data2 = [data[0], data[1]]; // different array, same values
        dv.set_data(data2);
        AtlasUnit.Assert.isFalse(selectedDataChanged, "New data loaded but it has the same values, so selectedData didnt really change.");
        var data3 = [data[1], data[0]];
        dv.set_data(data3);
        AtlasUnit.Assert.isTrue(selectedDataChanged, "New data loaded and the item at index 1 is different, so selectedData should change.");
        selectedDataChanged = false;
        var data4 = [{}, {}];
        dv.set_data(data4);
        AtlasUnit.Assert.isTrue(selectedDataChanged, "New data loaded and the item at index 1 is different, so selectedData should change (again).");
        selectedDataChanged = false;
        dv.set_data([]);
        AtlasUnit.Assert.isTrue(selectedDataChanged, "New data loaded (empty).");
        selectedDataChanged = false;
        dv.set_data([]);
        AtlasUnit.Assert.isFalse(selectedDataChanged, "New data loaded (empty again).");
    }

    this.testSelectedIndexCached = function() {
        var dv = this._dv,
            data = [{ id: 1 }, { id: 2}];
        dv.set_selectedIndex(1);
        dv.set_data(data);
        dv.initialize();
        AtlasUnit.Assert.areEqual(1, dv.get_selectedIndex(), "Selected index should be applied after init.");
    }

    this.testSelectedIndexCachedOutOfRange = function() {
        var dv = this._dv,
            data = [{ id: 1 }, { id: 2}];
        dv.set_selectedIndex(10);
        dv.set_data(data);
        dv.initialize();
    }
    this.testSelectedIndexCachedOutOfRange["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testSelectedIndexCachedOutOfRange["AtlasUnit.ExpectedException"] = {
        message: "Sys.ArgumentOutOfRangeException: Specified argument was out of the range of valid values.\nParameter name: value\nActual value was 10."
    }

    this.testSelectedIndexWithSingletonObject = function() {
        var dv = this._dv,
            data = { id: 1 };
        dv.set_data(data);
        dv.initialize();
        dv.set_selectedIndex(0);
        AtlasUnit.Assert.areEqual(data, dv.get_data(), "get_data() should return a singleton object.");
        AtlasUnit.Assert.areEqual(0, dv.get_selectedIndex(), "Selected index is not applied correctly for singleton object.");
    }

    this.testAutoFetch = function() {
        dv.set_autoFetch(true);
        dv.set_dataProvider("foo.asmx");
        helper.verifyRequest(null, "Should not request before initialize.");
        dv.initialize();
        helper.verifyRequest({ uri: "foo.asmx", method: null }, "initialize should cause a Fetch.");
        dv.set_dataProvider("bar.asmx");
        helper.verifyRequest({ uri: "bar.asmx", method: null }, "Changing the uri should cause a Fetch.");
        dv.set_fetchOperation("bar");
        helper.verifyRequest({ uri: "bar.asmx", method: "bar" }, "Changing the query should cause a Fetch.");
        dv.beginUpdate();
        dv.set_dataProvider("delay.asmx");
        helper.verifyRequest(null, "No request should happen while updating.");
        dv.set_fetchOperation("delay");
        helper.verifyRequest(null, "No request should happen while updating.");
        dv.endUpdate();
        helper.verifyRequest({ uri: "delay.asmx", method: "delay" });
        dv.set_autoFetch(false);
        helper.verifyRequest(null, "No request should happen when setting autoFetch to false.");
        dv.set_autoFetch(true);
        helper.verifyRequest(null, "No request should happen because the data is not stale.");
        dv.set_autoFetch(false);
        dv.set_dataProvider("stale.asmx");
        helper.verifyRequest(null, "No request should happen because autoFetch is false.");
        dv.set_autoFetch(true);
        helper.verifyRequest({ uri: "stale.asmx" }, "Request should Fetch over the stale data after autoFetch set to true.");
    }

    this.testAutoFetchAlreadyHasData = function() {
        dv.set_autoFetch(true);
        dv.set_dataProvider("uri");
        dv.set_fetchOperation("query");
        dv.set_data("data");
        dv.initialize();
        helper.verifyRequest(null, "Even when autoFetch=true, when there is initialData, no Fetch should occur.");
    }

    this.testFetch = function() {
        dv.set_autoFetch(true);
        dv.set_dataProvider("hi");
        dv.set_fetchOperation("method");
        AtlasUnit.Assert.isFalse(dv.get_isFetching(), "Fetching should be false initially.");
        dv.initialize();
        var request = helper.verifyRequest({ uri: "hi" });
        AtlasUnit.Assert.isTrue(dv.get_isFetching(), "Fetching should be true before a response is received.");
        AtlasUnit.Assert.isNull(dv.get_data(), "No data should be Fetched yet.");
        request.succeededCallback("data", request.userContext);
        AtlasUnit.Assert.isFalse(dv.get_isFetching(), "Response was received, request should not be fetching.");
        AtlasUnit.Assert.areEqual("data", dv.get_data(), "Data should be fetched.");
    }

    this.testAbortFetch = function() {
        dv.set_dataProvider("hi");
        dv.set_fetchOperation("method");
        dv.set_data("foo");
        dv.initialize();
        function onSuccess() {
            AtlasUnit.Assert.fail("Request succeeded.");
        }
        var error = null, context = null, method = null;
        function onFail(err, ctx, m) {
            error = err;
            context = ctx;
            method = m;
        }
        dv.fetchData(onSuccess, onFail, null, 88);
        var request = helper.verifyRequest({});
        AtlasUnit.Assert.isTrue(dv.get_isFetching(), "Should be loading.");
        AtlasUnit.Assert.isNull(error, "Should not fail yet.");
        dv.abortFetch();
        request.failedCallback(new Sys.Net.WebServiceError(false, "aborted", null, null), request.userContext);
        AtlasUnit.Assert.isFalse(dv.get_isFetching(), "Aborted -- should not be loading.");
        AtlasUnit.Assert.isTrue(helper.isAborted(), "request.get_executor().abort() was not called.");
        AtlasUnit.Assert.areEqual("foo", dv.get_data(), "Data should not be changed after an abort.");
        AtlasUnit.Assert.isNotNull(error, "Aborting should fire the failed callback.");
        AtlasUnit.Assert.areEqual(88, context);
        AtlasUnit.Assert.areEqual("fetchData", method);
        dv.fetchData();
        AtlasUnit.Assert.isTrue(dv.get_isFetching(), "Load should cause loading.");
        dv.abortFetch();
        AtlasUnit.Assert.areEqual("foo", dv.get_data(), "Aborted, data should be unchanged.");
        request.failedCallback(null, request.userContext);
        AtlasUnit.Assert.areEqual("foo", dv.get_data(), "Data should not be loaded even if the request fails after it was aborted.");
    }

    this.testFetchRequestFailed = function() {
        dv.set_autoFetch(true);
        dv.set_dataProvider("hi");
        dv.set_fetchOperation("query");
        dv.initialize();
        var request = helper.verifyRequest({});
        var sender = null, args = null;
        dv.add_fetchFailed(function(s, a) {
            sender = s;
            args = a;
        });
        var e = new Sys.Net.WebServiceError(false, "message", null, null);
        request.failedCallback(e, request.userContext);
        AtlasUnit.Assert.isNotNull(sender, "RequestSucceeed event did not fire.");
        AtlasUnit.Assert.areEqual(e, args.get_error());
    }

    this.testFetchRequestSucceeded = function() {
        dv.set_dataProvider("hi");
        dv.set_fetchOperation("query");
        dv.set_autoFetch(false);
        dv.initialize();
        var result = null, context = null, method = null;
        function onSuccess(r, ctx, m) {
            result = r;
            context = ctx;
            method = m;
        }
        function onFail(err, ctx, m) {
            AtlasUnit.Assert.fail("Request failed.");
        }
        AtlasUnit.Assert.isNull(result, "SucceededCallback shouldnt fire yet.");
        dv.fetchData(onSuccess, onFail, null, 88);
        var request = helper.verifyRequest({});
        var sender = null, args = null;
        dv.add_fetchSucceeded(function(s, a) {
            sender = s;
            args = a;
        });
        request.succeededCallback({}, request.userContext);
        AtlasUnit.Assert.isNotNull(sender, "RequestSucceeed event did not fire.");
        AtlasUnit.Assert.isNotNull(result, "SucceededCallback was not called.");
        AtlasUnit.Assert.areEqual(88, context);
        AtlasUnit.Assert.areEqual("fetchData", method);
        AtlasUnit.Assert.isNull(args.get_error());
    }

    this.testItemRenderedEventRaisedForArray = function() {
        var events = [];
        function onItemRendered(s, a) {
            events.push([s, a]);
        }
        dv.add_itemRendered(onItemRendered);
        dv.initialize();
        dv.set_data(["foo1", "foo2"]);
        AtlasUnit.Assert.areEqual(2, events.length);
        AtlasUnit.Assert.areEqual("foo1", events[0][1].dataItem);
        AtlasUnit.Assert.areEqual("foo2", events[1][1].dataItem);
    }

    this.testItemRenderedEventRaisedForObject = function() {
        var events = [];
        function onItemRendered(s, a) {
            events.push([s, a]);
        }
        dv.add_itemRendered(onItemRendered);
        dv.initialize();
        dv.set_data("foo1");
        AtlasUnit.Assert.areEqual(1, events.length);
        AtlasUnit.Assert.areEqual("foo1", events[0][1].dataItem);
    }

}
Sys.UI.Test.DataViewTest.registerClass("Sys.UI.Test.DataViewTest");
Sys.UI.Test.DataViewTest["AtlasUnit.IsTestFixture"] = true;


Sys.UI.Test.DataViewTest.CustomProvider = function() {
    this.fetchData = function(query, parameters, mergeOption, httpVerb, onSuccess, onFail, timeout, userContext) {
        this.query = query;
        this.parameters = parameters;
        this.mergeOption = mergeOption;
        this.httpVerb = httpVerb;
        this.timeout = timeout;
        this.userContext = userContext;
    }
}
Sys.UI.Test.DataViewTest.CustomProvider.registerClass("Sys.UI.Test.DataViewTest.CustomProvider", null, Sys.Data.IDataProvider);

Sys.UI.Test.DataViewTest.CustomProxy = function() {
}
Sys.UI.Test.DataViewTest.CustomProxy.get_path = function() { return "staticpath"; }
Sys.UI.Test.DataViewTest.CustomProxy.get_timeout = function() { return 88; }
Sys.UI.Test.DataViewTest.CustomProxy.registerClass("Sys.UI.Test.DataViewTest.CustomProxy", Sys.Net.WebServiceProxy);