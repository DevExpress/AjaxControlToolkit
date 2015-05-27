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
    </style>
    <script src="/Vendor/jquery-2.1.4/jquery.js"></script>
</head>
<body>
    <form id="form1" runat="server">
        <iframe src="Suites/CascadingDropDownTests.aspx"></iframe>
        <div id="results">
        </div>
        <script>
            (function($root) {

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
                        .attr("href", "Suites/CascadingDropDownTests.aspx?spec=" + specFullName);
                }

                window.reporter = {

                    suiteStarted: function(result) {
                        if(containerExists(result))
                            return;

                        appendContainer(result);
                    },

                    specStarted: function(result) {
                    },

                    specDone: function(result) {
                        var $container = appendContainer(result);
                        $container.addClass("testing-spec-" + result.status);

                        $container.$head.append(createSpecLink('Spec: ' + result.description + ' was ' + result.status, result.fullName));
                        debugger;
                        for(var i = 0; i < result.failedExpectations.length; i++) {
                            $container.$body.append($("<div>")
                                .text('Failure: ' + result.failedExpectations[i].message)
                                .append($("<div>")
                                    .addClass("testing-spec-stackTrace")
                                    .text(result.failedExpectations[i].stack)));
                        }
                    },
                };

            })($("#results"));
        </script>
    </form>
</body>
</html>
