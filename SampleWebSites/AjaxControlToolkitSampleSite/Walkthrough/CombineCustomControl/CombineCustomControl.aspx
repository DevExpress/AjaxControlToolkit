<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true" CodeFile="CombineCustomControl.aspx.cs" Inherits="CombineCustomControl_CombineCustomControl" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<%@ Register TagPrefix="cc1" Namespace="CustomAjaxServerControlSample.StandardWelcomeLabel" Assembly="CustomAjaxServerControlSample" %>

<%@ Register assembly="CustomAjaxServerControlSample" namespace="CustomAjaxServerControlSample.AjaxControlToolkitWelcomeLabel" tagprefix="cc2" %>

<asp:Content ID="Content1" ContentPlaceHolderID="SampleContent" runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnableScriptGlobalization="true"
                                      EnableScriptLocalization="true" ID="ScriptManager1" CombineScripts="True">
        <ControlBundles>
            <ajaxToolkit:ControlBundle Name="CustomControls"/>
        </ControlBundles>
    </ajaxToolkit:ToolkitScriptManager>

    <div class="walkthrough">
        <div class="heading">Bundling Custom Control</div>
        <p>
            <span>
                The purpose of this walk-through is to learn how to put custom controls into an <b>AjaxControlToolkit Control Bundle</b>.
            </span>
        </p>
        <p><br/></p>        
        <p>
            <span>
                This page is demonstrate two identical custom controls. One is a standard ASP.NET Ajax Custom Control and 
                the other is a standard ASP.NET Ajax Custom Control that is using <b>AjaxControlToolkit</b> <b>ClientScriptResourceAttribute</b> and <b>RequiredScriptAttribute</b>
                to register the script references.
            </span>
        </p>
        <div class="heading">Standar Custom Control using ClientScriptResourceAttribute and RequiredScriptAttribute</div>
        <div class="demoarea">
            <b>Demo:</b><br/>
            <cc2:ActWelcomeLabel ID="ActWelcomeLabel1" runat="server">Hello</cc2:ActWelcomeLabel><br /><br />
            <b>Server Side Code:</b><br/>
            <pre style="overflow: scroll">
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit;

[assembly: WebResource("CustomAjaxServerControlSample.AjaxControlToolkitWelcomeLabel.ActWelcomeLabel.js", "text/javascript")]

namespace CustomAjaxServerControlSample.AjaxControlToolkitWelcomeLabel {
    [DefaultProperty("Text")]
    [ToolboxData("&lt;{0}:ActWelcomeLabel runat=server&gt;&lt;/{0}:ActWelcomeLabel&gt;")]
    [RequiredScript(typeof (CommonToolkitScripts))]
    [ClientScriptResource(null, "CustomAjaxServerControlSample.AjaxControlToolkitWelcomeLabel.ActWelcomeLabel.js")]
    public class ActWelcomeLabel : Label, IScriptControl {

        private ScriptManager _scriptManager;

        [Bindable(true),
         Category("Appearance"),
         DefaultValue(""),
         Description("The text to display when the user is not logged in."),
         Localizable(true)]
        public virtual string DefaultUserName {
            get {
                var s = (string) ViewState["DefaultUserName"];
                return s ?? String.Empty;
            }
            set {
                ViewState["DefaultUserName"] = value;
            }
        }

        protected override void RenderContents(HtmlTextWriter writer) {
            writer.WriteEncodedText(Text);

            string displayUserName = DefaultUserName;
            if (Context != null) {
                string userName = Context.User.Identity.Name;
                if (!String.IsNullOrEmpty(userName)) {
                    displayUserName = userName;
                }
            }

            if (!String.IsNullOrEmpty(displayUserName)) {
                writer.Write(", ");
                writer.WriteEncodedText(displayUserName);
            }

            writer.Write("! Please click me.");
        }

        protected override void OnPreRender(EventArgs e) {
            if (!this.DesignMode) {
                // Test for ScriptManager and register if it exists
                _scriptManager = ScriptManager.GetCurrent(Page);

                if (_scriptManager == null)
                    throw new HttpException("A ScriptManager control must exist on the current page.");

                _scriptManager.RegisterScriptControl(this);
            }

            base.OnPreRender(e);
        }

        protected override void Render(HtmlTextWriter writer) {
            if (!this.DesignMode)
                _scriptManager.RegisterScriptDescriptors(this);

            base.Render(writer);
        }

        public IEnumerable&lt;ScriptDescriptor&gt;
            GetScriptDescriptors() {
            var descriptor =
                new ScriptControlDescriptor(
                    "CustomAjaxServerControlSample.AjaxControlToolkitWelcomeLabel.ActWelcomeLabel", this.ClientID);
            yield return descriptor;
        }

        public IEnumerable&lt;ScriptReference&gt;
            GetScriptReferences() {
            yield return
                new ScriptReference("CustomAjaxServerControlSample.AjaxControlToolkitWelcomeLabel.ActWelcomeLabel.js",
                    this.GetType().Assembly.FullName);
        }
    }
}
</pre>
        </div>
        <div class="demobottom"></div>
        <br/>
        <p>
            <span>
                The <b>AjaxControlToolkit Control Bundle</b> only works for scripts that registered by <b>AjaxControlToolkit</b> <b>ClientScriptResourceAttribute</b> or <b>RequiredScriptAttribute</b>.
                You need to register the custom control like in the example above on <b>AjaxControlToolkit.config</b>. In this page we put it at Control Bundle named <b>CustomControls</b> so the <b>AjaxControlToolkit.config</b>
                looks like this:
           
                <pre>
&lt;ajaxControlToolkit&gt;
 &lt;controlBundles&gt;
   &lt;controlBundle name=&quot;CustomControls&quot;&gt;
   &lt;control name=&quot;AjaxControlToolkitWelcomeLabel.ActWelcomeLabel&quot; 
      assembly=&quot;CustomAjaxServerControlSample&quot;&gt;&lt;/control&gt;
 &lt;/controlBundle&gt;
<span>&lt;/ajaxControlToolkit&gt;</span></pre>
            </span>
        </p>
        
        <p>
            <span>
                On your web page, you use the control bundle by defining it on your ToolkitScriptManager like this:
                <pre>
&lt;ajaxToolkit:ToolkitScriptManager runat=&quot;Server&quot; 
  EnableScriptGlobalization=&quot;true&quot; 
  EnableScriptLocalization=&quot;true&quot; 
  ID=&quot;ScriptManager1&quot; 
  CombineScripts=&quot;True&quot;&gt;
  &lt;ControlBundles&gt;
    &lt;ajaxToolkit:ControlBundle Name=&quot;CustomControls&quot;/&gt;
  &lt;/ControlBundles&gt;
&lt;/ajaxToolkit:ToolkitScriptManager&gt;
</pre>
            </span>
        </p>
        <p>
            <span>
                All scripts needed by <b>ActWelcomeLabel</b> will be combined in one combined script reference. If you click View Source on your web browser
                you can find the script reference that should looks like this:
                <pre><span class="webkit-html-tag" style="-webkit-text-stroke-width: 0px; font-family: monospace; font-size: medium; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: auto; word-spacing: 0px;">&lt;script <span class="webkit-html-attribute-name">src</span>=&quot;<a class="webkit-html-attribute-value webkit-html-resource-link" href="../../CombineScriptsHandler.axd?_TSM_CombinedScripts_=True&amp;v=kDHQf8KmDKwi_x8SCZdDKSqFFj_km_g1RljP6Y7UzGs1&amp;_TSM_Bundles_=CustomControls" target="_blank">AjaxControlToolkitSampleSite/ CombineScriptsHandler.axd?_TSM_CombinedScripts_=True&amp;amp;v=kDHQf8KmDKwi_ x8SCZdDKSqFFj_km_g1RljP6Y7UzGs1&amp;amp;_TSM_Bundles_= CustomControls</a>&quot; <span class="webkit-html-attribute-name">type</span>=&quot;<span class="webkit-html-attribute-value">text/javascript</span>&quot;&gt;&lt;/script&gt;</span><span style="-webkit-text-stroke-width: 0px; color: rgb(0, 0, 0); display: inline !important; float: none; font-family: monospace; font-size: medium; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: auto; word-spacing: 0px;"> </span></pre>
                If you open the source of provided link you can see that the content of script for <b>ActWelcomeLabel</b> is there.
            </span>
        </p>
        
        <div class="heading">Standar Custom Control</div>
        <div class="demoarea">
            <b>Demo:</b><br/>
            <cc1:WelcomeLabel ID="WelcomeLabel1" runat="server">Hello</cc1:WelcomeLabel><br /><br />
            <b>Server Side Code:</b><br/>
            <pre style="overflow: scroll">
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: WebResource("CustomAjaxServerControlSample.StandardWelcomeLabel.WelcomeLabel.js", "text/javascript")]

namespace CustomAjaxServerControlSample.StandardWelcomeLabel {

    [DefaultProperty("Text")]
    [ToolboxData("&lt;{0}:WelcomeLabel runat=server&gt;&lt;/{0}:WelcomeLabel&gt;")]
    public class WelcomeLabel : Label, IScriptControl {

        private ScriptManager _scriptManager;

        [Bindable(true),
            Category("Appearance"),
            DefaultValue(""),
            Description("The text to display when the user is not logged in."),
            Localizable(true)]
        public virtual string DefaultUserName {
            get {
                var s = (string) ViewState["DefaultUserName"];
                return s ?? String.Empty;
            }
            set {
                ViewState["DefaultUserName"] = value;
            }
        }

        protected override void RenderContents(HtmlTextWriter writer) {
            writer.WriteEncodedText(Text);

            string displayUserName = DefaultUserName;
            if (Context != null) {
                string userName = Context.User.Identity.Name;
                if (!String.IsNullOrEmpty(userName)) {
                    displayUserName = userName;
                }
            }

            if (!String.IsNullOrEmpty(displayUserName)) {
                writer.Write(", ");
                writer.WriteEncodedText(displayUserName);
            }

            writer.Write("! Please click me.");
        }

        protected override void OnPreRender(EventArgs e) {
            if (!this.DesignMode) {
                // Test for ScriptManager and register if it exists
                _scriptManager = ScriptManager.GetCurrent(Page);

                if (_scriptManager == null)
                    throw new HttpException("A ScriptManager control must exist on the current page.");

                _scriptManager.RegisterScriptControl(this);
            }

            base.OnPreRender(e);
        }

        protected override void Render(HtmlTextWriter writer) {
            if (!this.DesignMode)
                _scriptManager.RegisterScriptDescriptors(this);

            base.Render(writer);
        }

        public IEnumerable&lt;ScriptDescriptor&gt;
            GetScriptDescriptors() {
            var descriptor =
                new ScriptControlDescriptor("CustomAjaxServerControlSample.StandardWelcomeLabel.WelcomeLabel", this.ClientID);
            yield return descriptor;
        }

        public IEnumerable&lt;ScriptReference&gt;
            GetScriptReferences() {
            yield return
                new ScriptReference("CustomAjaxServerControlSample.StandardWelcomeLabel.WelcomeLabel.js", this.GetType().Assembly.FullName);
        }
    }
}
</pre>
        </div>
        <div class="demobottom"></div>
        <br/>
        <p>
            <span>
                This standard custom control will not work with an <b>AjaxControlToolkit Control Bundle</b>. Even if you register the control and assembly in the <b>AjaxControlToolkit.config</b>,
                the ToolkitScriptManager can't recognize the script references needed by this control, since it's not registered using <b>ClientScriptResourceAttribute</b> or <b>RequiredScriptAttribute</b>.
                <br/><br/>
                If you click View Source on your web browser for this page, you can find the script reference for first custom control demo registered independenly.
                It looks like this:               
            </span>
            <pre><span class="webkit-html-tag" style="-webkit-text-stroke-width: 0px; font-family: monospace; font-size: medium; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: auto; word-spacing: 0px;">&lt;script <span class="webkit-html-attribute-name">src</span>=&quot;<a class="webkit-html-attribute-value webkit-html-resource-link" href="../../ScriptResource.axd?d=kra1eBS6ya0j3bYvh-KAPAesigyn82VmaulB375--fzTWWcHEZBU5WydyBrkepXYDzNiz_g1sQvZgUvh5DUkIpYuswHKiBTQLMrbDcXf6SimRnosuvrxBSgANrzcA4zgo43vpyilJWn7m57oQGa4Y9z7nloCSpnA1QHTuRARkMaAyuJnK7HSGymbtNL1b-fXYyF_Xsr04CHEA_YGT1o37g2&amp;t=3cbaff2d" target="_blank">/AjaxControlToolkitSampleSite/ScriptResource.axd?d=kra1...t=3cbaff2d</a>&quot; <span class="webkit-html-attribute-name">type</span>=&quot;<span class="webkit-html-attribute-value">text/javascript</span>&quot;&gt;&lt;/script&gt;</span><span style="-webkit-text-stroke-width: 0px; color: rgb(0, 0, 0); display: inline !important; float: none; font-family: monospace; font-size: medium; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: auto; word-spacing: 0px;"> </span></pre>
        </p>
        <p>
            <span>This happens if you are using third party controls.</span>
        </p>
    </div>
</asp:Content>