<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Testing.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Testing" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style>
        body {
            font-family: Calibri, Helvetica, Arial, sans-serif;
            margin: 0;
        }

        iframe {
            resize: both;
            border: 1px solid #008cba;
            margin: 10px;
        }

        .testing-container {
            border: 1px solid #d8d8d8;
            background: #f2f2f2;
            padding: 6px;
        }

        .testing-container-head {
            cursor: pointer;
        }

        .testing-container-head-link {
            font-size: 14px;
            font-weight: bold;
        }

        .testing-container.testing-spec-failed {
            background-color: #ED6753;
        }

        .testing-container.testing-spec-passed {
            background-color: #68AA7D;
        }

            .testing-container.testing-spec-passed .testing-container-head a {
                color: white;
                text-decoration: none;
            }

        .testing-container.testing-spec-failed .testing-container-head a {
            color: black;
            text-decoration: none;
        }

        .testing-spec-stackTrace {
            font-size: 11px;
            font-family: Consolas, "Courier New", monospace;
            border: 1px solid #ddd;
            background: white;
            padding: 5px;
            margin: 5px 0;
        }

        .testing-spec-failed {
            white-space: pre;
        }

        .testing-run-counter {
            background-color: #333;
            color: white;
            padding: 5px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: bold;
        }

        .testing-button {
            background: #008cba;
            display: inline-block;
            height: 30px;
            width: 100px;
            font-size: 16px;
            text-decoration: none;
            color: white;
            text-align: center;
            line-height: 30px;
            margin: 10px;
        }

        .assertion-counter {
            display: inline-block;
            height: 18px;
            width: 30px;
            background-color: lightgray;
            vertical-align: middle;
            text-align: center;
            font-weight: bold;
            color: black;
            border-radius: 10px;
            float: right;
            font-size: 14px;
            padding: 0 3px 0 3px;
        }

        .user-agent-info {
            background-color: #333;
            color: lightblue;
            padding: 5px;
            font-size: 14px;
            font-weight: bold;
        }

        .progress-bar {
            height: 3px;
            background-color: orange;
        }

        .total-time {
            float: right;
            font-size: 12px;
        }
    </style>
    <script src="/Vendor/jquery-2.1.4/jquery.js"></script>
</head>
<body>
    <form runat="server">
        <div id="TestPageCounter" class="testing-run-counter"></div>
        <div id="SpecCounter" class="testing-run-counter"></div>

        <iframe id="TestFrame"></iframe>

        <div id="results"></div>

        <script>
            (function($root, $iframe) {

                function insertUserAgentInfo() {
                    var $userAgentInfoContainer = $("<div>").text(navigator.userAgent).addClass("user-agent-info");
                    $("body").prepend($userAgentInfoContainer);
                }

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

                function appendContainer(result, isSuite) {
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

                    if(isSuite) {
                        var $runThisButton = createRunThisButton();
                        $container.$head.append($runThisButton);
                    }

                    return $container;
                }

                function createRunThisButton() {
                    return $("<a>")
                        .text("run suite")
                        .attr("href", "?suite=" + currentPageName)
                        .addClass("testing-button");
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
                        .attr("href", "Suites/" + currentPageName + "?spec=" + specFullName);
                }

                var suiteIndex = -1,
                    specIndex = 0,
                    specQty = 0,
                    totalSpecCounter = -1,
                    totalSpecQty = getTotalSpecQty(),
                    testPagesCounter = -1,
                    testPagesQty = getTestPagesQty(),
                    currentPageName = "";

                insertUserAgentInfo();

                var $progressBar = $("<div>").addClass("progress-bar").width(0);
                $("body").prepend($progressBar);

                var step = 100 / getTotalSpecQty();

                function goToNextSpec() {
                    if(specIndex >= specQty) {
                        suiteIndex += 1;
                        if(suiteIndex >= window.Testing.Suites.length)
                            return;

                        specIndex = 0;
                        specQty = window.Testing.Suites[suiteIndex].specQty;
                    }

                    totalSpecCounter += 1;

                    $("#TestPageCounter").text("Running test page " + (suiteIndex + 1) + " of " + testPagesQty);
                    $("#SpecCounter").text("Running spec " + (totalSpecCounter + 1) + " of " + totalSpecQty);

                    $progressBar.animate({
                        width: "+=" + step + "%"
                    }, 50);

                    currentPageName = window.Testing.Suites[suiteIndex].name;
                    $iframe.attr("src", "Suites/" + window.Testing.Suites[suiteIndex].name + "?specIndex=" + specIndex);

                    specIndex += 1;
                }

                function getTotalSpecQty() {
                    for(var i = 0, count = 0; i < window.Testing.Suites.length; i++)
                        count += window.Testing.Suites[i].specQty;

                    return count;
                }

                function getTestPagesQty() {
                    for(var i = 0, count = 0; i < window.Testing.Suites.length; i++)
                        if(window.Testing.Suites[i].specQty) count += 1;

                    return count;
                }

                function insertExecutionTimeLabel(startExecutionTime) {
                    var endExecutionTime = new Date().getTime();
                    var totalExecutionTime = (endExecutionTime - startExecutionTime) / 1000;

                    var $timeContainer = $("<div>").text("Total execution time: " + totalExecutionTime + " sec").addClass("total-time");
                    $("#SpecCounter").append($timeContainer);
                }

                window.Testing.Reporter = {

                    specIndex: 0,
                    startExecutionTime: new Date().getTime(),

                    suiteStarted: function(result) {
                        if(containerExists(result))
                            return;

                        appendContainer(result, true);
                    },

                    specDone: function(result) {
                        if(result.status === "disabled")
                            return;

                        var $container = appendContainer(result);
                        $container.addClass("testing-spec-" + result.status);

                        this.specIndex++;
                        var $testHeadLink = $container.find(".testing-container-head").find("a");
                        $testHeadLink.addClass("testing-container-head-link").text(this.specIndex + ". " + $testHeadLink.text().split("-").join(" "));

                        var $assertCountLabel = $("<span>").addClass("assertion-counter");
                        $assertCountLabel.text(result.passedExpectations.length + "/" + result.failedExpectations.length);
                        $container.find(".testing-container-head").append($assertCountLabel);

                        for(var i = 0; i < result.failedExpectations.length; i++) {
                            $container.$body.append($("<div>")
                                .text('Failure: ' + result.failedExpectations[i].message)
                                .append($("<div>")
                                    .addClass("testing-spec-stackTrace")
                                    .text(result.failedExpectations[i].stack)));
                        }

                        if(this.specIndex === getTotalSpecQty())
                            insertExecutionTimeLabel(this.startExecutionTime);

                        goToNextSpec();
                    },
                };

                goToNextSpec();

            })($("#results"), $("#TestFrame"));
        </script>
    </form>
</body>
</html>
