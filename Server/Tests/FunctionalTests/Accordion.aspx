<%@ Page
    Language="C#"
    MasterPageFile="~/Default.master"
    AutoEventWireup="true"
    CodeFile="Accordion.aspx.cs"
    Inherits="Accordion"
    Title="Accordion Tests" %>
<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <asp:Button ID="Button1" runat="server" Text="Button" OnClick="Button1_Click" />
    <asp:Label ID="Label1" runat="server"></asp:Label>
    <br />

    Bound To XML:
    <asp:XmlDataSource ID="xml1" runat="server" DataFile="~/App_Data/CarsService.xml" XPath="/CarsService/make" />
    <aspext:Accordion id="xmlBound" runat="server" DataSourceID="xml1" FadeTransitions="true"
        HeaderCssClass="accordionHeader" ContentCssClass="accordionContent">
        <HeaderTemplate>
            Header: <%# Eval("name") %>
        </HeaderTemplate>
        <ContentTemplate>
            Pane: <%# Eval("name") %>
        </ContentTemplate>
    </aspext:Accordion>
    <br />
    <br />
        
    Bound to dictionary: 
    <aspext:Accordion id="dictionaryBound" runat="server"
        HeaderCssClass="accordionHeader" ContentCssClass="accordionContent">
        <HeaderTemplate>
            Header: <%# Eval("Key") %>
        </HeaderTemplate>
        <ContentTemplate>
            Data: <%# Eval("Value") %>
        </ContentTemplate>
    </aspext:Accordion>
    <br />
    <br />
    
    <aspext:Accordion ID="MyAccordion" runat="server" SelectedIndex="0"
        HeaderCssClass="accordionHeader" ContentCssClass="accordionContent"
        FadeTransitions="true" FramesPerSecond="40" TransitionDuration="100"
        AutoSize="Fill" Height="425px" HeaderSelectedCssClass="accordionHeaderSelected"
        OnItemCreated="MyAccordion_ItemCreated" OnItemCommand="MyAccordion_ItemCommand">
        <Panes>
            <aspext:AccordionPane ID="AccordionPane1" runat="server">
                <Header>This is a test header</Header>
                <Content>
                    This is sample content.<br />It spans a couple of lines.
                    
                    <asp:TextBox runat="server" ID="TextBox1" />
                    
                    <asp:Button ID="Button2" runat="server" Text="Button" OnClick="Button2_Click" />
                    
                    <asp:Button ID="Button3" runat="server" Text="Button" CommandName="Command1" CommandArgument="arg1" />
                </Content>
            </aspext:AccordionPane>
            <aspext:AccordionPane ID="AccordionPane2" runat="server">
                <Header>This is a test header</Header>
                <Content>
                    This is sample content.<br />It spans a couple of lines.
                </Content>
            </aspext:AccordionPane>
            <aspext:AccordionPane ID="AccordionPane3" runat="server">
                <Header>This is a test header</Header>
                <Content>
                    This is sample content.<br />It spans a couple of lines.
                </Content>
            </aspext:AccordionPane>
            <aspext:AccordionPane ID="AccordionPane4" runat="server">
                <Header>This is a test header</Header>
                <Content>
                    This is sample content.<br />It spans a couple of lines.
                </Content>
            </aspext:AccordionPane>
            <aspext:AccordionPane ID="AccordionPane5" runat="server">
                <Header>This is a test header</Header>
                <Content>
                    This is sample content.<br />It spans a couple of lines.
                </Content>
            </aspext:AccordionPane>
            <aspext:AccordionPane ID="AccordionPane6" runat="server">
                <Header>This is a test header</Header>
                <Content>
                    This is sample content.<br />It spans a couple of lines.
                </Content>
            </aspext:AccordionPane>
            <aspext:AccordionPane ID="AccordionPane7" runat="server">
                <Header>This is a test header</Header>
                <Content>
                    This is sample content.<br />It spans a couple of lines.
                </Content>
            </aspext:AccordionPane>
            <aspext:AccordionPane ID="AccordionPane8" runat="server">
                <Header>This is a test header</Header>
                <Content>
                    This is sample content.<br />It spans a couple of lines.
                </Content>
            </aspext:AccordionPane>
            <aspext:AccordionPane ID="AccordionPane9" runat="server">
                <Header>This is a test header</Header>
                <Content>
                    This is sample content.<br />It spans a couple of lines.
                </Content>
            </aspext:AccordionPane>
            <aspext:AccordionPane ID="AccordionPane10" runat="server">
                <Header>This is a test header</Header>
                <Content>
                    This is sample content.<br />It spans a couple of lines.
                </Content>
            </aspext:AccordionPane>
        </Panes>
    </aspext:Accordion>
    <br />
    <br />
    

    <script type="text/javascript">
        // Script objects that should be loaded before we run
        var typeDependencies = ['Sys.Extended.UI.AccordionBehavior'];
        
        // Reference to the Test Harness
        var testHarness = null;
    
        // Controls in the test page
        var accordion = null;
        var boundAccordion = null;
        var xmlAccordion = null;
        var behavior = null;
        var btn = null;
        var btn2 = null;
        var btn3 = null;
        var label1 = null;
        var textbox1 = null;
        
        function setSelectedIndex(behavior, index) {
            return function() {
                behavior.set_SelectedIndex(index);
            };
        }
        
        function checkVisibility(behavior, expectedSelected) {
            return function() {
                var length = behavior.get_Count();
                for (var i = 0; i < length; i++) {
                    var height = behavior.get_Pane(i).content.offsetHeight;
                    if (i == expectedSelected) {
                        testHarness.assertNotEqual(height, 0, 'Height of pane ' + i + ' should not be 0');
                    } else {
                        testHarness.assertEqual(height, 0, 'Height of pane ' + i + ' is ' + height + ', not 0');
                    }
                }
            }
        }

        function checkHeaderCSS(behavior, expectedCSS) {
            return function() {
                var selectedIndex = behavior.get_SelectedIndex();
                var cssClass = behavior.get_Pane(selectedIndex).header.className;
                testHarness.assertEqual(cssClass, expectedCSS, 'Css class should be ' + expectedCSS + ' but it is ' + cssClass);
            }
        }
        
        function checkOpacity(behavior, index) {
            return function() {
                var pane = behavior.get_Pane(index);
                var opacity = 1;
                if (behavior.get_AutoSize() === Sys.Extended.UI.AutoSize.Fill) {
                    opacity = CommonToolkitScripts.getElementOpacity(pane.content._original);
                } else {
                    opacity = CommonToolkitScripts.getElementOpacity(pane.content);
                }
                testHarness.assertNotEqual(1, opacity);
            }
        }
        
        // Register the AlwaysVisibleControl test cases
        function registerTests(harness) {
            testHarness = harness;

            // Get the controls on the page
            accordion = testHarness.getElement("ctl00_ContentPlaceHolder1_MyAccordion");
            behavior = testHarness.getObject("<%= MyAccordion.ClientID %>_AccordionExtender");
            btn = testHarness.getElement('ctl00_ContentPlaceHolder1_Button1');
            btn2 = testHarness.getElement('ctl00_ContentPlaceHolder1_AccordionPane1_content_Button2');
            btn3 = testHarness.getElement('ctl00_ContentPlaceHolder1_AccordionPane1_content_Button3');
            boundAccordion = testHarness.getElement("ctl00_ContentPlaceHolder1_dictionaryBound");
            var boundProperties = testHarness.getObject("<%= dictionaryBound.ClientID %>_AccordionExtender");
            xmlAccordion = testHarness.getElement("ctl00_ContentPlaceHolder1_xmlBound");
            var xmlProperties = testHarness.getObject("<%= xmlBound.ClientID %>_AccordionExtender");
            label1 = testHarness.getElement("ctl00_ContentPlaceHolder1_Label1");
            textbox1 = testHarness.getElement("ctl00_ContentPlaceHolder1_AccordionPane1_content_TextBox1");
           
            
            var test = testHarness.addTest("Verify array binding");            
            test.addStep(function(){ testHarness.assertEqual(4, boundProperties.get_Count(), "Expected 4 panes in array bound Accordion, got " + boundProperties.get_Count())});
            test.addStep(checkVisibility(boundProperties, 0));
            test.addStep(setSelectedIndex(boundProperties, 1), function() { try { checkVisibility(boundProperties, 1)(); return true; } catch(ex) { return false; } }, 500, 5000);
                       
            var test = testHarness.addTest("Verify XML binding");                    
            test.addStep(checkVisibility(xmlProperties, 0));
            test.addStep(function(){testHarness.assertEqual(3, xmlProperties.get_Count(), "Expected 3 panes in XML bound Accordion, got " + xmlProperties.get_Count());});
            test.addStep(setSelectedIndex(xmlProperties, 1), function() { try { checkVisibility(xmlProperties, 1)(); return true; } catch(ex) { return false; } }, 500, 5000);
            
            var test = testHarness.addTest('Panes Exist after DataBind()');
            test.addStep(function(){testHarness.assertEqual(10, behavior.get_Count(), "Expected 10 panes in unbound Accordion, got " + behavior.get_Count());});
            
            var test = testHarness.addTest('Selected Index');
            test.addStep(checkVisibility(behavior, 0));
            test.addStep(checkHeaderCSS(behavior, 'accordionHeaderSelected'));
            
            var test = testHarness.addTest('Change Panes');
            test.addStep(checkVisibility(behavior, 0));
            test.addStep(setSelectedIndex(behavior, 1), function() { try { checkVisibility(behavior, 1)(); return true; } catch(ex) { return false; } }, 500, 5000);
            test.addStep(checkHeaderCSS(behavior, 'accordionHeaderSelected'));
            
            var test = testHarness.addTest('Fade Transitions');
            test.addStep(function() { behavior.set_FadeTransitions(true); });
            test.addStep(checkVisibility(behavior, 0));
            test.addStep(setSelectedIndex(behavior, 1), function() { try { checkVisibility(behavior, 1)(); return true; } catch(ex) { return false; } }, 500, 5000);
            test.addStep(checkOpacity(behavior, 0));
            
            var test = testHarness.addTest('AutoSize: None');             
            test.addStep(function() { behavior.get_element().style.height = '100px'; behavior.set_AutoSize(Sys.Extended.UI.AutoSize.None);});
            test.addStep(checkVisibility(behavior, 0));
            test.addStep(setSelectedIndex(behavior, 1), function() { try { checkVisibility(behavior, 1)(); return true; } catch(ex) { return false; } }, 500, 5000);
            test.addStep(function() { testHarness.assertTrue(behavior.get_element().offsetHeight > 100, 'Accordion should have a height greater than 100, it has ' +  behavior.get_element().offsetHeight); });
            
            var test = testHarness.addTest('AutoSize: Limit');             
            test.addStep(function() { behavior.get_element().style.height = '299px'; behavior.set_AutoSize(Sys.Extended.UI.AutoSize.Limit);});
            test.addStep(checkVisibility(behavior, 0));
            test.addStep(setSelectedIndex(behavior, 1), function() { try { checkVisibility(behavior, 1)(); return true; } catch(ex) { return false; } }, 500, 5000);
            test.addStep(function() { testHarness.assertTrue(behavior.get_element().offsetHeight <= 300, 'Accordion should have a height less than or equal to 300, not ' + behavior.get_element().offsetHeight); });
            
            var test = testHarness.addTest('AutoSize: Fill');             
            test.addStep(function() { behavior.get_element().style.height = '499px'; behavior.set_AutoSize(Sys.Extended.UI.AutoSize.Fill);});
            test.addStep(checkVisibility(behavior, 0));
            test.addStep(setSelectedIndex(behavior, 1), function() { try { checkVisibility(behavior, 1)(); return true; } catch(ex) { return false; } }, 500, 5000);
            test.addStep(function() { testHarness.assertTrue(behavior.get_element().offsetHeight <= 500, 'Accordion should have a height equal to 500, not ' + behavior.get_element().offsetHeight); });            
            
            var test = testHarness.addTest('Index preserved on Postback');
            test.addStep(checkVisibility(behavior, 0));
            test.addStep(setSelectedIndex(behavior, 1), function() { try { checkVisibility(behavior, 1)(); return true; } catch(ex) { return false; } }, 500, 5000);
            test.addPostBack(btn);
            test.addStep(checkVisibility(behavior, 1));

            var test = testHarness.addTest('Space between panes is preserved');
            test.addStep(checkVisibility(behavior, 0));
            test.addStep(setSelectedIndex(behavior, 1), function() { try { checkVisibility(behavior, 1)(); return true; } catch (ex) { return false; } }, 500, 5000);
            test.addStep(function() {
                var selectedIndex = behavior.get_SelectedIndex();
                var firstPaneBounds = $common.getBounds(behavior.get_Pane(0).header);
                var secondPaneBounds = $common.getBounds(behavior.get_Pane(1).header);

                testHarness.assertNotEqual((firstPaneBounds.y + firstPaneBounds.height), secondPaneBounds.y, 'The space between the panes is not preserved.');
            });

            var test = testHarness.addTest('Handle event raised by Button placed inside a pane');
            test.addPostBack(btn2);
            test.addStep(function() { testHarness.assertEqual(label1.innerHTML, 'button onclick', 'Events raised by buttons placed inside a pane are not handled server-side.') });

            var test = testHarness.addTest('Handle bubbled event raised by Button placed inside a pane');
            test.addPostBack(btn3);
            test.addStep(function() {
                testHarness.assertEqual(label1.innerHTML,
                    'ItemCommand handled with name Command1 and argument arg1',
                    'Events raised by buttons placed inside a pane are not handled server-side.');
            });

            var test = testHarness.addTest('Preserve state of controls placed inside a pane across postbacks');
            test.addStep(function() { textbox1.value = 'text to preserve'; });
            test.addPostBack(btn2);
            test.addStep(function() {
                testHarness.assertEqual(textbox1.value,
                    'text to preserve',
                    'The state of the controls placed inside a pane is not kept across postbacks.');
            });
            test.addPostBack(btn);
            test.addStep(function() {
                testHarness.assertEqual(textbox1.value,
                    'text to preserve',
                    'The state of the controls placed inside a pane is not kept across postbacks.');
            });
        }                    
    </script>
</asp:Content>