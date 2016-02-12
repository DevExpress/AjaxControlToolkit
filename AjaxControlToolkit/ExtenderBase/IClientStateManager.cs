#pragma warning disable 1591
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

#pragma warning restore 1591