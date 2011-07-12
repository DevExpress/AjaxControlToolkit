using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI.Design;
using System.Web.UI.WebControls;
using System.ComponentModel.Design;

namespace AjaxControlToolkit
{
    // STILL IN RESEARCH MODE
    public class HtmlEditorExtenderDesigner : AjaxControlToolkit.Design.ExtenderControlBaseDesigner<HtmlEditorExtender>
    {
        HtmlEditorExtender ext;
        StringBuilder sbHtmlEditorExtender;
        TextBox targetTextBox;
        StringBuilder sbButtons;

        protected override bool UsePreviewControl
        {
            get { return true; }
        }

        protected void CreateLayout()
        {
            sbHtmlEditorExtender = new StringBuilder();
            targetTextBox = ext.FindControl(ext.TargetControlID) as TextBox;
            if (targetTextBox != null)
            {
                sbHtmlEditorExtender.Append(string.Format("<div style=\"width: {0}px; height: {1}px;\" class=\"unselectable ajax__html_editor_extender_container\" id=\"{3}HtmlEditorExtenderBehavior_ExtenderContainer\">", targetTextBox.Width.Value, targetTextBox.Height.Value, targetTextBox.ID));
                sbHtmlEditorExtender.Append(string.Format("<div class=\"ajax__html_editor_extender_buttoncontainer\" id=\"{0}$HtmlEditorExtenderBehavior_ExtenderButtonContainer\">", targetTextBox.ID));
                sbHtmlEditorExtender.Append(sbButtons.ToString());
                sbHtmlEditorExtender.Append("</div>");
                sbHtmlEditorExtender.Append("</div>");
            }
        }

        public override string GetDesignTimeHtml()
        {            
            //Init();
            //CreateLayout();
            //return sbHtmlEditorExtender.ToString();            
            //return "<div><div>" + sbButtons.ToString() + "</div>Some Contents</div>"; 
            return "<div><div><input type=\"button\" value=\"Bold\" unselectable=\"on\" class=\"ajax__html_editor_extender_button ajax__html_editor_extender_Bold\" style=\"width: 23px; height: 21px;\" title=\"bold\" name=\"bold\" \"></div> some contents here " + ext.ToolbarButtons.Count + " </div>";
        }

        public override string GetDesignTimeHtml(DesignerRegionCollection regions)
        {
             string toolbarHtml = @"<div style='width: 423px; height: 181px;' class='unselectable ajax__html_editor_extender_container'>
                                    <div class='ajax__html_editor_extender_buttoncontainer' >                                         
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_Undo' style='width: 23px; height: 21px;' title='Undo' value='Undo' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_Redo' style='width: 23px; height: 21px;' title='Redo' value='Redo' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_Bold' style='width: 23px; height: 21px;' title='Bold' value='Bold' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_Italic' style='width: 23px; height: 21px;' title='Italic' value='Italic' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_Underline' style='width: 23px; height: 21px;' title='Underline' value='Underline' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_StrikeThrough' style='width: 23px; height: 21px;' title='Strike Through' value='StrikeThrough' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_Subscript' style='width: 23px; height: 21px;' title='Sub Script' value='Subscript' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_Superscript' style='width: 23px; height: 21px;' title='Super Script' value='SuperScript' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_JustifyLeft' style='width: 23px; height: 21px;' title='Justify Left' value='JustifyLeft' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_JustifyCenter' style='width: 23px; height: 21px;' title='Justify Center' value='JustifyCenter' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_JustifyRight' style='width: 23px; height: 21px;' title='Justify Right' value='JustifyRight' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_JustifyFull' style='width: 23px; height: 21px;' title='Justify Full' value='JustifyFull' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_insertOrderedList' style='width: 23px; height: 21px;' title='Insert Ordered List' value='InsertOrderedList' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_insertUnorderedList' style='width: 23px; height: 21px;' title='Insert Unordered List' value='Insert Unordered List' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_createLink' style='width: 23px; height: 21px;' title='Create Link' value='CreateLink' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_UnLink' style='width: 23px; height: 21px;' title='UnLink' value='UnLink' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_RemoveFormat' style='width: 23px; height: 21px;' title='Remove Format' value='RemoveFormat' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_SelectAll' style='width: 23px; height: 21px;' title='Select All' value='SelectAll' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_UnSelect' style='width: 23px; height: 21px;' title='UnSelect' value='UnSelect' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_Delete' style='width: 23px; height: 21px;' title='Delete' value='Delete' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_BackColor' style='width: 23px; height: 21px;' title='Back Color' value='BackColor' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_Indent' style='width: 23px; height: 21px;' title='Indent' value='Indent'  type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_Outdent' style='width: 23px; height: 21px;' title='Outdent' value='Outdent' type='button'>
                                    <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_InsertHorizontalRule' style='width: 23px; height: 21px;' title='Insert Horizontal Rule' value='InsertHorizontalRule' type='button'>
                                    <span class='ajax__html_editor_extender_separator'></span></div>
                                    <div class='ajax__html_editor_extender_texteditor' style='height: 80%; overflow: auto; clear: both;' contenteditable='true'>Hello <b>world1</b></div>
                                   </div>";
//                                    <span unselectable='on' style='background-color: rgb(255, 0, 0); border: 1px solid rgb(194, 194, 194); display: block; float: left;'>
//                                        <input unselectable='on' class='ajax__html_editor_extender_button ajax__html_editor_extender_ForeColor' style='background-color: transparent; width: 21px; height: 19px;' title='Fore Color' type='button'>
//                                    </span>
//                                    <nobr style='float: left; font-size: 11px;'>
//                                        <span style='padding-left: 5px; font-weight: bold;'>Font </span>
//                                        <select unselectable='on' title='Font Name' style='font-size: 11px; font-family: Arial; height: 20px; width: 115px;'>
//                                            <option value='arial,helvetica,sans-serif'>Arial</option><option value='courier new,courier,monospace'>Courier New</option><option value='georgia,times new roman,times,serif'>Georgia</option><option value='tahoma,arial,helvetica,sans-serif'>Tahoma</option><option value='times new roman,times,serif'>Times New Roman</option><option value='verdana,arial,helvetica,sans-serif'>Verdana</option><option value='impact'>Impact</option><option value='wingdings'>WingDings</option>
//                                        </select>
//                                    </nobr>
//                                    <nobr style='float: left; font-size: 11px;'>
//                                        <span style='padding-left: 5px; font-weight: bold;'>Size </span>
//                                        <select unselectable='on' title='Font Size' style='font-size: 11px; font-family: Arial; height: 20px; width: 50px;'>
//                                            <option value='8pt'>1 (8 pt)</option><option value='10pt'>2 (10 pt)</option><option value='12pt'>3 (12 pt)</option><option value='14pt'>4 (14 pt)</option><option value='18pt'>5 (18 pt)</option><option value='24pt'>6 (24 pt)</option><option value='36pt'>7 (36 pt)</option>
//                                        </select>
//                                    </nobr>
                                    
            return toolbarHtml;
            //Init();
            //CreateLayout();
            //return sbHtmlEditorExtender.ToString();
        }

        public override string GetPersistenceContent()
        {
            return "RESEARCH: PERSIST CONTENTS";
        }

        protected override bool Visible
        {
            get { return true; }
        }

        /// <summary>
        /// This method substitutes Initialize(component) because
        /// the underlying calendar control reference is not available
        /// during the Initialize stage. The Init() method substitutes
        /// the Initialize functionality and should be called in the 
        /// GetDesignTimeHtml method so as to get a valid reference
        /// to the Calendar control.
        /// </summary>
        void Init()
        {
            ext = this.Component as HtmlEditorExtender;
            if (ext != null)
            {
                sbButtons = new StringBuilder("");
                
                // check toolbar is customized
                if (ext.Toolbar != null && ext.Toolbar.Count > 0)
                {
                    foreach (HtmlEditorExtenderButton button in ext.Toolbar)
                    {
                        sbButtons.Append(string.Format("<input unselectable=\"on\" class=\"ajax__html_editor_extender_button ajax__html_editor_extender_{0}\" style=\"width: 23px; height: 21px;\" title=\"{0}\" name=\"{0}\" id=\"{1}_HtmlEditorExtender{0}\" type=\"button\">", button.CommandName, ext.TargetControlID));
                    }
                }
                else
                {
                    foreach (HtmlEditorExtenderButton button in ext.ToolbarButtons)
                    {
                        sbButtons.Append(string.Format("<input unselectable=\"on\" class=\"ajax__html_editor_extender_button ajax__html_editor_extender_{0}\" style=\"width: 23px; height: 21px;\" title=\"{0}\" name=\"{0}\" id=\"{1}_HtmlEditorExtender{0}\" type=\"button\">", button.CommandName, ext.TargetControlID));
                    }
                }
            }
        }
    }
}
