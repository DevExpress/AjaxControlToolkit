


using System;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Attribute used to indicate which scripts of an assembly can be combined by ToolkitScriptManager
    /// </summary>
    /// <remarks>
    /// When this attribute is present, all assembly scripts are combinable by default -
    /// use the ExcludeScripts/IncludeScripts properties to restrict that behavior
    /// </remarks>
    [AttributeUsage(AttributeTargets.Assembly, AllowMultiple = false, Inherited = true)]
    public sealed class ScriptCombineAttribute : Attribute
    {
        /// <summary>
        /// Comma-delimited list of script names to exclude from script combining
        /// </summary>
        /// <remarks>
        /// Overrides IncludeScripts
        /// </remarks>
        public string ExcludeScripts
        {
            get { return _excludeScripts; }
            set { _excludeScripts = value; }
        }
        private string _excludeScripts;

        /// <summary>
        /// Comma-delimited list of script names to include for script combining
        /// </summary>
        /// <remarks>
        /// If absent, all script names are included; if present, only the specified scripts are included
        /// </remarks>
        public string IncludeScripts
        {
            get { return _includeScripts; }
            set { _includeScripts = value; }
        }
        private string _includeScripts;
    }
}
