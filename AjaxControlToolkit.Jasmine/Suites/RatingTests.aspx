<%@ Page Title="" Language="C#" MasterPageFile="~/Suites/Suite.Master" AutoEventWireup="true" CodeBehind="RatingTests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.RatingTests" %>

<asp:Content ContentPlaceHolderID="TestSuiteName" runat="server">
    Rating
</asp:Content>

<asp:Content ContentPlaceHolderID="TestSuite" runat="server">

    <act:Rating
        ID="TestRating"
        runat="server"
        CurrentRating="0"
        EmptyStarCssClass="A"
        StarCssClass="A"
        FilledStarCssClass="A"
        WaitingStarCssClass="A"
        BehaviorID="RatingBehavior1" />
    <act:Rating
        ID="NumericRating"
        runat="server"
        CurrentRating="2"
        MaxRating="5"
        EmptyStarCssClass="A"
        StarCssClass="A"
        FilledStarCssClass="A"
        WaitingStarCssClass="A"
        BehaviorID="NumericRatingBehavior" />

    <script>
        describe("Rating", function() {
            it("finds Sys.Extended.Deprecated", function() {
                var rating = $find('RatingBehavior1').get_Rating();
                expect(rating).toBe("0");
            });

            it("calls doCallback() with UI param", function() {
                var ratingExtender = $find('NumericRatingBehavior');
                ratingExtender._ratingValue = 1;
                ratingExtender._currentRating = 2;
                spyOn(ratingExtender, "doCallback").and.callFake(function(arg) {
                    return arg;
                });
                ratingExtender._onStarClick();
                expect(ratingExtender.doCallback).toHaveBeenCalledWith(true);
            });

            it("calls doCallback() from UI only once with changed value", function() {
                var ratingExtender = $find('NumericRatingBehavior');
                ratingExtender._ratingValue = 1;
                ratingExtender._currentRating = 2;
                spyOn(ratingExtender, "doCallback");
                ratingExtender._onStarClick();
                expect(ratingExtender.doCallback.calls.count()).toEqual(1);
            });

            it("calls doCallback() from UI only once with unchanged value", function() {
                var ratingExtender = $find('NumericRatingBehavior');
                ratingExtender._ratingValue = 1;
                ratingExtender._currentRating = 1;
                spyOn(ratingExtender, "doCallback");
                ratingExtender._onStarClick();
                expect(ratingExtender.doCallback.calls.count()).toEqual(1);
            });

            it("calls doCallback() from set_rating() only once with changed value", function() {
                var ratingExtender = $find('NumericRatingBehavior');
                ratingExtender._ratingValue = 1;                
                spyOn(ratingExtender, "doCallback");
                ratingExtender.set_rating(2);
                expect(ratingExtender.doCallback.calls.count()).toEqual(1);
            });

            it("does not call doCallback() from set_rating() with unchanged value", function() {
                var ratingExtender = $find('NumericRatingBehavior');
                ratingExtender._ratingValue = 1;
                spyOn(ratingExtender, "doCallback");
                ratingExtender.set_rating(1);
                expect(ratingExtender.doCallback.calls.count()).toEqual(0);
            });
        });
    </script>   
</asp:Content>
