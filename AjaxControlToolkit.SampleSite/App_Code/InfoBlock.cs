using AjaxControlToolkit;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace InfoBlock {

    public class InfoBlock : CompositeControl {
        const string
            ContentPanelID = "ContentPanel",
            HeaderPanelID = "HeaderPanel",
            ToggleImageID = "ToggleImage",
            CollapseImagePath = "~/Images/collapse.jpg",
            ExpandImagePath = "~/Images/expand.jpg";

        public InfoBlock() {
            Collapsed = true;
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue("")]
        public string Header { get; set; }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [Browsable(false)]
        public ITemplate Content { get; set; }

        [DefaultValue(true)]
        public bool Collapsed { get; set; }

        protected override void CreateChildControls() {
            base.CreateChildControls();

            Controls.Add(CreateHeaderPanel());
            Controls.Add(CreateContentPanel());
            Controls.Add(new CollapsiblePanelExtender {
                TargetControlID = ContentPanelID,
                ExpandControlID = HeaderPanelID,
                CollapseControlID = HeaderPanelID,
                ImageControlID = ToggleImageID,
                ExpandedImage = CollapseImagePath,
                CollapsedImage = ExpandImagePath,
                Collapsed = Collapsed,
                SuppressPostBack = true
            });
        }

        Panel CreateContentPanel() {
            var contentPanel = new Panel();
            contentPanel.ID = ContentPanelID;
            contentPanel.Style[HtmlTextWriterStyle.Overflow] = "hidden";

            Content.InstantiateIn(contentPanel);
            return contentPanel;
        }

        Panel CreateHeaderPanel() {
            var panel = new Panel();
            panel.ID = HeaderPanelID;
            panel.Style[HtmlTextWriterStyle.Cursor] = "pointer";

            var div = new HtmlGenericControl("div");
            div.Attributes["class"] = "heading";

            panel.Controls.Add(div);
            div.Controls.Add(new ImageButton {
                ID = ToggleImageID,
                AlternateText = "collapse",
                ImageUrl = CollapseImagePath
            });
            div.Controls.Add(new Literal { Text = " " + Header });

            return panel;
        }
    }

}