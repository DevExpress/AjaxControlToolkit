using System;
using System.Web.UI;

public static class AtlasUnitUtil {
    public static void AddScriptReference(Page page, string url) {
        string uniqueUrl = String.Format("{0}?guid={1}", url, Guid.NewGuid().ToString());
        ScriptReference atlasUnitScriptReference = new ScriptReference();
        atlasUnitScriptReference.Path = uniqueUrl;
        ScriptManager.GetCurrent(page).Scripts.Add(atlasUnitScriptReference);
    }
}
