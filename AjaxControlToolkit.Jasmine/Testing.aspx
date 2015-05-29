<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Testing.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Testing" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style>
        iframe {
            resize: both;
        }

        .testing-container {
            border: 1px solid black;
            background-color: lightgray;
            padding: 0 10px;
            margin: 10px;
        }

        .testing-container-head {
            padding: 10px;
            margin-left: -10px;
            margin-right: -10px;
            background-color: gray;
            cursor: pointer;
            -moz-user-select: none;
            -ms-user-select: none;
            -webkit-user-select: none;
            user-select: none;
        }

        .testing-container.testing-spec-failed .testing-container-head {
            background-color: palevioletred;
        }

        .testing-container.testing-spec-passed .testing-container-head {
            background-color: cornflowerblue;
        }

        .testing-spec-stackTrace {
            font-size: 11px;
            font-family: Monaco, "Lucida Console", monospace;
            border: 1px solid #ddd;
            background: white;
            padding: 5px;
            margin: 5px 0;
        }

        .testing-spec-failed {
            white-space: pre;
        }

        .testing-run-counter {
            background-color: #ddd;
            border: 1px solid black;
            margin-bottom: 3px;
            padding: 3px;
            font-family: Monaco, "Lucida Console", monospace;
        }
    </style>
    <script src="/Vendor/jquery-2.1.4/jquery.js"></script>
</head>
<body>
    <form id="form1" runat="server">
        <div id="testPageCounter" class="testing-run-counter"></div>
        <div id="specCounter" class="testing-run-counter"></div>
        <iframe id="testFrame"></iframe>
        <div id="results">
        </div>
        <script>
            (function($root, $iframe) {

                function containerExists(result) {
                    return !!$root.find(makeCssSelector(result.fullName)).length;
                }

                function makeCssSelector(fullName) {
                    return fullName                     // CSS selector should
                        .replace(/[^\w- ]/g, "_")       // contain only a-zA-z0-9_- symbols
                        .replace(/(^| )(\d)/g, "_$2")   // start with number
                        .replace(/( )/g, ">.testing-container-body>.")
                        .replace(/^(.)/g, ".$1");
                }

                function appendContainer(result) {
                    var $parent = $(makeCssSelector(result.fullName.replace(/ ?[^ ]+$/, "")));
                    if($parent.length)
                        $parent = $parent.find(".testing-container-body").first();
                    else
                        $parent = $root;

                    var $container = createContainer();
                    var name = result.description.replace(".", "");

                    $container
                        .addClass(name)
                        .appendTo($parent);

                    var $link = createSpecLink(name, result.fullName);
                    $container.$head.html($link);

                    return $container;
                }

                function createContainer() {
                    var $container = $("<div>").addClass("testing-container");

                    $container.$body = $("<div>").addClass("testing-container-body");

                    $container.$head = $("<div>").addClass("testing-container-head");
                    $container.$head.click(function() {
                        $container.$body.slideToggle();
                    });

                    $container.append($container.$head);
                    $container.append($container.$body);

                    return $container;
                }

                function createSpecLink(text, specFullName) {
                    return $("<a>")
                        .text(text)
                        .attr("href", "Suites/" + currentPageName +"?spec=" + specFullName);
                }

                var suiteIndex = -1,
                    specIndex = 0,
                    specQty = 0,
                    totalSpecCounter = -1,
                    totalSpecQty = getTotalSpecQty(),
                    testPagesCounter = -1,
                    testPagesQty = getTestPagesQty(),
                    currentPageName = "";

                function goToNextSpec() {
                    if(specIndex >= specQty) {
                        suiteIndex += 1;
                        specIndex = 0;
                        specQty = window.Testing.Suites[suiteIndex].specQty;
                    }

                    if(suiteIndex >= window.Testing.Suites.length)
                        return;

                    totalSpecCounter += 1;

                    $("#testPageCounter").text("Running test page " + suiteIndex + " of " + testPagesQty);
                    $("#specCounter").text("Running spec " + totalSpecCounter + " of " + totalSpecQty);

                    currentPageName = window.Testing.Suites[suiteIndex].name;
                    $iframe.attr("src", "Suites/" + window.Testing.Suites[suiteIndex].name + "?specIndex=" + specIndex);

                    specIndex += 1;
                }

                function getTotalSpecQty(){
                    var count = 0;

                    for(var i = 0; i < window.Testing.Suites.length; i++) {
                        count += window.Testing.Suites[i].specQty;
                    }

                    return count;
                }

                function getTestPagesQty(){
                    var count = 0;

                    for(var i = 0; i < window.Testing.Suites.length; i++) {
                        if(window.Testing.Suites[i].specQty > 0)
                            count += 1;
                    }

                    return count;
                }

                window.Testing.Reporter = {

                    suiteStarted: function(result) {
                        if(containerExists(result))
                            return;

                        appendContainer(result);
                    },

                    specDone: function(result) {
                        if(result.status === "disabled")
                            return;

                        var $container = appendContainer(result);
                        $container.addClass("testing-spec-" + result.status);

                        for(var i = 0; i < result.failedExpectations.length; i++) {
                            $container.$body.append($("<div>")
                                .text('Failure: ' + result.failedExpectations[i].message)
                                .append($("<div>")
                                    .addClass("testing-spec-stackTrace")
                                    .text(result.failedExpectations[i].stack)));
                        }

                        goToNextSpec();
                    },
                };

                goToNextSpec();

            })($("#results"), $("#testFrame"));
        </script>
    </form>
</body>
</html>
