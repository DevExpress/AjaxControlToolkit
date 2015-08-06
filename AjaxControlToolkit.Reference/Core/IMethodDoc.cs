using System.Collections.Generic;

namespace AjaxControlToolkit.Reference.Core {

    public interface IMethodDoc {

        IEnumerable<ParamInfo> Params {
            get;
        }
    }
}
