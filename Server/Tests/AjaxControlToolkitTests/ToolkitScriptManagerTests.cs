using System;
using System.IO;
using System.Reflection;
using System.Web;
using System.Web.UI;
using Moq;
using NUnit.Framework;

namespace AjaxControlToolkit.Tests
{
    [TestFixture]
    public class ToolkitScriptManagerTests
    {
        private Mock<HttpContextBase> _moqContext;
        private Mock<HttpServerUtilityBase> _moqServer;

        [SetUp]
        [DeploymentItem("TestData\\AjaxControlToolkitIndividualBundles.config")]
        public void Init()
        {
            _moqContext = new Mock<HttpContextBase>();
            _moqServer = new Mock<HttpServerUtilityBase>();
            _moqContext.Setup(s => s.Server).Returns(_moqServer.Object);
            _moqServer.Setup(a => a.MapPath(It.IsAny<string>())).Returns(
                Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location) + "\\AjaxControlToolkitIndividualBundles.config");
        }

        [Test]
        [TestCaseSource("ControlsMap")]
        public void ValidateScriptReferencesTest(Control control, string bundleName) {
            var page = new Page();
            page.Controls.Add(page.LoadControl(control.GetType(), null));

            var toolkit = new ToolkitScriptManager {Page = page};
            toolkit.CombineScriptsHandlerUrl = new Uri("http://acttest.axd"); // avoid error
            toolkit.LoadScriptReferences(_moqContext.Object, new[] {bundleName}, true);
            toolkit.ValidateScriptReferences();
        }

        [Test]
        [ExpectedException(ExpectedMessage = "Could not load control AjaxControlToolkit.AccordionExtender",
            MatchType = MessageMatch.Contains)]
        public void ValidateScriptReferencesFalseTest() {
            var toolkit = new ToolkitScriptManager {Page = new Page()};
            toolkit.Page.Controls.Add(new AccordionExtender());
            toolkit.CombineScriptsHandlerUrl = new Uri("http://acttest.axd"); // avoid error
            toolkit.LoadScriptReferences(_moqContext.Object, new[] {"Twitter"}, true);
            toolkit.ValidateScriptReferences();
        }

        private static object[] ControlsMap = {
            new object[] {new AccordionExtender(), "AccordionExtender"},
            new object[] {new AjaxFileUpload(), "AjaxFileUpload"},
            new object[] {new AlwaysVisibleControlExtender(), "AlwaysVisibleControlExtender"},
            new object[] {new AreaChart(), "AreaChart"},
            new object[] {new AsyncFileUpload(), "AsyncFileUpload"},
            new object[] {new AutoCompleteExtender(), "AutoCompleteExtender"},
            new object[] {new BalloonPopupExtender(), "BalloonPopupExtender"},
            new object[] {new BarChart(), "BarChart"},
            new object[] {new BubbleChart(), "BubbleChart"},
            new object[] {new CalendarExtender(), "CalendarExtender"},
            new object[] {new CascadingDropDown(), "CascadingDropDown"},
            new object[] {new CollapsiblePanelExtender(), "CollapsiblePanelExtender"},
            new object[] {new ColorPickerExtender(), "ColorPickerExtender"},
            new object[] {new ComboBox(), "ComboBox"},
            new object[] {new ConfirmButtonExtender(), "ConfirmButtonExtender"},
            new object[] {new DragPanelExtender(), "DragPanelExtender"},
            new object[] {new DropDownExtender(), "DropDownExtender"},
            new object[] {new DropShadowExtender(), "DropShadowExtender"},
            new object[] {new DynamicPopulateExtender(), "DynamicPopulateExtender"},
            new object[] {new FilteredTextBoxExtender(), "FilteredTextBoxExtender"},
            new object[] {new Gravatar(), "Gravatar"},
            new object[] {new HoverMenuExtender(), "HoverMenuExtender"},
            new object[] {new HTMLEditor.Editor(), "HTMLEditor"},
            new object[] {new HtmlEditorExtender(), "HtmlEditorExtender"},
            new object[] {new LineChart(), "LineChart"},
            new object[] {new ListSearchExtender(), "ListSearchExtender"},
            new object[] {new MaskedEditExtender(), "MaskedEditExtender"},
            new object[] {new ModalPopupExtender(), "ModalPopupExtender"},
            new object[] {new MultiHandleSliderExtender(), "MultiHandleSliderExtender"},
            new object[] {new MutuallyExclusiveCheckBoxExtender(), "MutuallyExclusiveCheckBoxExtender"},
            new object[] {new NoBotExtender(), "NoBotExtender"},
            new object[] {new NumericUpDownExtender(), "NumericUpDownExtender"},
            new object[] {new PagingBulletedListExtender(), "PagingBulletedListExtender"},
            new object[] {new PasswordStrength(), "PasswordStrength"},
            new object[] {new PieChart(), "PieChart"},
            new object[] {new PopupControlExtender(), "PopupControlExtender"},
            new object[] {new RatingExtender(), "RatingExtender"},
            new object[] {new ReorderList(), "ReorderList"},
            new object[] {new ResizableControlExtender(), "ResizableControlExtender"},
            new object[] {new RoundedCornersExtender(), "RoundedCornersExtender"},
            new object[] {new Seadragon(), "Seadragon"},
            new object[] {new SliderExtender(), "SliderExtender"},
            new object[] {new SlideShowExtender(), "SlideShowExtender"},
            new object[] {new TabContainer(), "TabContainer"},
            new object[] {new TextBoxWatermarkExtender(), "TextBoxWatermarkExtender"},
            new object[] {new ToggleButtonExtender(), "ToggleButtonExtender"},
            new object[] {new Twitter(), "Twitter"},
            new object[] {new UpdatePanelAnimationExtender(), "UpdatePanelAnimationExtender"},
            new object[] {new ValidatorCalloutExtender(), "ValidatorCalloutExtender"}
        };        
    }
}
