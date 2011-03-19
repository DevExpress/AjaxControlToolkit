<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RatingControl_TestPage.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.RatingControl.RatingControl_TestPage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <style>
        /* RatingControl */
        .ratingStar
        {
            font-size: 0pt;
            width: 13px;
            height: 12px;
            margin: 0px;
            padding: 0px;
            cursor: pointer;
            display: block;
            background-repeat: no-repeat;
        }
        
        .filledRatingStar
        {
            background-image: url(Images/FilledStar.png);
        }
        
        .emptyRatingStar
        {
            background-image: url(Images/EmptyStar.png);
        }
        
        .savedRatingStar
        {
            background-image: url(Images/SavedStar.png);
        }
        /* End-RatingControl */
    </style>
    <script type="text/javascript">
        function onRatingChange(sender, eventArgs) {
            _eventOk = true;
        }

        function onEndClientCallBack(sender, eventArgs) {
            _eventCallBackOk = true;
            _resultFromServerSide = eventArgs.get_CallbackResult();
        }
    </script>

</head>
<body>
    <form id="form1" runat="server">
    <div>
    
            <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server" />
        <act:Rating ID="Rating1" BehaviorID="RatingBehavior1" runat="server" CurrentRating="5"
            MaxRating="10" ReadOnly="false" StarCssClass="ratingStar" WaitingStarCssClass="savedRatingStar"
            FilledStarCssClass="filledRatingStar" EmptyStarCssClass="emptyRatingStar" OnChanged="Rating1_Changed"
            Tag="99">
        </act:Rating>
        <br />
        <act:Rating ID="Rating3" BehaviorID="RatingBehavior3" runat="server" CurrentRating="5"
            MaxRating="10" ReadOnly="false" StarCssClass="ratingStar" WaitingStarCssClass="savedRatingStar"
            FilledStarCssClass="filledRatingStar" EmptyStarCssClass="emptyRatingStar" OnChanged="Rating3_Changed"
            Tag="99" RatingAlign="Vertical" RatingDirection="RightToLeftBottomToTop">
        </act:Rating>
        <act:Rating ID="Rating2" BehaviorID="RatingBehavior2" runat="server" CurrentRating="5"
            MaxRating="10" ReadOnly="false" StarCssClass="ratingStar" WaitingStarCssClass="savedRatingStar"
            FilledStarCssClass="filledRatingStar" EmptyStarCssClass="emptyRatingStar" OnChanged="Rating2_Changed"
            Tag="99" RatingDirection="RightToLeftBottomToTop">
        </act:Rating>
        <act:Rating ID="Rating4" BehaviorID="RatingBehavior4" runat="server" CurrentRating="5"
            MaxRating="10" ReadOnly="false" StarCssClass="ratingStar" WaitingStarCssClass="savedRatingStar"
            FilledStarCssClass="filledRatingStar" EmptyStarCssClass="emptyRatingStar" OnChanged="Rating4_Changed"
            Tag="99" RatingAlign="Vertical">
        </act:Rating>
        <act:Rating ID="Rating5" AutoPostBack="true" BehaviorID="RatingBehavior5" runat="server"
            CurrentRating="5" MaxRating="10" ReadOnly="false" StarCssClass="ratingStar" WaitingStarCssClass="savedRatingStar"
            FilledStarCssClass="filledRatingStar" EmptyStarCssClass="emptyRatingStar" OnChanged="Rating5_Changed">
        </act:Rating>

    </div>
    </form>
</body>
</html>
