using System;
using System.Collections.Generic;
using System.Text;

namespace AjaxControlToolkit {

    public interface IClientStateManager {
        bool SupportsClientState { get; }
        void LoadClientState(string clientState);
        string SaveClientState();
    }

}

