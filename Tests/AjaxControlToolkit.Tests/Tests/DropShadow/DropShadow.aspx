<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true"
    CodeBehind="DropShadow.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.DropShadow.DropShadow" %>

<asp:Content ID="Content2" ContentPlaceHolderID="Script" runat="server">
    <script type="text/javascript">

        // Controls on the page
        var btnGo;
        var DropShadowBehavior;
        
        //Tests the Initial stage of DropShadow
        asyncTest("InitialState", 4, function () {
            resetTestFrame(function () {
                DropShadowBehavior = $find("DropShadowExtender1");                

                waitFor({
                    condition: function () {
                        return DropShadowBehavior != null;
                    },
                    success: function () {
                        equal(DropShadowBehavior.get_Radius(), 10);
                        equal(DropShadowBehavior.get_Opacity(), 1);
                        ok(!DropShadowBehavior.get_Rounded());
                        equal(DropShadowBehavior.get_Width(), 10);
                        start();
                    }
                });

            });

        });

        // Tests the stage of DropShadow after postback 
        // when dropshadow is in update panel.
        asyncTest("postback in update panel", 4, function () {
            resetTestFrame(function () {
                DropShadowBehavior = $find("DropShadowExtender1");

                btnGo = $testFrame("#btn")[0];
                btnGo.click();

                waitFor({
                    condition: function () {
                        return DropShadowBehavior != null;
                    },
                    success: function () {
                        equal(DropShadowBehavior.get_Radius(), 10);
                        equal(DropShadowBehavior.get_Opacity(), 1);
                        ok(!DropShadowBehavior.get_Rounded());
                        equal(DropShadowBehavior.get_Width(), 10);
                        start();
                    }
                });

            });

        });       
                     
    </script>
</asp:Content>
