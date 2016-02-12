#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Linq;
using System.Web.UI;
using System.Web.UI.Design;

namespace AjaxControlToolkit.Design {

    // 1) Modifying the properties of the TargetProperties objects to remove the "TargetControlID" property and add the Control converter.
    //    We remove "TargetControlID" because the value will be hanging off of the target control's 
    //    properties already so it's confusing/redundant.
    // 2) Modifying the name of the Extender property so it's user-configurable.
    public class ExtenderControlBaseDesigner<T> : ExtenderControlDesigner, IExtenderProvider where T : ExtenderControlBase {

        private const int DisableDesignerFeaturesUnknown = 0;
        private const int DisableDesignerFeaturesYes = 1;
        private const int DisableDesignerFeaturesNo = 2;
        private const string ExtenderControlDictionaryKey = "ExtenderControlFeaturesPresent";

        ExtenderPropertyRenameDescProv<T> _renameProvider;
        private int _disableDesignerFeatures = DisableDesignerFeaturesUnknown;

        protected bool DesignerFeaturesEnabled {
            get {
                // make sure we need to check this.
                if(_disableDesignerFeatures == DisableDesignerFeaturesUnknown) {
                    _disableDesignerFeatures = DisableDesignerFeaturesNo;
                    IDesignerHost host = (IDesignerHost)GetService(typeof(IDesignerHost));

                    // the magic key is on the root components's IDictionaryService.
                    if(host != null) {
                        IComponent rootComponent = host.RootComponent;

                        if(rootComponent != null && rootComponent.Site != null) {
                            IDictionaryService dictionaryService = (IDictionaryService)rootComponent.Site.GetService(typeof(IDictionaryService));

                            // check for the key and set up the state if we find it.
                            if(dictionaryService != null && dictionaryService.GetValue(ExtenderControlDictionaryKey) != null) {
                                _disableDesignerFeatures = DisableDesignerFeaturesYes;
                            }
                        }
                    }
                }

                return (_disableDesignerFeatures == DisableDesignerFeaturesNo);

            }
        }

        // Called to check if we can extend a given control.  We return true if the control has the same ID a
        // our extender control target.
        public bool CanExtend(object extendee) {
            Control extendeeControl = extendee as Control;
            bool canExtend = false;
            if(DesignerFeaturesEnabled && extendeeControl != null) {

                canExtend = (extendeeControl.ID == ExtenderControl.TargetControlID);

                if(canExtend) {
                    if(_renameProvider == null) {
                        // hook up the rename prvider.
                        _renameProvider = new ExtenderPropertyRenameDescProv<T>(this, extendeeControl);
                        TypeDescriptor.AddProvider(_renameProvider, extendeeControl);
                    }
                }
            }
            return canExtend;
        }

        // The ExtenderControl this designer is attached to.
        protected T ExtenderControl {
            get { return Component as T; }
        }

    }

}

#pragma warning restore 1591