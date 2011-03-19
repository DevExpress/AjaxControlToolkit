<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true"
    CodeBehind="Accordion.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.Accordion.Accordion" %>

<asp:Content ID="Content2" ContentPlaceHolderID="Script" runat="server">
    <script type="text/javascript">
        // Declare variable to refer Controls at test page                
        var dictionaryProperties = null;
        var xmlProperties = null;
        var myAccordionProperties = null;
        var button1 = null;
        var button2 = null;
        var button3 = null;
        var label1 = null;
        var textbox1 = null; 

        /*test cases*/
        module("Array Binding");

        // Tests number of panes inside the accordion control and height of Selected index
        // Set the selected index to the expected index
        asyncTest("Verify array binding", 5, function () {

            waitFor({
                condition: function () {
                    // Get AccordionExtender object for dictionaryBound   
                    dictionaryProperties = $find("dictionaryBound_AccordionExtender");
                    return dictionaryProperties.get_Count() > 0;
                },
                success: function () {
                    equal(dictionaryProperties.get_Count(), 4);
                    checkVisibleStatus(dictionaryProperties, 0);
                    start();
                }
            });

        });

        // Test the behaviour of control at change of selected index
        asyncTest("Change selected index", 4, function () {
            resetTestFrame(function () {

                dictionaryProperties = $find("dictionaryBound_AccordionExtender");
                // Change Selected Index
                dictionaryProperties.set_SelectedIndex(1);

                waitFor({
                    condition: function () {
                        return dictionaryProperties.get_Pane(1).content.offsetHeight > 0;
                    },
                    success: function () {
                        checkVisibleStatus(dictionaryProperties, 1);
                        start();
                    }
                });
            });
        });

        module("Xml Binding");

        // Tests number of panes inside the accordion control and height of Selected index
        // Set the selected index to the expected index
        asyncTest("Verify XML binding", 4, function () {

            waitFor({
                condition: function () {
                    // Get AccordionExtender object for xmlBound
                    xmlProperties = $find("xmlBound_AccordionExtender");
                    return xmlProperties.get_Count() > 3;
                },
                success: function () {
                    equal(xmlProperties.get_Count(), 3);
                    // check expected visible status for default index
                    checkVisibleStatus(xmlProperties, 0);
                    start();
                }
            });

        });

        // Test the behaviour of control at change of selected index
        asyncTest("Change selected index", 3, function () {

            resetTestFrame(function () {

                xmlProperties = $find("xmlBound_AccordionExtender");
                // Change Selected Index        
                xmlProperties.set_SelectedIndex(1);

                waitFor({
                    condition: function () {
                        return xmlProperties.get_Pane(1).content.offsetHeight > 0;
                    },
                    success: function () {
                        checkVisibleStatus(xmlProperties, 1);
                        start();
                    }
                });

            });
        });

        module("My Accordion Binding");

        // Tests number of panes inside the accordion control
        // Number of panes should be equal to expected
        asyncTest('Panes Exist after DataBind()', 1, function () {

            waitFor({
                condition: function () {
                    // Get AccordionExtender object for MyAccordion
                    myAccordionProperties = $find('MyAccordion_AccordionExtender');
                    return myAccordionProperties.get_Count() > 0;
                },
                success: function () {
                    equal(myAccordionProperties.get_Count(), 10);
                    start();
                }
            });

        });

        // Test height and css classname of expected default pane
        // By default first pane should be selected
        asyncTest('Selected Index', 2, function () {

            waitFor({
                condition: function () {
                    // Get AccordionExtender object for MyAccordion
                    myAccordionProperties = $find('MyAccordion_AccordionExtender')
                    return myAccordionProperties.get_Count() > 0;
                },
                success: function () {
                    var height = myAccordionProperties.get_Pane(0).content.offsetHeight;
                    notEqual(height, 0);

                    var cssClassName = myAccordionProperties.get_Pane(0).header.className;
                    equal(cssClassName, 'accordionHeaderSelected');

                    start();
                }
            });

        });

        // Test height and css class name of first pane
        // Change selected index of pane
        asyncTest('Change Selected Index', 2, function () {

            resetTestFrame(function () {

                // Get AccordionExtender object for MyAccordion
                myAccordionProperties = $find('MyAccordion_AccordionExtender');

                //Change Selected Index
                myAccordionProperties.set_SelectedIndex(1);

                waitFor({
                    condition: function () {
                        myAccordionProperties = $find('MyAccordion_AccordionExtender');
                        return myAccordionProperties.get_Pane(1).content.offsetHeight > 0;
                    },
                    success: function () {
                        height = myAccordionProperties.get_Pane(1).content.offsetHeight;
                        notEqual(height, 0);

                        cssClassName = myAccordionProperties.get_Pane(1).header.className;
                        equal(cssClassName, 'accordionHeaderSelected');

                        start();
                    }
                });

            });

        });

        // Test opacity of pane 
        // Set fade transition to true and change selected index
        asyncTest('Fade Transitions', 3, function () {
            resetTestFrame(function () {

                // Get AccordionExtender object for MyAccordion
                myAccordionProperties = $find('MyAccordion_AccordionExtender');
                myAccordionProperties.set_FadeTransitions(true);

                var height = myAccordionProperties.get_Pane(0).content.offsetHeight;
                notEqual(height, 0);

                // Change Selected Index
                myAccordionProperties.set_SelectedIndex(1);

                waitFor({
                    condition: function () {
                        height = myAccordionProperties.get_Pane(1).content.offsetHeight;
                        return height > 0;
                    },
                    success: function () {
                        height = myAccordionProperties.get_Pane(1).content.offsetHeight;
                        notEqual(height, 0);

                        var pane = myAccordionProperties.get_Pane(0);
                        var opacity = 1;
                        if (myAccordionProperties.get_AutoSize() === testFrameWindow().Sys.Extended.UI.AutoSize.Fill) {
                            opacity = testFrameWindow().CommonToolkitScripts.getElementOpacity(pane.content._original);
                        } else {
                            opacity = testFrameWindow().CommonToolkitScripts.getElementOpacity(pane.content);
                        }

                        notEqual(1, opacity);
                        start();
                    }
                });

            });

        });

        //Test AutoSize:None behaviour of Accordion control
        // Change selected index and set AutoSize None for expected
        asyncTest("AutoSize : None", 21, function () {

            resetTestFrame(function () {
                // Get AccordionExtender object for MyAccordion
                myAccordionProperties = $find('MyAccordion_AccordionExtender')
                myAccordionProperties.get_element().style.height = '100px';
                myAccordionProperties.set_AutoSize(testFrameWindow().Sys.Extended.UI.AutoSize.None);

                checkVisibleStatus(myAccordionProperties, 0);

                // Change Selected Index        
                myAccordionProperties.set_SelectedIndex(1);

                waitFor({
                    condition: function () {
                        return myAccordionProperties.get_element().offsetHeight > 0;
                    },

                    success: function () {
                        checkVisibleStatus(myAccordionProperties, 1);
                        ok(myAccordionProperties.get_element().offsetHeight > 100);
                        start();
                    }
                });
            });
        });

        //Test AutoSize:Limit behaviour of Accordion control
        // Change selected index and set AutoSize Limit for expected
        asyncTest("AutoSize : Limit", 21, function () {
            resetTestFrame(function () {
                // Get AccordionExtender object for MyAccordion
                myAccordionProperties = $find('MyAccordion_AccordionExtender');
                myAccordionProperties.get_element().style.height = '299px';
                myAccordionProperties.set_AutoSize(testFrameWindow().Sys.Extended.UI.AutoSize.Limit);

                checkVisibleStatus(myAccordionProperties, 0);

                // Change Selected index
                myAccordionProperties.set_SelectedIndex(1);

                waitFor({
                    condition: function () {
                        return myAccordionProperties.get_element().offsetHeight > 0;
                    },
                    success: function () {
                        checkVisibleStatus(myAccordionProperties, 1);
                        ok(myAccordionProperties.get_element().offsetHeight <= 300, "Accordion should have a height less than or equal to 300, it has " + myAccordionProperties.get_element().offsetHeight);
                        start();
                    }
                });
            });

        });

        //Test AutoSize:Fill behaviour of Accordion control
        // Change selected index and set AutoSize:Fill for expected
        asyncTest("AutoSize : Fill", 21, function () {
            resetTestFrame(function () {
                // Get AccordionExtender object for MyAccordion
                myAccordionProperties = $find('MyAccordion_AccordionExtender');
                myAccordionProperties.get_element().style.height = '499px';
                myAccordionProperties.set_AutoSize(testFrameWindow().Sys.Extended.UI.AutoSize.Fill);

                checkVisibleStatus(myAccordionProperties, 0);

                // Change Selected index
                myAccordionProperties.set_SelectedIndex(1);

                waitFor({
                    condition: function () {
                        return myAccordionProperties.get_element().offsetHeight > 0;
                    },
                    success: function () {
                        checkVisibleStatus(myAccordionProperties, 1);
                        ok(myAccordionProperties.get_element().offsetHeight <= 500, "Accordion should have a height less than or equal to 500, it has " + myAccordionProperties.get_element().offsetHeight);
                        start();
                    }
                });

            });
        });

        //Test Selected index of Accordion control perserve across postbacks
        // Change selected index and trigger post back event for expected
        asyncTest('Indexed perserved on Postback', 21, function () {

            resetTestFrame(function () {
                // Get AccordionExtender object for MyAccordion
                myAccordionProperties = $find('MyAccordion_AccordionExtender');
                checkVisibleStatus(myAccordionProperties, 0);

                // Change Selected index
                myAccordionProperties.set_SelectedIndex(1);
                // fire click event of button to postback the page                
                button1 = $testFrame('#Button1');
                button1.click();

                waitFor({
                    condition: function () {
                        try {
                            myAccordionProperties = $find('MyAccordion_AccordionExtender');
                            return myAccordionProperties.get_Count() > 0;
                        }
                        catch (e) { return false; }
                    },
                    success: function () {
                        checkVisibleStatus(myAccordionProperties, 1);
                        // This assertion makes sure that postback even happens
                        equal($testFrame('#Label1').html(), "Click on button1");
                        start();
                    }
                });

            });

        });


        //Test space between pane is perserved with change in selected index
        // Change selected index for expected
        asyncTest('Space between panes is preserved', 22, function () {

            resetTestFrame(function () {
                // Get AccordionExtender object for MyAccordion
                myAccordionProperties = $find('MyAccordion_AccordionExtender')
                checkVisibleStatus(myAccordionProperties, 0);

                var firstPaneBounds = testFrameWindow().CommonToolkitScripts.getBounds(myAccordionProperties.get_Pane(0).header);
                var secondPaneBounds = testFrameWindow().CommonToolkitScripts.getBounds(myAccordionProperties.get_Pane(1).header);
                notEqual((firstPaneBounds.y + firstPaneBounds.height), secondPaneBounds.y);

                // Change Selected Index
                myAccordionProperties.set_SelectedIndex(1);

                waitFor({
                    condition: function () {
                        return myAccordionProperties.get_Count() > 0;
                    },
                    success: function () {
                        checkVisibleStatus(myAccordionProperties, 1);

                        start();
                    }
                });

                var firstPaneBounds = testFrameWindow().CommonToolkitScripts.getBounds(myAccordionProperties.get_Pane(0).header);
                var secondPaneBounds = testFrameWindow().CommonToolkitScripts.getBounds(myAccordionProperties.get_Pane(1).header);
                notEqual((firstPaneBounds.y + firstPaneBounds.height), secondPaneBounds.y);

            });

        });

        module("Post back events");
        // Test post back event can be raised inside a pane
        // Trigger the click event of button inside pane for expected
        asyncTest("Handle event raised by Button placed inside a pane", 1, function () {
            resetTestFrame(function () {

                button2 = $testFrame('#Button2');
                button2.click();

                waitFor({
                    condition: function () {
                        var labelText = $testFrame('#Label1').html();
                        return labelText === 'button onclick';
                    },
                    success: function () {
                        var labelText = $testFrame('#Label1').html();
                        equal(labelText, 'button onclick');
                        start();
                    }
                });
            });

        });

        // Test bubble event can be raised inside a pane
        // Trigger the click event of button inside pane for expected
        asyncTest("Handle bubbled event raised by Button placed inside a pane", 1, function () {
            resetTestFrame(function () {
                button3 = $testFrame('#Button3');
                button3.click();

                waitFor({
                    condition: function () {
                        var lableHtml = $testFrame('#Label1').html();
                        return lableHtml === 'ItemCommand handled with name Command1 and argument arg1';
                    },
                    success: function () {
                        var lableHtml = $testFrame('#Label1').html();
                        equal(lableHtml, 'ItemCommand handled with name Command1 and argument arg1');
                        start();
                    }
                });
            });
        });

        // Test state of control preserves even after multiple post back events
        // Set value of control and Triggered the click events of buttons
        asyncTest('Preserve state across postbacks - button inside accordion', function () {
            resetTestFrame(function () {
                textbox1 = $testFrame('#TextBox1');
                textbox1.val('text to preserve');

                button2 = $testFrame('#Button2');
                button2.click();

                waitFor({
                    condition: function () {
                        var text = $testFrame('#TextBox1').val();
                        return text === 'text to preserve';
                    },
                    success: function () {
                        equal($testFrame('#TextBox1').val(), 'text to preserve');
                        start();
                    }
                });
            })
        });

        asyncTest('Preserve state across postbacks - button outside accordion', function () {
            resetTestFrame(function () {
                textbox1 = $testFrame('#TextBox1');
                textbox1.val('text to preserve');

                // Fire click event to postback
                button1 = $testFrame('#Button1');
                button1.click();

                waitFor({
                    condition: function () {
                        var text = $testFrame('#TextBox1').val();
                        return text === 'text to preserve';
                    },
                    success: function () {
                        var text = $testFrame('#TextBox1').val();
                        equal(text, 'text to preserve');
                        start();
                    }
                });
            });
        });

        // Test state of control preserves even after multiple post back events
        // Set value of control and Triggered the click events of buttons
        asyncTest('Preserve state of controls placed inside a pane across postback again', function () {

            resetTestFrame(function () {

                textbox1 = $testFrame('#TextBox1');
                textbox1.val('text to preserve');
                // Fire click event to postback
                button1 = $testFrame('#Button1');
                button1.click();

                waitFor({
                    condition: function () {
                        var text = $testFrame('#TextBox1').val();
                        return text === 'text to preserve';
                    },
                    success: function () {
                        equal($testFrame('#TextBox1').val(), 'text to preserve');
                        start();
                    }
                });

            });

        });

        // Helper method
        // Check the height of each pane to check expected pane is visible
        function checkVisibleStatus(accordionExtender, index) {
            var length = accordionExtender.get_Count();

            for (var i = 0; i < length; i++) {
                var height = accordionExtender.get_Pane(i).content.offsetHeight;
                if (i == index) {
                    notEqual(height, 0);
                }
                else {
                    equal(height, 0);
                }
            }
        }        

    </script>
</asp:Content>
