<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true"
    CodeBehind="DropDown.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.DropDown.DropDown" %>

<asp:Content ID="Content2" ContentPlaceHolderID="Script" runat="server">
    <script type="text/javascript">

        // Declare variables to hold references of controls/elements
        var L0;
        var L1;
        var L2;
        var D0;
        var D1;
        var P0;
        var P1;
        var wrapper;

        module("L0");

        // This test check position of mouseover on control
        // for this call mouseover event on control
        asyncTest("Hover", 1, function () {

            // Reset page to its initial position before starting new test
            resetTestFrame(function () {

                // Get reference of object in variable
                D0 = $find("D0");

                // Trigger mouseover event of dropWrapper object of control
                QUnit.triggerEvent(D0._dropWrapper, "mouseover");

                waitFor({
                    condition: function () {
                        return D0.get_isOver();
                    },
                    success: function () {
                        ok(D0.get_isOver(), "Expecting true");
                        start();
                    }
                });

            });

        });

        // This test check position of mouseover on control
        // for this call mouseover event of control
        asyncTest("Unhover", 1, function () {

            // Reset page to its initial position before starting new test
            resetTestFrame(function () {

                // Get reference of object in variable
                D0 = $find("D0");

                // Trigger mouseover event of dropWrapper object of control
                QUnit.triggerEvent(D0._dropWrapper, "mouseout");

                waitFor({
                    condition: function () {
                        return !D0.get_isOver();
                    },
                    success: function () {
                        ok(!D0.get_isOver(), "Expecting false");
                        start();
                    }
                });

            });

        });

        // This test check position of mouseover on control
        // for this call mouseover, click and mouseout event of control
        asyncTest("Click L0, Click Body", 1, function () {

            // Reset page to its initial position before starting new test
            resetTestFrame(function () {

                // Get reference of object in variable
                D0 = $find("D0");

                // Trigger multiple events of dropwrapper object of control
                QUnit.triggerEvent(D0._dropWrapper, "mouseover");
                QUnit.triggerEvent(D0._dropWrapper, "click");
                QUnit.triggerEvent(D0._dropWrapper, "mouseout");

                waitFor({
                    condition: function () {
                        return !D0.get_isOver();
                    },
                    success: function () {
                        ok(!D0.get_isOver(), "Expecting false");
                        start();
                    }
                });

            });
        });

        // This test check dropdown extender is close
        asyncTest("Click Body", 1, function () {

            // Reset page to its initial position before starting new test
            resetTestFrame(function () {

                // check if browser is Internet Explorer 
                if (testFrameWindow().Sys.Browser.agent == testFrameWindow().Sys.Browser.InternetExplorer) {

                    // Get reference of object in variable
                    D0 = $find("D0");

                    // Trigger click event of body/document to close extender drop down.        
                    QUnit.triggerEvent(testFrameWindow().document, "click");

                    waitFor({
                        condition: function () {
                            return !D0.get_isOpen();
                        },
                        success: function () {
                            ok(!D0.get_isOpen(), "Expecting close");
                            start();
                        }
                    });

                }
                else {
                    ok(true, "This test can be run only in IE");
                    start();
                }

            });
        });

        // This test checks if control is open or not 
        // trigger click event twice for expected close behavior of control
        asyncTest("Click L0, Click L0", 1, function () {

            // Reset page to its initial position before starting new test
            resetTestFrame(function () {

                // Get reference of object in variable
                D0 = $find("D0");

                // Trigger multiple events of dropwrapper object of control
                QUnit.triggerEvent(D0._dropWrapper, "mouseover");
                QUnit.triggerEvent(D0._dropWrapper, "click");
                QUnit.triggerEvent(D0._dropWrapper, "click");

                waitFor({
                    condition: function () {
                        return !D0.get_isOpen();
                    },
                    success: function () {
                        ok(!D0.get_isOpen(), "Expecting close");
                        start();
                    }
                });

            });
        });

        // This test checks if control is open or not 
        // trigger mouseover, contextmenu, mouseout event of control and conextmenu event of body 
        // for expected close behavior of control
        asyncTest("Context L0, Context Body", 1, function () {

            // Reset page to its initial position before starting new test
            resetTestFrame(function () {

                // this test can be run only in browser that can raise onContextMenu event i.e. IE
                if (testFrameWindow().Sys.Browser.agent == testFrameWindow().Sys.Browser.InternetExplorer) {

                    // Get reference of object in variable
                    D0 = $find("D0");

                    // Trigger multiple events of dropwrapper object of control
                    QUnit.triggerEvent(D0._dropWrapper, "mouseover");
                    QUnit.triggerEvent(D0._dropWrapper, "contextmenu");
                    QUnit.triggerEvent(D0._dropWrapper, "mouseout");

                    QUnit.triggerEvent(testFrameWindow().document, "contextmenu");

                    waitFor({
                        condition: function () {
                            return !D0.get_isOpen();
                        },
                        success: function () {
                            ok(!D0.get_isOpen(), "Expecting close");
                            start();
                        }
                    });

                }
                else {
                    ok(true, "This test can be run only in IE");
                    start();
                }
            });
        });

        // This test checks control is open or not
        // trigger multiple events on control and contextmenu event of elemet P0 for expected open
        asyncTest("Context L0, Context P0", 1, function () {

            // Reset page to its initial position before starting new test
            resetTestFrame(function () {

                // this test can be run only in browser that can raise onContextMenu event i.e. IE
                if (testFrameWindow().Sys.Browser.agent == testFrameWindow().Sys.Browser.InternetExplorer) {

                    // Get reference of object in variable
                    D0 = $find("D0");
                    P0 = $testFrame("#P0");

                    // Trigger multiple events of dropwrapper object of control
                    QUnit.triggerEvent(D0._dropWrapper, "mouseover");
                    QUnit.triggerEvent(D0._dropWrapper, "contextmenu");
                    QUnit.triggerEvent(D0._dropWrapper, "mouseout");
                    QUnit.triggerEvent(P0, "contextmenu");

                    waitFor({
                        condition: function () {
                            return D0.get_isOpen();
                        },
                        success: function () {
                            ok(D0.get_isOpen(), "Expecting open");
                            start();
                        }
                    });

                }
                else {
                    ok(true, "this test can be run only in browser that can raise onContextMenu event.");
                    start();
                }
            });
        });

        module("L1");

        // This test checks control is open or not
        // trigger mouseover and click events on control for expected open
        asyncTest("Click L1 (wrapper/frame area)", 1, function () {

            // Reset page to its initial position before starting new test
            resetTestFrame(function () {

                // Get reference of object in variable
                D1 = $find("D1");

                // Trigger multiple events of dropwrapper object of control
                QUnit.triggerEvent(D1._dropWrapper, "mouseover");
                QUnit.triggerEvent(D1._dropWrapper, "click");

                waitFor({
                    condition: function () {
                        return D1.get_isOpen();
                    },
                    success: function () {
                        ok(D1.get_isOpen(), "Expecting open");
                        start();
                    }
                });

            });
        });

        // This test checks control is open or not
        // trigger mouseover and click events on controls for expected close
        asyncTest("Click L1 (link)", 1, function () {

            // Reset page to its initial position before starting new test
            resetTestFrame(function () {

                // check if browser is Internet Explorer
                if (testFrameWindow().Sys.Browser.agent == testFrameWindow().Sys.Browser.InternetExplorer) {

                    // Get reference of object in variable
                    D1 = $find("D1");
                    L1 = $testFrame("#L1");

                    // Trigger multiple events
                    QUnit.triggerEvent(D1._dropWrapper, "mouseover");
                    QUnit.triggerEvent(L1, "click");

                    waitFor({
                        condition: function () {
                            return !D1.get_isOpen();
                        },
                        success: function () {
                            ok(!D1.get_isOpen(), "Expecting close");
                            start();
                        }
                    });

                }
                else {
                    ok(true, "this test is running only in IE");
                    start();
                }

            });
        });

        // This test checks control is open or not
        // trigger mouseover and contextmenu events on controls for expected open
        asyncTest("Context L1 (wrapper/frame area)", 1, function () {

            // Reset page to its initial position before starting new test
            resetTestFrame(function () {

                // Get reference of object in variable
                D1 = $find("D1");

                // Trigger events
                QUnit.triggerEvent(D1._dropWrapper, "mouseover");
                QUnit.triggerEvent(D1._dropWrapper, "contextmenu");

                waitFor({
                    condition: function () {
                        return D1.get_isOpen();
                    },
                    success: function () {
                        ok(D1.get_isOpen(), "Expecting open");
                        start();
                    }
                });

            });
        });

        // This test checks control is open or not
        // trigger mouseover and click events on controls for expected close
        asyncTest("Context L1 (link)", 1, function () {

            // Reset page to its initial position before starting new test
            resetTestFrame(function () {

                // check if browser is Internet Explorer
                if (testFrameWindow().Sys.Browser.agent == testFrameWindow().Sys.Browser.InternetExplorer) {

                    // Get reference of object in variable
                    D1 = $find("D1");
                    L1 = $testFrame("#L1");

                    // Trigger events
                    QUnit.triggerEvent(D1._dropWrapper, "mouseover");
                    QUnit.triggerEvent(L1, "contextmenu");

                    waitFor({
                        condition: function () {
                            return !D1.get_isOpen();
                        },
                        success: function () {
                            ok(!D1.get_isOpen(), "Expecting close");
                            start();
                        }
                    });

                }
                else {
                    ok(true, "this test is running only in IE");
                    start();
                }
            });
        });

        module("L2");

        //This test checks parent node of control
        // trigger mouseover event of control and click event of button to postback page and check status of controls.
        asyncTest("Cleanup after UpdatePanel submit", 1, function () {

            // Reset page to its initial position before starting new test
            resetTestFrame(function () {

                // check if browser is Internet Explorer
                if (testFrameWindow().Sys.Browser.agent == testFrameWindow().Sys.Browser.InternetExplorer) {

                    // Get reference of object in variable
                    L2 = $testFrame("#L2");
                    // Trigger events            
                    QUnit.triggerEvent(L2, "mouseover");
                    wrapper = $find("D2")._dropWrapper;
                    var B0 = $testFrame("#B0");
                    B0.click();

                    waitFor({
                        condition: function () {
                            return B0.value == "!";
                        },
                        success: function () {
                            ok(wrapper.parentNode == null || wrapper.parentNode.nodeName == "#document-fragment", "dropWrapper was not detached.");
                            start();
                        }
                    });
                }
                else {
                    ok(true, "this test only run in IE.");
                    start();
                }

            });
        });
    </script>
</asp:Content>
