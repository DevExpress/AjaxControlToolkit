<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Testing.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Testing" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style>
        iframe {
            resize: both;
        }

        .report-line {
            background-color: cornflowerblue;
            padding: 10px 20px;
            margin: 10px 0;
        }

        .testing-container {
            border: 1px solid red;
            background-color: lightgray;
            padding: 10px;
            padding-top: 0;
            margin: 10px;
        }

        .testing-container-head {
            padding: 10px;
            margin-left: -10px;
            margin-right: -10px;
        }

        .testing-container.testing-spec-failed .testing-container-head {
            background-color: palevioletred;
        }

        .testing-container.testing-spec-passed .testing-container-head {
            background-color: cornflowerblue;
        }

        .stack-trace {
            font-size: 11px;
            font-family: Monaco, "Lucida Console", monospace;
            border: 1px solid #ddd;
            background: white;
            margin: 5px 0 0 0;
        }

        .failure {
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

                function createContainer() {
                    var $container = $("<div>").addClass("testing-container");

                    $container.$header = $("<div>").addClass("testing-container-head");

                    $container.append($container.$header);

                    return $container;
                }

                function containerExists(result) {
                    var cssPath = result.fullName.replace(/ /g, ">");
                    return !!$root.find(cssPath).length;
                }

                function appendContainer(result) {

                    var $parent = $(result.fullName
                        .replace(/\.[^ ]+$/, "")
                        .trim()
                        .replace(/ /g, ">"));

                    if(!$parent.length)
                        $parent = $root;

                    var $container = createContainer();
                    var name = result.description.replace(".", "");

                    $container
                        .addClass(name)
                        .appendTo($parent);

                    var $link = getSpecLink(name, result.fullName);
                    $container.$header.html($link);
                }

                function getSpecLink(text, specFullName)
                {
                    var path = "Suites/CascadingDropDownTests.aspx?spec=" + specFullName;
                    var $a = $("<a></a>");
                    $a.text(text);
                    $a.attr("href", path);
                    return $a;
                }

                window.reporter = {

                    suiteStarted: function(result) {
                        if(containerExists(result))
                            return;

                        appendContainer(result);
                    },

                    specStarted: function(result) {
                        appendContainer(result);
                    },

                    specDone: function(result) {
                        var $container = $root.find(result.fullName.replace(/ /g, ">")),
                            $head = $container.find(".testing-container-head");

                        $container.addClass("testing-spec-" + result.status);

                        var $link = getSpecLink('Spec: ' + result.description + ' was ' + result.status, result.fullName);
                        $head.html($link);
                        for(var i = 0; i < result.failedExpectations.length; i++) {
                            var $failure = $("<div></div>");
                            $failure.text('Failure: ' + result.failedExpectations[i].message);
                            $failure.addClass("failure");
                            $container.append($failure);
                            var $stackTrace = $("<div></div>");
                            $stackTrace.addClass("stack-trace");
                            $stackTrace.text(result.failedExpectations[i].stack);
                            $failure.append($stackTrace);
                        }
                    },
                };
            })($("#results"));
        </script>
    </form>
</body>
</html>
