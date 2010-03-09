<%@ Page Language="C#" MasterPageFile="~/AtlasUnit.master" AutoEventWireup="true"
    CodeFile="AtlasUnitGui.aspx.cs" Inherits="AtlasUnitGui" Title="AtlasUnit Gui" %>

<asp:Content ID="MainContent1" ContentPlaceHolderID="MainContent" runat="Server">
    <table cellpadding="5px" style="width: 100%;">
        <tr valign="top">
            <td>
                Tests
                <div id="treeView" style="border: solid 2px black; padding: 5px; width: 350px; overflow: scroll;">
                </div>
            </td>
            <td style="width: 100%">
                <em>
                Note: Re-running suites with the 'run' button is not working due to issues with suites running twice.
                To re-run suites, just refresh the page. Add "&amp;throwOnFail" to the querystring to throw an exception when a test fails.
                </em>
                <input type="button" id="run" value="Run" onclick="runTests()" style="padding: 5px"
                    disabled="disabled" />
                <input type="checkbox" id="throwOnFail" />Throw exception when test fails
                <table border="1" cellpadding="2px" style="text-align: center; margin-top: 10px;
                    margin-bottom: 10px">
                    <tbody id="categories">
                        <tr style="font-weight: bold">
                            <td>
                                Categories
                            </td>
                            <td>
                                Included
                            </td>
                            <td>
                                Excluded
                            </td>
                            <td>
                                Neither
                            </td>
                        </tr>
                    </tbody>
               </table>
                Failures
                <div id="failures" style="border: solid 2px black; padding: 5px; height: 200px; overflow:auto">
                </div>
                <div id="summary">
                </div>
            </td>
        </tr>
    </table>

    <script type="text/javascript">
        var suite;
        var treeView;
        var _categories;

        function initialize() {
            // The buildSuite() function is rendered by AtlasUnit.Master.cs
            suite = buildSuite();
            treeView = new AtlasUnit.Gui.TestSuiteTreeView($get("treeView"));
            treeView.set_suite(suite);
            treeView.render();

            _categories = new AtlasUnit.Gui.Categories($get("categories"));
            _categories.set_suite(suite);
            _categories.render();

            if (window.location.search.indexOf("throwOnFail") != -1) {
                $get("throwOnFail").checked = true;
            }

            $get("run").disabled = false;
            $get("run").focus();

            // Automatically run initial set of tests
            runTests();
        }

        function runTests() {
            // Clear results
            $get("summary").innerHTML = "";
            $get("failures").innerHTML = "";

            var throwOnFail = $get("throwOnFail").checked;
            
            var worker = new AtlasUnit.BackgroundWorker();
            var runner = new AtlasUnit.AsyncTestRunner(worker);
            
            treeView.runTests(runner,
                              throwOnFail,
                              _categories.get_includedCategories(),
                              _categories.get_excludedCategories());
            
            worker.add_completed(function() {
                var elapsedTime = new Date() - startTime;
                
                treeView.updateResults();
                
                var resultCollector = new AtlasUnit.ResultCollector();
                suite.accept(resultCollector);

                var runTestCases = resultCollector.get_runTestCases();
                var failedTestCases = resultCollector.get_failedTestCases();

                var summary = String.format("Tests run: {0}, Failures: {1}, Time: {2}",
                    runTestCases.length, failedTestCases.length, elapsedTime / 1000);
                $get("summary").innerHTML = AtlasUnit.Util.formatPlainTextAsHtml(summary);

                var sb = new Sys.StringBuilder();
                for (var i=0; i < failedTestCases.length; i++) {
                    var failedTestCase = failedTestCases[i];
                    sb.append(failedTestCase.get_fullName() + ": ");

                    var exception = failedTestCase.get_result().get_exception();
                    if (exception && typeof(exception.message) != "undefined") {
                        sb.appendLine(exception.message);
                    }
                    else {
                        sb.appendLine(exception);
                    }
                    sb.appendLine();
                }

                // Cannot just set innerHTML on existing "failures" div, since IE will not show the full contents
                // of the existing div until the window is resized.  Adding a child div with height 100% to the
                // existing div seems to work in both IE and FireFox.
                var failuresText = document.createElement("div");
                failuresText.style.height = "100%";
                failuresText.innerHTML = AtlasUnit.Util.formatPlainTextAsHtml(sb.toString());
                if ($get("failures").firstChild) {
                    $get("failures").removeChild($get("failures").firstChild);
                }
                $get("failures").appendChild(failuresText);
            });
            
            // Smaller batch size increases the number of UI updates while tests are running, but increases runtime.
            // 
            // Batch Size    IE Rel    IE Dbg    FF Rel    FF Dbg
            // ==========    ======    ======    ======    ======
            //          1     11.8s     11.8s     18.4s     18.4s
            //         10      1.8s      2.7s      2.4s      3.2s
            //         20      1.4s      2.6s      1.5s      2.9s
            //         50      1.3s      2.6s      1.2s      2.2s
            //        100      1.1s      2.3s      1.0s      2.0s
            //       1000      1.0s      2.3s      1.0s      2.0s
            //
            // Batch size of 50 is a good compromise.
            worker.set_batchSize(50);

            var startTime = new Date();
            worker.run();
        }

    </script>

    <script type="text/javascript">
        function resizeTreeView() {
            // 80px fudge factor, so treeview does not extend below document height
            $get("treeView").style.height = (document.documentElement.clientHeight - 80) + "px";
        }

        Sys.Application.add_load(function() {
            initialize();
            resizeTreeView();
        });
        window.onresize = resizeTreeView;
    </script>
</asp:Content>
