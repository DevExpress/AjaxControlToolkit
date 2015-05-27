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

                function appendContainer(result) {
                    var cssPath = result.fullName.replace(/ /g, ">");

                    if($root.find(cssPath).length)
                        return;

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

                    $container.$header.text(name);
                }

                window.reporter = {

                    suiteStarted: function(result) {
                        appendContainer(result);
                    },

                    specStarted: function(result) {
                        appendContainer(result);
                    },

                    specDone: function(result) {
                        var $container = $root.find(result.fullName.replace(/ /g, ">")),
                            $head = $container.find(".testing-container-head");

                        $container.addClass("testing-spec-" + result.status);

                        $head.text('Spec: ' + result.description + ' was ' + result.status);
                        for(var i = 0; i < result.failedExpectations.length; i++) {
                            $container.append('Failure: ' + result.failedExpectations[i].message);
                            $container.append(result.failedExpectations[i].stack);
                        }
                    },
                };
            })($("#results"));
        </script>
    </form>
</body>
</html>
