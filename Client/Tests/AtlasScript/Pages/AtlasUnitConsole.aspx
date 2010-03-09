<%--
Test Cases
==========
Split AtlasUnit tests into separate vroot
--%>

<%@ Page Language="C#" MasterPageFile="~/AtlasUnit.master" AutoEventWireup="true"
    CodeFile="AtlasUnitConsole.aspx.cs" Inherits="AtlasUnitConsole" Title="AtlasUnit Console" %>

<asp:Content ID="MainContent1" ContentPlaceHolderID="MainContent" runat="Server">
    <script type="text/javascript">
        function run() {
            // The buildSuite() function is rendered by AtlasUnit.Master.cs
            var suite = buildSuite();

            var worker = new AtlasUnit.BackgroundWorker();
            var runner = new AtlasUnit.AsyncTestRunner(worker);

            if (window.location.search.indexOf("throwOnFail") != -1) {
                runner.set_throwOnFail(true);
            }

            var includedCategories = [];
            var includePattern = /include=([^&]*)/g;
            var includeResult;
            while ((includeResult = includePattern.exec(window.location.search))) {
                Array.add(includedCategories, includeResult[1]);
            }
            runner.set_includedCategories(includedCategories);

            var excludedCategories = [];
            var excludePattern = /exclude=([^&]*)/g;
            var excludeResult;
            while ((excludeResult = excludePattern.exec(window.location.search))) {
                Array.add(excludedCategories, excludeResult[1]);
            }
            runner.set_excludedCategories(excludedCategories);

            suite.accept(runner);
            
            worker.add_completed(function() {
                var elapsedTime = new Date() - startTime;

                var resultCollector = new AtlasUnit.ResultCollector();
                suite.accept(resultCollector);

                var plainLog = (window.location.search.indexOf("plainLog") != -1);

                var results = AtlasUnit.Console.ResultSummaryGenerator.generateSummary(
                    resultCollector.get_runTestCases(),
                    resultCollector.get_failedTestCases(),
                    plainLog,
                    elapsedTime);

                var statusElem = document.createElement("div");
                statusElem.style.fontFamily = "Lucida Console";
                statusElem.style.fontSize = "small";
                statusElem.id = "summary";

                statusElem.innerHTML = resultCollector.get_failedTestCases().length ? "Failed" : "Passed";

                document.body.appendChild(statusElem);

                var resultsElem = document.createElement("div");
                resultsElem.style.fontFamily = "Lucida Console";
                resultsElem.style.fontSize = "small";
                resultsElem.id = "results";

                resultsElem.innerHTML = AtlasUnit.Util.formatPlainTextAsHtml(results);

                document.body.appendChild(resultsElem);
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

        Sys.Application.add_load(run);
    </script>
</asp:Content>
