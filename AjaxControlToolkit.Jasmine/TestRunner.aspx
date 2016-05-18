<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TestRunner.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.TestRunner" %>

<!doctype html>

<html>
<head runat="server">
    <title>AJAX Control Toolkit Test Runner</title>

    <asp:PlaceHolder runat="server">
        <%: Styles.Render("~/Infrastructure/Styles/TestRunner.css") %>
    </asp:PlaceHolder>
</head>
<body>
    <form runat="server">
        <section class="test-container">
            <header class="header">
                <div class="useragent-info"></div>
                <hr />
                <div class="suite-counter">
                    Running test page <span class="current"></span> of <span class="total"></span>

                    <span class="total-execution-time">Total execution time: </span>
                </div>
                <div class="run-progress">
                </div>
            </header>

            <nav class="suite-list">
            </nav>

            <div class="test-output">
                <div class="spec-counter">
                    Running spec <span class="current"></span> of <span class="total"></span>

                    <span class="loader">
                        <img src="/Infrastructure/Images/loader.gif" alt="loader..." />
                    </span>

                    <span class="done">
                        Done!
                        Failed spec count: <span class="failed-count"></span>
                        Successful spec count: <span class="success-count"></span>
                    </span>
                </div>

                <div class="test-result-container">
                </div>
            </div>
        </section>

        <iframe class="control-container" id="testframe"></iframe>
    </form>

    <asp:PlaceHolder runat="server">
        <%: Scripts.Render("~/bundles/jquery") %>
        <%: Scripts.Render("~/Infrastructure/Scripts/TestUtils/extensionMethods.js") %>
        <%: Scripts.Render("~/Infrastructure/Scripts/TestUtils/NativeEvents.js") %>
        <%: Scripts.Render("~/Infrastructure/Scripts/TestUtils/WaitFor.js") %>
        <%: Scripts.Render("~/Infrastructure/Scripts/TestRunner.js") %>
    </asp:PlaceHolder>
</body>
</html>
