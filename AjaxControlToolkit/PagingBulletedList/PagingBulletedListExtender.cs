using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [Designer(typeof(PagingBulletedListExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.PagingBulletedListBehavior", Constants.PagingBulletedListName)]
    [TargetControlType(typeof(System.Web.UI.WebControls.BulletedList))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.PagingBulletedListName + Constants.IconPostfix)]
    public class PagingBulletedListExtender : ExtenderControlBase {
        public PagingBulletedListExtender() {
            EnableClientState = true;
        }

        [ExtenderControlProperty()]
        [DefaultValue(1)]
        public int IndexSize {
            get { return GetPropertyValue<int>("IndexSize", 1); }
            set { SetPropertyValue<int>("IndexSize", value); }
        }

        [ExtenderControlProperty()]
        public int? Height {
            get { return GetPropertyValue<int?>("Height", null); }
            set { SetPropertyValue<int?>("Height", value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue(" - ")]
        public string Separator {
            get { return GetPropertyValue<string>("Separator", " - "); }
            set { SetPropertyValue<string>("Separator", value); }
        }

        //When use MaxItemPerPage IndexSize is ignored, index are automaticaly generated
        [ExtenderControlProperty()]
        public int? MaxItemPerPage {
            get { return GetPropertyValue<int?>("MaxItemPerPage", null); }
            set { SetPropertyValue<int?>("MaxItemPerPage", value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue(false)]
        public bool ClientSort {
            get { return GetPropertyValue<bool>("ClientSort", false); }
            set { SetPropertyValue<bool>("ClientSort", value); }
        }

        [ExtenderControlProperty()]
        public string SelectIndexCssClass {
            get { return GetPropertyValue<string>("SelectIndexCssClass", String.Empty); }
            set { SetPropertyValue<string>("SelectIndexCssClass", value); }
        }

        [ExtenderControlProperty()]
        public string UnselectIndexCssClass {
            get { return GetPropertyValue<string>("UnselectIndexCssClass", String.Empty); }
            set { SetPropertyValue<string>("UnselectIndexCssClass", value); }
        }
    }

}
