/// <reference name="MicrosoftAjax.js"/>
/// <reference path="AtlasUnit.js"/>

Type.registerNamespace("AtlasUnit.Gui");

AtlasUnit.Gui.TestSuiteTreeView = function(associatedElement) {
    var _element = associatedElement;
    var _suite;

    var _allElements = [];

    this.set_suite = function(suite) {
        _suite = suite;
    }

    this.loadState = function() {
        var cookies = document.cookie.split(';');
        var state;

        for (var i=0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.startsWith("AtlasUnit.Gui.TreeViewState=")) {
                var stateString = cookie.replace(/AtlasUnit\.Gui\.TreeViewState=/, "");
                state = Sys.Serialization.JavaScriptSerializer.deserialize(stateString);
                break;
            }
        }

        if (state) {
            _element.scrollTop = state.scrollTop;

            for (var i=0; i < _allElements.length; i++) {
                var elem = _allElements[i];
                var fullName = elem.test.get_fullName();
                if (state.checkedTests[fullName]) {
                    elem.checkBox.checked = true;
                }
                if (typeof(state.displayModes[fullName]) !== "undefined") {
                    this.setDisplayMode(elem, state.displayModes[fullName]);
                }
            }
        }
    }

    this.render = function() {
        // Don't render root node of tree, since it is a dummy node named "root"
        for (var i=0; i < _suite.get_tests().length; i++) {
            this.renderTest(_suite.get_tests()[i], "", _element);
        }

        this.loadState();
        window.onunload = Function.createDelegate(this, this.saveState);
    }

    this.renderTest = function(test, indent, parentElem) {
        var elem = document.createElement("div");
        elem.style.whiteSpace = "nowrap";
        elem.test = test;
        elem.childTreeNodes = [];

        var indentElem = document.createElement("span");
        indentElem.innerHTML = AtlasUnit.Util.formatPlainTextAsHtml(indent);
        elem.appendChild(indentElem);

        var displayModeElement = document.createElement("span");
        displayModeElement.style.fontFamily = "Lucida Console";
        if (AtlasUnit.TestSuite.isInstanceOfType(test)) {
            displayModeElement.style.border = "solid 1px black";

            Sys.UI.DomEvent.addHandler(displayModeElement, "click",
                Function.createCallback(Function.createDelegate(this, this.toggleDisplayMode), elem));

            displayModeElement.style.cursor = "pointer";
        }
        else {
            displayModeElement.innerHTML = " ";
        }
        elem.appendChild(displayModeElement);
        elem.displayModeElement = displayModeElement;

        var checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        elem.appendChild(checkBox);
        elem.checkBox = checkBox;

        var resultElem = document.createElement("span");
        resultElem.style.color = "Gray";
        resultElem.innerHTML = "&#x25CF; ";
        elem.appendChild(resultElem);
        elem.result = resultElem;

        var nameElem = document.createElement("span");
        nameElem.innerHTML = AtlasUnit.Util.formatPlainTextAsHtml(test.get_name());
        elem.appendChild(nameElem);

        if (AtlasUnit.TestSuite.isInstanceOfType(test)) {
            var containsTestSuites = false;

            var tests = test.get_tests();
            for (var i=0; i < tests.length; i++) {
                this.renderTest(tests[i], indent + "    ", elem);
                if (AtlasUnit.TestSuite.isInstanceOfType(tests[i])) {
                    containsTestSuites = true;
                }
            }

            // To save vertical space in the UI, if this test suite only contains
            // test cases, start collapsed.
            var displayMode = containsTestSuites ?
                AtlasUnit.Gui.DisplayMode.Expanded :
                AtlasUnit.Gui.DisplayMode.Collapsed;
            this.setDisplayMode(elem, displayMode);
        }

        parentElem.appendChild(elem);
        _allElements.push(elem);
    }

    this.runTests = function(testRunner, throwOnFail, includedCategories, excludedCategories) {
        var runMode = AtlasUnit.RunMode.AllTests;

        for (var i=0; i < _allElements.length; i++) {
            var elem = _allElements[i];
            elem.result.style.color = "Gray";
            if (elem.checkBox.checked) {
                runMode = AtlasUnit.RunMode.SelectedTests;
                elem.test.set_selected(true);
            }
            else {
                elem.test.set_selected(false);
            }
        }

        testRunner.set_runMode(runMode);
        testRunner.set_throwOnFail(throwOnFail);
        testRunner.set_includedCategories(includedCategories);
        testRunner.set_excludedCategories(excludedCategories);
        _suite.accept(testRunner);
    }

    this.saveState = function() {
        var state = {};
        state.scrollTop = _element.scrollTop;
        state.checkedTests = {};
        state.displayModes = {};

        for (var i=0; i < _allElements.length; i++) {
            var elem = _allElements[i];
            var fullName = elem.test.get_fullName();

            if (elem.checkBox.checked) {
                state.checkedTests[fullName] = true;
            }
            if (AtlasUnit.TestSuite.isInstanceOfType(elem.test)) {
                var displayMode = (elem.displayModeElement.innerHTML === "+") ?
                    AtlasUnit.Gui.DisplayMode.Collapsed :
                    AtlasUnit.Gui.DisplayMode.Expanded;
                state.displayModes[fullName] = displayMode;
            }
        }

        document.cookie = ("AtlasUnit.Gui.TreeViewState=" +
            Sys.Serialization.JavaScriptSerializer.serialize(state));
    }

    this.setDisplayMode = function(elem, displayMode) {
        var displayModeElement = elem.displayModeElement;
        displayModeElement.innerHTML =
            (displayMode === AtlasUnit.Gui.DisplayMode.Collapsed) ? "+" : "-";

        for (var i=0; i < elem.childNodes.length; i++) {
            var childElement = elem.childNodes[i];
            if (childElement.test) {
                childElement.style.display =
                    (displayMode === AtlasUnit.Gui.DisplayMode.Collapsed) ? "none" : "";
            }
        }
    }

    this.toggleDisplayMode = function(event, elem) {
        var newDisplayMode = (elem.displayModeElement.innerHTML === "+") ?
            AtlasUnit.Gui.DisplayMode.Expanded :
            AtlasUnit.Gui.DisplayMode.Collapsed;
        this.setDisplayMode(elem, newDisplayMode);
    }

    this.updateResults = function() {
        for (var i=0; i < _allElements.length; i++) {
            var elem = _allElements[i];
            switch (elem.test.get_result().get_executionStatus()) {
                case AtlasUnit.ExecutionStatus.NotExecuted:
                    elem.result.style.color = "Gray";
                    break;
                case AtlasUnit.ExecutionStatus.Succeeded:
                    elem.result.style.color = "Lime";
                    break;
                case AtlasUnit.ExecutionStatus.Failed:
                    elem.result.style.color = "Red";
                    break;
            }
        }
    }
}
AtlasUnit.Gui.TestSuiteTreeView.registerClass('AtlasUnit.Gui.TestSuiteTreeView');

AtlasUnit.Gui.DisplayMode = {};
AtlasUnit.Gui.DisplayMode.Collapsed = 0;
AtlasUnit.Gui.DisplayMode.Expanded = 1;

AtlasUnit.Gui.Categories = function(associatedElement) {
    var _element = associatedElement;
    var _suite;
    var _radioButtons = [];

    this.set_suite = function(testSuite) {
        _suite = testSuite;
    }

    this.get_includedCategories = function() {
        var includedCategories = [];
        for (var i=0; i < _radioButtons.length; i++) {
            var radio = _radioButtons[i];
            if (radio.value === "Included" && radio.checked) {
                Array.add(includedCategories, radio.name);
            }
        }
        return includedCategories;
    }

    this.get_excludedCategories = function() {
        var excludedCategories = [];
        for (var i=0; i < _radioButtons.length; i++) {
            var radio = _radioButtons[i];
            if (radio.value == "Excluded" && radio.checked) {
                Array.add(excludedCategories, radio.name);
            }
        }
        return excludedCategories;
    }

    this.render = function() {
        var categoryCollector = new AtlasUnit.CategoryCollector();
        _suite.accept(categoryCollector);

        var categories = categoryCollector.get_categories();

        var tableRow;
        if (categories.length > 0) {
            var includedCategories = [];
            var includePattern = /include=([^&]*)/g;
            var includeResult;
            while ((includeResult = includePattern.exec(window.location.search))) {
                Array.add(includedCategories, includeResult[1]);
            }

            var excludedCategories = [];
            var excludePattern = /exclude=([^&]*)/g;
            var excludeResult;
            while ((excludeResult = excludePattern.exec(window.location.search))) {
                Array.add(excludedCategories, excludeResult[1]);
            }

            for (var i=0; i < categories.length; i++) {
                tableRow = document.createElement("tr");

                var categoryName = categories[i];
                tableRow.appendChild(createCell(categoryName));

                var includedRadioCell = createRadioCell(categoryName, "Included");
                var excludedRadioCell = createRadioCell(categoryName, "Excluded");
                var neitherRadioCell = createRadioCell(categoryName, "Neither");

                tableRow.appendChild(includedRadioCell);
                tableRow.appendChild(excludedRadioCell);
                tableRow.appendChild(neitherRadioCell);

                _element.appendChild(tableRow);

                // HACK: IE requires the checked property to be set *after* the element is added to the DOM
                if (Array.indexOf(excludedCategories, categoryName) >= 0) {
                    excludedRadioCell.firstChild.checked = true;
                }
                else if (Array.indexOf(includedCategories, categoryName) >= 0) {
                    includedRadioCell.firstChild.checked = true;
                }
                else {
                    neitherRadioCell.firstChild.checked = true;
                }
            }
        }
        else {
            tableRow = document.createElement("tr");
            tableRow.appendChild(createCell("None"));
            tableRow.appendChild(createCell(""));
            tableRow.appendChild(createCell(""));
            tableRow.appendChild(createCell(""));
            _element.appendChild(tableRow);
        }
    }

    function createCell(text) {
        var cell = document.createElement("td");
        cell.innerHTML = AtlasUnit.Util.formatPlainTextAsHtml(text);
        return cell;
    }

    function createRadioCell(name, value) {
        var cell = document.createElement("td");

        var radio = document.createElement("input");
        radio.name = name;

        // HACK: IE does not allow the name to be set after the element is created.
        if (radio.outerHTML && radio.outerHTML.indexOf(name) == -1) {
            radio = document.createElement(String.format("<input name=\"{0}\"></input>", name));
        }

        radio.type = "radio";
        radio.value = value;
        Array.add(_radioButtons, radio);
        cell.appendChild(radio);

        return cell;
    }
}
AtlasUnit.Gui.Categories.registerClass('AtlasUnit.Gui.Categories');

Sys.Application.notifyScriptLoaded();