<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="RatingTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.RatingTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    Rating
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <act:Rating ID="TestRating" runat="server" CurrentRating="0" EmptyStarCssClass="A" StarCssClass="A" FilledStarCssClass="A" WaitingStarCssClass="A" BehaviorID="RatingBehavior1" />

    <script>
        describe("Rating", function() {
            it("finds Sys.Extended.Deprecated", function() {
                var rating = $find('RatingBehavior1').get_Rating();
                expect(rating).toBe("0");
            });
        });
    </script>   
</asp:Content>
