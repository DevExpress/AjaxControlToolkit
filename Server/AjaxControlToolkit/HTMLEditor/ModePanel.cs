using System;
using System.Collections.Generic;
using System.Text;
using AjaxControlToolkit;
using System.Web.UI;
using System.Web.UI.WebControls;

#region [ Resources ]

[assembly: System.Web.UI.WebResource("HTMLEditor.ModePanel.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.ModePanel.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor
{
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.Editor", "HTMLEditor.ModePanel.js")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1012:AbstractTypesShouldNotHaveConstructors")]
    public abstract class ModePanel : ScriptControlBase
    {
        #region [ Constructors ]

        /// <summary>
        /// Initializes a new ModePanel
        /// </summary>
        protected ModePanel(HtmlTextWriterTag tag)
            : base(false, tag)
        {
        }

        #endregion

        #region [ Fields ]

        private EditPanel _editPanel;

        #endregion

        #region [ Methods ]

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            
            Style.Add(HtmlTextWriterStyle.Height, Unit.Percentage(100).ToString());
            Style.Add(HtmlTextWriterStyle.Width, Unit.Percentage(100).ToString());
            Style.Add(HtmlTextWriterStyle.Display, "none");
        }

        internal void setEditPanel(EditPanel editPanel)
        {
            _editPanel = editPanel;
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            if (_editPanel != null)
            {
                descriptor.AddComponentProperty("editPanel", _editPanel.ClientID);
            }
        }

        #endregion
    }
}
