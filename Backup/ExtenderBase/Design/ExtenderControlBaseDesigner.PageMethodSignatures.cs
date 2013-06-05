

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Globalization;
using System.Reflection;
using System.Web.UI.Design;
using System.Web.Services;
using System.Web.Script.Services;
using System.Windows.Forms;

namespace AjaxControlToolkit.Design
{
    /// <summary>
    /// Designer support for adding and navigating to page methods
    /// </summary>
    public partial class ExtenderControlBaseDesigner<T> : ExtenderControlDesigner, System.ComponentModel.IExtenderProvider
        where T : ExtenderControlBase
    {
        /// <summary>
        /// Action lists including the PageMethodDesignerActionList
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override DesignerActionListCollection ActionLists
        {
            get
            {
                // Add the page methods
                if (_actionLists == null)
                {
                    // Start with the original list
                    _actionLists = new DesignerActionListCollection();
                    _actionLists.AddRange(base.ActionLists);

                    // Look for delegates on the designer with PageMethodSignature attributes
                    foreach (Type delegateType in GetType().GetNestedTypes(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Static))
                    {
                        if (!delegateType.IsSubclassOf(typeof(Delegate)))
                        {
                            continue;
                        }

                        PageMethodSignatureAttribute attribute = Attribute.GetCustomAttribute(delegateType, typeof(PageMethodSignatureAttribute)) as PageMethodSignatureAttribute;
                        if (attribute == null)
                        {
                            continue;
                        }

                        MethodInfo signature = delegateType.GetMethod("Invoke");
                        if (signature == null)
                        {
                            continue;
                        }

                        // Add the page method
                        _actionLists.Add(new PageMethodDesignerActionList(Component, signature, attribute));
                    }
                }
                return _actionLists;
            }
        }
        private DesignerActionListCollection _actionLists;


        /// <summary>
        /// Action list for a page method
        /// </summary>
        private class PageMethodDesignerActionList : DesignerActionList
        {
            /// <summary>
            /// Method signature of the page method
            /// </summary>
            private MethodInfo _signature;

            /// <summary>
            /// Attribute describing properties of the page method
            /// </summary>
            private PageMethodSignatureAttribute _attribute;

            /// <summary>
            /// Constructor
            /// </summary>
            /// <param name="component">Component the action list is associated with</param>
            /// <param name="signature">Method signature of the page method</param>
            /// <param name="attribute">Attribute describing properties of the page method</param>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            public PageMethodDesignerActionList(IComponent component, MethodInfo signature, PageMethodSignatureAttribute attribute)
                : base(component)
            {
                _signature = signature;
                _attribute = attribute;
            }

            /// <summary>
            /// Add the page method
            /// </summary>
            /// <returns></returns>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            public override DesignerActionItemCollection GetSortedActionItems()
            {
                DesignerActionItemCollection items = new DesignerActionItemCollection();

                // Don't add the item if there's a service path specified or we can't get the event binding service
                PropertyDescriptor pagePathProperty = TypeDescriptor.GetProperties(Component)[_attribute.ServicePathProperty];
                if ((pagePathProperty == null || (pagePathProperty != null && string.IsNullOrEmpty(pagePathProperty.GetValue(Component) as string))) && (GetService(typeof(IEventBindingService)) != null))
                {
                    string name = string.Format(CultureInfo.CurrentCulture, "Add {0} page method", _attribute.FriendlyName);
                    items.Add(new DesignerActionMethodItem(this, "AddPageMethod", name, "Page Methods", name, true));
                }

                return items;
            }

            /// <summary>
            /// Add the code for the page method
            /// </summary>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes", Justification = "Reporting all exceptions as errors")]
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity", Justification = "Method is neccesarily complex")]
            private void AddPageMethod()
            {
                try
                {
                    // Reset to the default name of the page method
                    string name = _signature.DeclaringType.Name;

                    // Ensure we don't have a ServicePath set
                    PropertyDescriptor pagePathProperty = TypeDescriptor.GetProperties(Component)[_attribute.ServicePathProperty];
                    if (pagePathProperty != null)
                    {
                        string servicePath = pagePathProperty.GetValue(Component) as string;
                        if (!string.IsNullOrEmpty(servicePath))
                        {
                            ShowMessage(string.Format(CultureInfo.CurrentCulture, "Cannot create page method \"{0}\" because the extender is using web service \"{1}\" instead!", name, servicePath));
                            return;
                        }
                    }
                    
                    // Optionally set UseContextKey to true
                    if (_attribute.IncludeContextParameter)
                    {
                        PropertyDescriptor useContextKeyProperty = TypeDescriptor.GetProperties(Component)[_attribute.UseContextKeyProperty];
                        if (useContextKeyProperty != null)
                        {
                            useContextKeyProperty.SetValue(Component, true);
                        }
                    }
                    
                    // Open the code for the page
                    IEventBindingService bindingService;
                    if (!EnsureService(out bindingService))
                    {
                        return;
                    }
                    bindingService.ShowCode();

                    // Load the automation service
                    object _dte = GetService(ReferencedAssemblies.EnvDTE.GetType("EnvDTE._DTE"));
                    if (_dte == null)
                    {
                        ShowMessage(string.Format(CultureInfo.CurrentCulture, "Cannot create page method \"{0}\" because {1} could not be acquired!", _signature.DeclaringType.Name, "EnvDTE._DTE"));
                        return;
                    }
                    DTE2 automation = new DTE2(_dte);

                    try
                    {
                        // Get the CodeModel for the file
                        FileCodeModel2 fileCodeModel = LoadFileCodeModel(automation.ActiveDocument.ProjectItem);
                        if (fileCodeModel == null || fileCodeModel.Reference == null)
                        {
                            ShowMessage(string.Format(CultureInfo.CurrentCulture, "Cannot create page method \"{0}\" because no CodeBehind or CodeFile file was found!", name));
                            return;
                        }

                        // Get the class for the page
                        IDesignerHost host;
                        if (!EnsureService(out host))
                        {
                            return;
                        }
                        CodeClass2 classModel = FindClass(fileCodeModel, host.RootComponentClassName);
                        if (classModel == null || classModel.Reference == null)
                        {
                            ShowMessage(string.Format(CultureInfo.CurrentCulture, "Cannot create page method \"{0}\" because no CodeBehind or CodeFile file was found!", name));
                            return;
                        }

                        // Either set the ServiceMethod to the default name, or use an existing value to look it up
                        PropertyDescriptor pageMethodProperty = TypeDescriptor.GetProperties(Component)[_attribute.ServiceMethodProperty];
                        if (pageMethodProperty != null)
                        {
                            string value = pageMethodProperty.GetValue(Component) as string;
                            if (!string.IsNullOrEmpty(value))
                            {
                                // Use the existing value as the name
                                name = value;
                            }
                            else
                            {
                                // Ensure we get a unique name when use the default value
                                string defaultName = name;
                                int i = 2;
                                while (FindMethod(classModel, name, _signature) != null)
                                {
                                    name = defaultName + i++;
                                }

                                // Set the value to the default name
                                pageMethodProperty.SetValue(Component, name);
                            }
                        }

                        // Get the UndoContext for the currently open document
                        // (since creating a DesignerTransaction will refer to the aspx page,
                        // not the code behind that we opened)
                        UndoContext undo = automation.UndoContext;
                        if (undo != null && undo.Reference != null && undo.IsOpen)
                        {
                            undo = null;
                        }
                        try
                        {
                            CodeFunction2 method = FindMethod(classModel, name, _signature);
                            if (method != null && method.Reference != null)
                            {
                                if (PageMethodNeedsRepair(method) && (ShowMessage(string.Format(CultureInfo.CurrentCulture, "Would you like to repair the existing page method \"{0}\"?", name), MessageBoxButtons.YesNo) == DialogResult.Yes))
                                {
                                    // Repair an existing page method
                                    if (undo != null)
                                    {
                                        undo.Open(string.Format(CultureInfo.CurrentCulture, "Repair \"{0}\" page method", name), false);
                                    }
                                    RepairPageMethod(method);
                                }
                            }
                            else
                            {
                                // Create a new page method
                                if (undo != null)
                                {
                                    undo.Open(string.Format(CultureInfo.CurrentCulture, "Add \"{0}\" page method", name), false);
                                }
                                CreatePageMethod(classModel, name);
                            }
                        }
                        finally
                        {
                            if (undo != null && undo.IsOpen)
                            {
                                undo.Close();
                            }
                        }
                    }
                    finally
                    {
                        UnloadWebProjectItem(automation.ActiveDocument.ProjectItem);
                    }
                }
                catch (Exception ex)
                {
                    ShowMessage(string.Format(CultureInfo.CurrentCulture, "Unexpected error ({0}): {1}{2}{3}", ex.GetType().Name, ex.Message, Environment.NewLine, ex.StackTrace));
                }
            }

            /// <summary>
            /// Get a valid reference to a required service
            /// </summary>
            /// <typeparam name="S">Type of the service</typeparam>
            /// <param name="service">Value of the service to be assigned</param>
            /// <returns>True if the service was found, false otherwise</returns>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            private bool EnsureService<S>(out S service) where S : class
            {
                service = GetService(typeof(S)) as S;
                if (service == null)
                {
                    ShowMessage(string.Format(CultureInfo.CurrentCulture, "Cannot create page method \"{0}\" because {1} could not be acquired!", _signature.DeclaringType.Name, typeof(S).Name));
                    return false;
                }
                return true;
            }

            /// <summary>
            /// Show a message
            /// </summary>
            /// <param name="message">Message</param>
            /// <param name="buttons">Buttons</param>
            /// <returns>Result</returns>
            private static DialogResult ShowMessage(string message)
            {
                return ShowMessage(message, MessageBoxButtons.OK);
            }

            /// <summary>
            /// Show a message
            /// </summary>
            /// <param name="message">Message</param>
            /// <param name="buttons">Buttons</param>
            /// <returns>Result</returns>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1300:SpecifyMessageBoxOptions", Justification = "Messages are not localized")]
            private static DialogResult ShowMessage(string message, MessageBoxButtons buttons)
            {
                return MessageBox.Show(message, "Ajax Control Toolkit", buttons);
            }

            /// <summary>
            /// Find the CodeModel node for a given class
            /// </summary>
            /// <param name="model">FileCodeModel containing the class</param>
            /// <param name="name">Name of the class</param>
            /// <returns>CodeModel node for the class, or null if not found</returns>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            private static CodeClass2 FindClass(FileCodeModel2 model, string name)
            {
                // Create a queue to "recurse" through all the child elements of the file
                Queue<CodeElement2> remaining = new Queue<CodeElement2>();

                // Start with the top level elements
                foreach (object element in model.CodeElements)
                {
                    remaining.Enqueue(new CodeElement2(element));
                }

                // "Recurse" through their children
                while (remaining.Count > 0)
                {
                    CodeElement2 element = remaining.Dequeue();
                    
                    // Ignore anything that isn't a type or a namespace
                    if (element == null || element.Reference == null || (!element.IsCodeType && element.Kind != vsCMElement.vsCMElementNamespace))
                    {
                        continue;
                    }

                    // If it's a class with a matching name, return it
                    if ((element.Kind == vsCMElement.vsCMElementClass) && (string.CompareOrdinal(element.FullName, name) == 0))
                    {
                        return new CodeClass2(element.Reference);
                    }

                    // Add any children of the type
                    if (element.Children != null)
                    {
                        foreach (object child in element.Children)
                        {
                            remaining.Enqueue(new CodeElement2(child));
                        }
                    }
                }

                // Return null if we couldn't find a node corresponding to the class name
                return null;
            }

            /// <summary>
            /// Find all CodeFunctions that correspond to overloads of a method with a given name
            /// </summary>
            /// <param name="classModel">Class to search for the methods</param>
            /// <param name="name">Name of the methods</param>
            /// <returns>Array of CodeFunctions representing the method overloads defined in the class</returns>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            private static CodeFunction2[] FindMethods(CodeClass2 classModel, string name)
            {
                List<CodeFunction2> methods = new List<CodeFunction2>();
                foreach (object child in classModel.Children)
                {
                    CodeElement2 element = new CodeElement2(child);
                    if ((element.Reference == null) || (element.Kind != vsCMElement.vsCMElementFunction))
                    {
                        continue;
                    }

                    if (string.CompareOrdinal(element.Name, name) == 0)
                    {
                        methods.Add(new CodeFunction2(child));
                    }
                }
                return methods.ToArray();
            }

            /// <summary>
            /// Find a CodeFunction that corresponds to a specific overload of a method
            /// </summary>
            /// <param name="classModel">Class to search for the method</param>
            /// <param name="name">Name of the method</param>
            /// <param name="signature">Signature of the method</param>
            /// <returns>The CodeFunction representing the method if found, null if not found</returns>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            private static CodeFunction2 FindMethod(CodeClass2 classModel, string name, MethodInfo signature)
            {
                ParameterInfo[] parameters = signature.GetParameters();
                
                // Check each of the overloads to see if we have a matching signature
                foreach (CodeFunction2 method in FindMethods(classModel, name))
                {
                    if (method == null || method.Reference == null)
                    {
                        continue;
                    }

                    // Check the return type
                    if (!AreSameType(method.Type, signature.ReturnType))
                    {
                        continue;
                    }

                    // Check the number of parameters
                    if (method.Parameters.Count != parameters.Length)
                    {
                        continue;
                    }

                    // Check the types of each parameter
                    bool failed = false;
                    int i = 0;
                    foreach (object p in method.Parameters)
                    {
                        CodeParameter2 parameter = new CodeParameter2(p);
                        if ((parameter.Reference == null) || !AreSameType(parameter.Type, parameters[i++].ParameterType))
                        {
                            failed = true;
                            break;
                        }
                    }
                    if (!failed)
                    {
                        return method;
                    }
                }

                // Return null if no matching signature was found
                return null;
            }

            /// <summary>
            /// Convert a type's name into a valid CodeTypeRef name
            /// </summary>
            /// <param name="t">Type</param>
            /// <returns>Name</returns>
            private static string CreateCodeTypeRefName(Type t)
            {
                return t.FullName.Replace('+', '.');
            }

            /// <summary>
            /// Determine whether a CodeTypeRef is describing a particular type
            /// </summary>
            /// <param name="modelType">CodeTypeRef</param>
            /// <param name="type">Type</param>
            /// <returns>True if they're describing the same type, false otherwise</returns>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            private static bool AreSameType(CodeTypeRef modelType, Type type)
            {
                if (modelType == null || modelType.Reference == null)
                {
                    return type == null;
                }
                // If we have an array, verify its rank and element type matches
                else if (modelType.TypeKind == vsCMTypeRef.vsCMTypeRefArray)
                {
                    if (!type.IsArray)
                    {
                        return false;
                    }

                    if (modelType.Rank != type.GetArrayRank())
                    {
                        return false;
                    }
                    
                    return AreSameType(modelType.ElementType, type.GetElementType());
                }
                // If we have a reference type, verify the reference matches
                else if (modelType.TypeKind == vsCMTypeRef.vsCMTypeRefPointer)
                {
                    if (!type.IsPointer)
                    {
                        return false;
                    }

                    return AreSameType(modelType.ElementType, type.GetElementType());
                }
                // Match simple types based on their names
                else
                {
                    return string.CompareOrdinal(modelType.AsFullName, CreateCodeTypeRefName(type)) == 0;
                }
            }

            /// <summary>
            /// Create the page method
            /// </summary>
            /// <param name="classModel">Class to contain the method</param>
            /// <param name="name">Name of the method</param>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            private void CreatePageMethod(CodeClass2 classModel, string name)
            {
                ParameterInfo[] parameters = _signature.GetParameters();
                CodeFunction2 method = classModel.AddFunction(name, vsCMFunction.vsCMFunctionFunction, CreateCodeTypeRefName(_signature.ReturnType), -1, vsCMAccess.vsCMAccessPublic, null);
                method.IsShared = true;
                foreach (ParameterInfo param in parameters)
                {
                    method.AddParameter(param.Name, CreateCodeTypeRefName(param.ParameterType), -1);
                }
                method.AddAttribute(typeof(WebMethodAttribute).FullName, "", -1);
                method.AddAttribute(typeof(ScriptMethodAttribute).FullName, "", -1);
            }

            /// <summary>
            /// Check if an existing page method needs repair
            /// </summary>
            /// <param name="method">Method to check</param>
            /// <returns>Whether or not the page method needs repair</returns>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            private bool PageMethodNeedsRepair(CodeFunction2 method)
            {
                if (method == null || method.Reference == null)
                {
                    return false;
                }

                ParameterInfo[] parameters = _signature.GetParameters();

                // Tweak the signature so it's appropriate
                if (!method.IsShared)
                {
                    return true;
                }
                if (method.Access != vsCMAccess.vsCMAccessPublic)
                {
                    return true;
                }

                int i = 0;
                foreach (object p in method.Parameters)
                {
                    CodeParameter2 parameter = new CodeParameter2(p);
                    if ((parameter.Reference == null) || (string.Compare(parameter.Name, parameters[i++].Name, StringComparison.Ordinal) != 0))
                    {
                        return true;
                    }
                }

                // Add the necessary attributes
                bool hasWebMethod = false;
                bool hasScriptMethod = false;
                foreach (object attr in method.Attributes)
                {
                    CodeAttribute2 attribute = new CodeAttribute2(attr);
                    if (attribute.Reference == null)
                    {
                        continue;
                    }
                    hasWebMethod |= !string.IsNullOrEmpty(attribute.Name) && attribute.Name.Contains("WebMethod");
                    hasScriptMethod |= !string.IsNullOrEmpty(attribute.Name) && attribute.Name.Contains("ScriptMethod");
                    if (hasWebMethod && hasScriptMethod)
                    {
                        break;
                    }
                }
                return !hasWebMethod || !hasScriptMethod;
            }

            /// <summary>
            /// Repair the page method
            /// </summary>
            /// <param name="method">Method to repair</param>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            private void RepairPageMethod(CodeFunction2 method)
            {
                if (method == null || method.Reference == null)
                {
                    return;
                }

                // Tweak the signature so it's appropriate
                method.IsShared = true;
                method.Access = vsCMAccess.vsCMAccessPublic;
                int i = 0;
                ParameterInfo[] parameters = _signature.GetParameters();
                foreach (object p in method.Parameters)
                {
                    CodeParameter2 parameter = new CodeParameter2(p);
                    if (parameter.Reference != null)
                    {
                        parameter.Name = parameters[i++].Name;
                    }
                }

                // Add the necessary attributes
                bool hasWebMethod = false;
                bool hasScriptMethod = false;
                foreach (object attr in method.Attributes)
                {
                    CodeAttribute2 attribute = new CodeAttribute2(attr);
                    if (attribute.Reference == null)
                    {
                        continue;
                    }

                    hasWebMethod |= !string.IsNullOrEmpty(attribute.Name) && attribute.Name.Contains("WebMethod");
                    hasScriptMethod |= !string.IsNullOrEmpty(attribute.Name) && attribute.Name.Contains("ScriptMethod");
                    if (hasWebMethod && hasScriptMethod)
                    {
                        break;
                    }
                }
                if (!hasWebMethod)
                {
                    method.AddAttribute(typeof(WebMethodAttribute).FullName, "", -1);
                }
                if (!hasScriptMethod)
                {
                    method.AddAttribute(typeof(ScriptMethodAttribute).FullName, "", -1);
                }
            }

            /// <summary>
            /// Load the FileCodeModel associated with a web project item
            /// </summary>
            /// <param name="projectItem">Active ProjectItem</param>
            /// <returns>FileCodeModel</returns>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            private static FileCodeModel2 LoadFileCodeModel(ProjectItem projectItem)
            {
                if (projectItem == null || projectItem.Reference == null)
                {
                    throw new ArgumentNullException("projectItem", "projectItem cannot be null");
                }

                VSWebProjectItem webProjectItem = new VSWebProjectItem(projectItem.Object);
                if (webProjectItem.Reference != null)
                {
                    webProjectItem.Load();
                    return webProjectItem.ProjectItem.FileCodeModel;
                }
                return projectItem.FileCodeModel;
            }

            /// <summary>
            /// Unload the WebProjectItem if it was loaded
            /// </summary>
            /// <param name="projectItem">Active ProjectItem</param>
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
            private static void UnloadWebProjectItem(ProjectItem projectItem)
            {
                VSWebProjectItem webProjectItem = new VSWebProjectItem(projectItem.Object);
                if (webProjectItem.Reference != null)
                {
                    webProjectItem.Unload();
                }
            }
        }
    }
}