using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AjaxControlToolkit.Reference.Core.Razor {

    public abstract class PageTemplateBase<T> : TemplateBase {

        public T Model { get; private set; }

        public string ToString(T model) {
            Model = model;
            return base.ToString();
        }
    }

}