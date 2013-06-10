

//////////////////////
// Auto-generated code
//////////////////////

using System;
using System.Reflection;

namespace AjaxControlToolkit.Design
{
    internal static class ReferencedAssemblies
    {
        private static Assembly _EnvDTE;
        public static Assembly EnvDTE
        {
            get
            {
                if (_EnvDTE == null)
                {
                    _EnvDTE = Assembly.Load("EnvDTE, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a");
                }
                return _EnvDTE;
            }
        }
        
        private static Assembly _EnvDTE80;
        public static Assembly EnvDTE80
        {
            get
            {
                if (_EnvDTE80 == null)
                {
                    _EnvDTE80 = Assembly.Load("EnvDTE80, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a");
                }
                return _EnvDTE80;
            }
        }
        
        private static Assembly _VsWebSite;
        public static Assembly VsWebSite
        {
            get
            {
                if (_VsWebSite == null)
                {
                    _VsWebSite = Assembly.Load("VsWebSite.Interop, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a");
                }
                return _VsWebSite;
            }
        }
        
    }
    
    internal class vsCMElement
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE.GetType("EnvDTE.vsCMElement");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE.vsCMElement' from assembly 'EnvDTE, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public vsCMElement()
            : this(null)
        {
        }
        
        public vsCMElement(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) || (reference is int) ? reference : null;
        }
        
        // public static readonly vsCMElement vsCMElementOther = new vsCMElement(0);
        public static readonly vsCMElement vsCMElementClass = new vsCMElement(1);
        public static readonly vsCMElement vsCMElementFunction = new vsCMElement(2);
        // public static readonly vsCMElement vsCMElementVariable = new vsCMElement(3);
        // public static readonly vsCMElement vsCMElementProperty = new vsCMElement(4);
        public static readonly vsCMElement vsCMElementNamespace = new vsCMElement(5);
        // public static readonly vsCMElement vsCMElementParameter = new vsCMElement(6);
        // public static readonly vsCMElement vsCMElementAttribute = new vsCMElement(7);
        // public static readonly vsCMElement vsCMElementInterface = new vsCMElement(8);
        // public static readonly vsCMElement vsCMElementDelegate = new vsCMElement(9);
        // public static readonly vsCMElement vsCMElementEnum = new vsCMElement(10);
        // public static readonly vsCMElement vsCMElementStruct = new vsCMElement(11);
        // public static readonly vsCMElement vsCMElementUnion = new vsCMElement(12);
        // public static readonly vsCMElement vsCMElementLocalDeclStmt = new vsCMElement(13);
        // public static readonly vsCMElement vsCMElementFunctionInvokeStmt = new vsCMElement(14);
        // public static readonly vsCMElement vsCMElementPropertySetStmt = new vsCMElement(15);
        // public static readonly vsCMElement vsCMElementAssignmentStmt = new vsCMElement(16);
        // public static readonly vsCMElement vsCMElementInheritsStmt = new vsCMElement(17);
        // public static readonly vsCMElement vsCMElementImplementsStmt = new vsCMElement(18);
        // public static readonly vsCMElement vsCMElementOptionStmt = new vsCMElement(19);
        // public static readonly vsCMElement vsCMElementVBAttributeStmt = new vsCMElement(20);
        // public static readonly vsCMElement vsCMElementVBAttributeGroup = new vsCMElement(21);
        // public static readonly vsCMElement vsCMElementEventsDeclaration = new vsCMElement(22);
        // public static readonly vsCMElement vsCMElementUDTDecl = new vsCMElement(23);
        // public static readonly vsCMElement vsCMElementDeclareDecl = new vsCMElement(24);
        // public static readonly vsCMElement vsCMElementDefineStmt = new vsCMElement(25);
        // public static readonly vsCMElement vsCMElementTypeDef = new vsCMElement(26);
        // public static readonly vsCMElement vsCMElementIncludeStmt = new vsCMElement(27);
        // public static readonly vsCMElement vsCMElementUsingStmt = new vsCMElement(28);
        // public static readonly vsCMElement vsCMElementMacro = new vsCMElement(29);
        // public static readonly vsCMElement vsCMElementMap = new vsCMElement(30);
        // public static readonly vsCMElement vsCMElementIDLImport = new vsCMElement(31);
        // public static readonly vsCMElement vsCMElementIDLImportLib = new vsCMElement(32);
        // public static readonly vsCMElement vsCMElementIDLCoClass = new vsCMElement(33);
        // public static readonly vsCMElement vsCMElementIDLLibrary = new vsCMElement(34);
        // public static readonly vsCMElement vsCMElementImportStmt = new vsCMElement(35);
        // public static readonly vsCMElement vsCMElementMapEntry = new vsCMElement(36);
        // public static readonly vsCMElement vsCMElementVCBase = new vsCMElement(37);
        // public static readonly vsCMElement vsCMElementEvent = new vsCMElement(38);
        // public static readonly vsCMElement vsCMElementModule = new vsCMElement(39);
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public int Value
        {
            get { return (int) _reference; }
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public override bool Equals(object obj)
        {
            vsCMElement other = obj as vsCMElement;
            if (other == null)
            {
                return false;
            }
            else if (_reference == null)
            {
                return other._reference == null;
            }
            else if (other._reference == null)
            {
                return false;
            }
            return Value == other.Value;
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public override int GetHashCode()
        {
            return _reference == null ? 0 : Value.GetHashCode();
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public static bool operator == (vsCMElement left, vsCMElement right)
        {
            if (object.ReferenceEquals(left, null))
            {
                return object.ReferenceEquals(right, null);
            }
            return left.Equals(right);
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public static bool operator != (vsCMElement left, vsCMElement right)
        {
            return !(left == right);
        }
    }

    internal class vsCMAccess
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE.GetType("EnvDTE.vsCMAccess");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE.vsCMAccess' from assembly 'EnvDTE, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public vsCMAccess()
            : this(null)
        {
        }
        
        public vsCMAccess(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) || (reference is int) ? reference : null;
        }
        
        public static readonly vsCMAccess vsCMAccessPublic = new vsCMAccess(1);
        // public static readonly vsCMAccess vsCMAccessPrivate = new vsCMAccess(2);
        // public static readonly vsCMAccess vsCMAccessProject = new vsCMAccess(4);
        // public static readonly vsCMAccess vsCMAccessProtected = new vsCMAccess(8);
        // public static readonly vsCMAccess vsCMAccessDefault = new vsCMAccess(32);
        // public static readonly vsCMAccess vsCMAccessAssemblyOrFamily = new vsCMAccess(64);
        // public static readonly vsCMAccess vsCMAccessWithEvents = new vsCMAccess(128);
        // public static readonly vsCMAccess vsCMAccessProjectOrProtected = new vsCMAccess(12);
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public int Value
        {
            get { return (int) _reference; }
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public override bool Equals(object obj)
        {
            vsCMAccess other = obj as vsCMAccess;
            if (other == null)
            {
                return false;
            }
            else if (_reference == null)
            {
                return other._reference == null;
            }
            else if (other._reference == null)
            {
                return false;
            }
            return Value == other.Value;
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public override int GetHashCode()
        {
            return _reference == null ? 0 : Value.GetHashCode();
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public static bool operator == (vsCMAccess left, vsCMAccess right)
        {
            if (object.ReferenceEquals(left, null))
            {
                return object.ReferenceEquals(right, null);
            }
            return left.Equals(right);
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public static bool operator != (vsCMAccess left, vsCMAccess right)
        {
            return !(left == right);
        }
    }

    internal class vsCMFunction
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE.GetType("EnvDTE.vsCMFunction");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE.vsCMFunction' from assembly 'EnvDTE, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public vsCMFunction()
            : this(null)
        {
        }
        
        public vsCMFunction(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) || (reference is int) ? reference : null;
        }
        
        // public static readonly vsCMFunction vsCMFunctionOther = new vsCMFunction(0);
        // public static readonly vsCMFunction vsCMFunctionConstructor = new vsCMFunction(1);
        // public static readonly vsCMFunction vsCMFunctionPropertyGet = new vsCMFunction(2);
        // public static readonly vsCMFunction vsCMFunctionPropertyLet = new vsCMFunction(4);
        // public static readonly vsCMFunction vsCMFunctionPropertySet = new vsCMFunction(8);
        // public static readonly vsCMFunction vsCMFunctionPutRef = new vsCMFunction(16);
        // public static readonly vsCMFunction vsCMFunctionPropertyAssign = new vsCMFunction(32);
        // public static readonly vsCMFunction vsCMFunctionSub = new vsCMFunction(64);
        public static readonly vsCMFunction vsCMFunctionFunction = new vsCMFunction(128);
        // public static readonly vsCMFunction vsCMFunctionTopLevel = new vsCMFunction(256);
        // public static readonly vsCMFunction vsCMFunctionDestructor = new vsCMFunction(512);
        // public static readonly vsCMFunction vsCMFunctionOperator = new vsCMFunction(1024);
        // public static readonly vsCMFunction vsCMFunctionVirtual = new vsCMFunction(2048);
        // public static readonly vsCMFunction vsCMFunctionPure = new vsCMFunction(4096);
        // public static readonly vsCMFunction vsCMFunctionConstant = new vsCMFunction(8192);
        // public static readonly vsCMFunction vsCMFunctionShared = new vsCMFunction(16384);
        // public static readonly vsCMFunction vsCMFunctionInline = new vsCMFunction(32768);
        // public static readonly vsCMFunction vsCMFunctionComMethod = new vsCMFunction(65536);
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public int Value
        {
            get { return (int) _reference; }
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public override bool Equals(object obj)
        {
            vsCMFunction other = obj as vsCMFunction;
            if (other == null)
            {
                return false;
            }
            else if (_reference == null)
            {
                return other._reference == null;
            }
            else if (other._reference == null)
            {
                return false;
            }
            return Value == other.Value;
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public override int GetHashCode()
        {
            return _reference == null ? 0 : Value.GetHashCode();
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public static bool operator == (vsCMFunction left, vsCMFunction right)
        {
            if (object.ReferenceEquals(left, null))
            {
                return object.ReferenceEquals(right, null);
            }
            return left.Equals(right);
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public static bool operator != (vsCMFunction left, vsCMFunction right)
        {
            return !(left == right);
        }
    }

    internal class vsCMTypeRef
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE.GetType("EnvDTE.vsCMTypeRef");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE.vsCMTypeRef' from assembly 'EnvDTE, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public vsCMTypeRef()
            : this(null)
        {
        }
        
        public vsCMTypeRef(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) || (reference is int) ? reference : null;
        }
        
        // public static readonly vsCMTypeRef vsCMTypeRefOther = new vsCMTypeRef(0);
        // public static readonly vsCMTypeRef vsCMTypeRefCodeType = new vsCMTypeRef(1);
        public static readonly vsCMTypeRef vsCMTypeRefArray = new vsCMTypeRef(2);
        // public static readonly vsCMTypeRef vsCMTypeRefVoid = new vsCMTypeRef(3);
        public static readonly vsCMTypeRef vsCMTypeRefPointer = new vsCMTypeRef(4);
        // public static readonly vsCMTypeRef vsCMTypeRefString = new vsCMTypeRef(5);
        // public static readonly vsCMTypeRef vsCMTypeRefObject = new vsCMTypeRef(6);
        // public static readonly vsCMTypeRef vsCMTypeRefByte = new vsCMTypeRef(7);
        // public static readonly vsCMTypeRef vsCMTypeRefChar = new vsCMTypeRef(8);
        // public static readonly vsCMTypeRef vsCMTypeRefShort = new vsCMTypeRef(9);
        // public static readonly vsCMTypeRef vsCMTypeRefInt = new vsCMTypeRef(10);
        // public static readonly vsCMTypeRef vsCMTypeRefLong = new vsCMTypeRef(11);
        // public static readonly vsCMTypeRef vsCMTypeRefFloat = new vsCMTypeRef(12);
        // public static readonly vsCMTypeRef vsCMTypeRefDouble = new vsCMTypeRef(13);
        // public static readonly vsCMTypeRef vsCMTypeRefDecimal = new vsCMTypeRef(14);
        // public static readonly vsCMTypeRef vsCMTypeRefBool = new vsCMTypeRef(15);
        // public static readonly vsCMTypeRef vsCMTypeRefVariant = new vsCMTypeRef(16);
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public int Value
        {
            get { return (int) _reference; }
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public override bool Equals(object obj)
        {
            vsCMTypeRef other = obj as vsCMTypeRef;
            if (other == null)
            {
                return false;
            }
            else if (_reference == null)
            {
                return other._reference == null;
            }
            else if (other._reference == null)
            {
                return false;
            }
            return Value == other.Value;
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public override int GetHashCode()
        {
            return _reference == null ? 0 : Value.GetHashCode();
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public static bool operator == (vsCMTypeRef left, vsCMTypeRef right)
        {
            if (object.ReferenceEquals(left, null))
            {
                return object.ReferenceEquals(right, null);
            }
            return left.Equals(right);
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public static bool operator != (vsCMTypeRef left, vsCMTypeRef right)
        {
            return !(left == right);
        }
    }

    internal class CodeTypeRef
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE.GetType("EnvDTE.CodeTypeRef");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE.CodeTypeRef' from assembly 'EnvDTE, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public CodeTypeRef()
            : this(null)
        {
        }
        
        public CodeTypeRef(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) ? reference : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 DTE
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("DTE").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object Parent
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("Parent").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public vsCMTypeRef TypeKind
        {
            get
            {
                object value = ReferencedType.GetProperty("TypeKind").GetValue(_reference, new object[] { });
                return value != null ? new vsCMTypeRef(value) : null;
            }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeType CodeType
        // {
        //     get { return (CodeType) ReferencedType.GetProperty("CodeType").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("CodeType").SetValue(_reference, value, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public CodeTypeRef ElementType
        {
            get
            {
                object value = ReferencedType.GetProperty("ElementType").GetValue(_reference, new object[] { });
                return value != null ? new CodeTypeRef(value) : null;
            }
            set { ReferencedType.GetProperty("ElementType").SetValue(_reference, value != null ? value.Reference : null, new object[] { }); }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String AsString
        // {
        //     get { return (System.String) ReferencedType.GetProperty("AsString").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public System.String AsFullName
        {
            get { return (System.String) ReferencedType.GetProperty("AsFullName").GetValue(_reference, new object[] { }); }
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public System.Int32 Rank
        {
            get { return (System.Int32) ReferencedType.GetProperty("Rank").GetValue(_reference, new object[] { }); }
            set { ReferencedType.GetProperty("Rank").SetValue(_reference, value, new object[] { }); }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeTypeRef CreateArrayType(System.Int32 Rank)
        // {
        //     object value = ReferencedType.GetMethod("CreateArrayType").Invoke(_reference, new object[] { Rank });
        //     return value != null ? new CodeTypeRef(value) : null;
        // }
        
    }

    internal class CodeElements
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE.GetType("EnvDTE.CodeElements");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE.CodeElements' from assembly 'EnvDTE, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public CodeElements()
            : this(null)
        {
        }
        
        public CodeElements(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) ? reference : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 DTE
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("DTE").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object Parent
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("Parent").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public System.Int32 Count
        {
            get { return (System.Int32) ReferencedType.GetProperty("Count").GetValue(_reference, new object[] { }); }
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public System.Collections.IEnumerator GetEnumerator()
        {
            object value = ReferencedType.GetMethod("GetEnumerator").Invoke(_reference, new object[] {  });
            return (System.Collections.IEnumerator) value;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElement2 Item(System.Object index)
        // {
        //     object value = ReferencedType.GetMethod("Item").Invoke(_reference, new object[] { index });
        //     return value != null ? new CodeElement2(value) : null;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void Reserved1(System.Object Element)
        // {
        //     ReferencedType.GetMethod("Reserved1").Invoke(_reference, new object[] { Element });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean CreateUniqueID(System.String Prefix, System.String& NewName)
        // {
        //     object value = ReferencedType.GetMethod("CreateUniqueID").Invoke(_reference, new object[] { Prefix, NewName });
        //     return (System.Boolean) value;
        // }
        
    }

    internal class FileCodeModel2
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE80.GetType("EnvDTE80.FileCodeModel2");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE80.FileCodeModel2' from assembly 'EnvDTE80, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public FileCodeModel2()
            : this(null)
        {
        }
        
        public FileCodeModel2(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) ? reference : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 DTE
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("DTE").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public ProjectItem Parent
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Parent").GetValue(_reference, new object[] { });
        //         return value != null ? new ProjectItem(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Language
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Language").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public CodeElements CodeElements
        {
            get
            {
                object value = ReferencedType.GetProperty("CodeElements").GetValue(_reference, new object[] { });
                return value != null ? new CodeElements(value) : null;
            }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMParseStatus ParseStatus
        // {
        //     get { return (vsCMParseStatus) ReferencedType.GetProperty("ParseStatus").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsBatchOpen
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsBatchOpen").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElement2 CodeElementFromPoint(TextPoint Point, vsCMElement Scope)
        // {
        //     object value = ReferencedType.GetMethod("CodeElementFromPoint").Invoke(_reference, new object[] { Point, Scope != null ? Scope.Reference : null });
        //     return value != null ? new CodeElement2(value) : null;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeNamespace AddNamespace(System.String Name, System.Object Position)
        // {
        //     object value = ReferencedType.GetMethod("AddNamespace").Invoke(_reference, new object[] { Name, Position });
        //     return (CodeNamespace) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeClass2 AddClass(System.String Name, System.Object Position, System.Object Bases, System.Object ImplementedInterfaces, vsCMAccess Access)
        // {
        //     object value = ReferencedType.GetMethod("AddClass").Invoke(_reference, new object[] { Name, Position, Bases, ImplementedInterfaces, Access != null ? Access.Reference : null });
        //     return value != null ? new CodeClass2(value) : null;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeInterface AddInterface(System.String Name, System.Object Position, System.Object Bases, vsCMAccess Access)
        // {
        //     object value = ReferencedType.GetMethod("AddInterface").Invoke(_reference, new object[] { Name, Position, Bases, Access != null ? Access.Reference : null });
        //     return (CodeInterface) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeFunction2 AddFunction(System.String Name, vsCMFunction Kind, System.Object Type, System.Object Position, vsCMAccess Access)
        // {
        //     object value = ReferencedType.GetMethod("AddFunction").Invoke(_reference, new object[] { Name, Kind != null ? Kind.Reference : null, Type, Position, Access != null ? Access.Reference : null });
        //     return value != null ? new CodeFunction2(value) : null;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeVariable AddVariable(System.String Name, System.Object Type, System.Object Position, vsCMAccess Access)
        // {
        //     object value = ReferencedType.GetMethod("AddVariable").Invoke(_reference, new object[] { Name, Type, Position, Access != null ? Access.Reference : null });
        //     return (CodeVariable) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeAttribute2 AddAttribute(System.String Name, System.String Value, System.Object Position)
        // {
        //     object value = ReferencedType.GetMethod("AddAttribute").Invoke(_reference, new object[] { Name, Value, Position });
        //     return value != null ? new CodeAttribute2(value) : null;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeStruct AddStruct(System.String Name, System.Object Position, System.Object Bases, System.Object ImplementedInterfaces, vsCMAccess Access)
        // {
        //     object value = ReferencedType.GetMethod("AddStruct").Invoke(_reference, new object[] { Name, Position, Bases, ImplementedInterfaces, Access != null ? Access.Reference : null });
        //     return (CodeStruct) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeEnum AddEnum(System.String Name, System.Object Position, System.Object Bases, vsCMAccess Access)
        // {
        //     object value = ReferencedType.GetMethod("AddEnum").Invoke(_reference, new object[] { Name, Position, Bases, Access != null ? Access.Reference : null });
        //     return (CodeEnum) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeDelegate AddDelegate(System.String Name, System.Object Type, System.Object Position, vsCMAccess Access)
        // {
        //     object value = ReferencedType.GetMethod("AddDelegate").Invoke(_reference, new object[] { Name, Type, Position, Access != null ? Access.Reference : null });
        //     return (CodeDelegate) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void Remove(System.Object Element)
        // {
        //     ReferencedType.GetMethod("Remove").Invoke(_reference, new object[] { Element });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void Synchronize()
        // {
        //     ReferencedType.GetMethod("Synchronize").Invoke(_reference, new object[] {  });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeImport AddImport(System.String Name, System.Object Position, System.String Alias)
        // {
        //     object value = ReferencedType.GetMethod("AddImport").Invoke(_reference, new object[] { Name, Position, Alias });
        //     return (CodeImport) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void BeginBatch()
        // {
        //     ReferencedType.GetMethod("BeginBatch").Invoke(_reference, new object[] {  });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void EndBatch()
        // {
        //     ReferencedType.GetMethod("EndBatch").Invoke(_reference, new object[] {  });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElement2 ElementFromID(System.String ID)
        // {
        //     object value = ReferencedType.GetMethod("ElementFromID").Invoke(_reference, new object[] { ID });
        //     return value != null ? new CodeElement2(value) : null;
        // }
        
    }

    internal class CodeElement2
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE80.GetType("EnvDTE80.CodeElement2");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE80.CodeElement2' from assembly 'EnvDTE80, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public CodeElement2()
            : this(null)
        {
        }
        
        public CodeElement2(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) ? reference : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 DTE
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("DTE").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements Collection
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Collection").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public System.String Name
        {
            get { return (System.String) ReferencedType.GetProperty("Name").GetValue(_reference, new object[] { }); }
            set { ReferencedType.GetProperty("Name").SetValue(_reference, value, new object[] { }); }
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public System.String FullName
        {
            get { return (System.String) ReferencedType.GetProperty("FullName").GetValue(_reference, new object[] { }); }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public ProjectItem ProjectItem
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("ProjectItem").GetValue(_reference, new object[] { });
        //         return value != null ? new ProjectItem(value) : null;
        //     }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public vsCMElement Kind
        {
            get
            {
                object value = ReferencedType.GetProperty("Kind").GetValue(_reference, new object[] { });
                return value != null ? new vsCMElement(value) : null;
            }
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public System.Boolean IsCodeType
        {
            get { return (System.Boolean) ReferencedType.GetProperty("IsCodeType").GetValue(_reference, new object[] { }); }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMInfoLocation InfoLocation
        // {
        //     get { return (vsCMInfoLocation) ReferencedType.GetProperty("InfoLocation").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public CodeElements Children
        {
            get
            {
                object value = ReferencedType.GetProperty("Children").GetValue(_reference, new object[] { });
                return value != null ? new CodeElements(value) : null;
            }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Language
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Language").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint StartPoint
        // {
        //     get { return (TextPoint) ReferencedType.GetProperty("StartPoint").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint EndPoint
        // {
        //     get { return (TextPoint) ReferencedType.GetProperty("EndPoint").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object ExtenderNames
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("ExtenderNames").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object Extender
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("Extender").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String ExtenderCATID
        // {
        //     get { return (System.String) ReferencedType.GetProperty("ExtenderCATID").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String ElementID
        // {
        //     get { return (System.String) ReferencedType.GetProperty("ElementID").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint GetStartPoint(vsCMPart Part)
        // {
        //     object value = ReferencedType.GetMethod("GetStartPoint").Invoke(_reference, new object[] { Part });
        //     return (TextPoint) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint GetEndPoint(vsCMPart Part)
        // {
        //     object value = ReferencedType.GetMethod("GetEndPoint").Invoke(_reference, new object[] { Part });
        //     return (TextPoint) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void RenameSymbol(System.String NewName)
        // {
        //     ReferencedType.GetMethod("RenameSymbol").Invoke(_reference, new object[] { NewName });
        // }
        
    }

    internal class CodeClass2
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE80.GetType("EnvDTE80.CodeClass2");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE80.CodeClass2' from assembly 'EnvDTE80, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public CodeClass2()
            : this(null)
        {
        }
        
        public CodeClass2(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) ? reference : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 DTE
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("DTE").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements Collection
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Collection").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Name
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Name").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("Name").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String FullName
        // {
        //     get { return (System.String) ReferencedType.GetProperty("FullName").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public ProjectItem ProjectItem
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("ProjectItem").GetValue(_reference, new object[] { });
        //         return value != null ? new ProjectItem(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMElement Kind
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Kind").GetValue(_reference, new object[] { });
        //         return value != null ? new vsCMElement(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsCodeType
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsCodeType").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMInfoLocation InfoLocation
        // {
        //     get { return (vsCMInfoLocation) ReferencedType.GetProperty("InfoLocation").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public CodeElements Children
        {
            get
            {
                object value = ReferencedType.GetProperty("Children").GetValue(_reference, new object[] { });
                return value != null ? new CodeElements(value) : null;
            }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Language
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Language").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint StartPoint
        // {
        //     get { return (TextPoint) ReferencedType.GetProperty("StartPoint").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint EndPoint
        // {
        //     get { return (TextPoint) ReferencedType.GetProperty("EndPoint").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object ExtenderNames
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("ExtenderNames").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object Extender
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("Extender").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String ExtenderCATID
        // {
        //     get { return (System.String) ReferencedType.GetProperty("ExtenderCATID").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object Parent
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("Parent").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeNamespace Namespace
        // {
        //     get { return (CodeNamespace) ReferencedType.GetProperty("Namespace").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements Bases
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Bases").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements Members
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Members").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMAccess Access
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Access").GetValue(_reference, new object[] { });
        //         return value != null ? new vsCMAccess(value) : null;
        //     }
        //     set { ReferencedType.GetProperty("Access").SetValue(_reference, value != null ? value.Reference : null, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements Attributes
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Attributes").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String DocComment
        // {
        //     get { return (System.String) ReferencedType.GetProperty("DocComment").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("DocComment").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Comment
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Comment").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("Comment").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsDerivedFrom
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsDerivedFrom").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements DerivedTypes
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("DerivedTypes").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements ImplementedInterfaces
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("ImplementedInterfaces").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsAbstract
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsAbstract").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("IsAbstract").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMClassKind ClassKind
        // {
        //     get { return (vsCMClassKind) ReferencedType.GetProperty("ClassKind").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("ClassKind").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements PartialClasses
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("PartialClasses").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMDataTypeKind DataTypeKind
        // {
        //     get { return (vsCMDataTypeKind) ReferencedType.GetProperty("DataTypeKind").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("DataTypeKind").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements Parts
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Parts").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMInheritanceKind InheritanceKind
        // {
        //     get { return (vsCMInheritanceKind) ReferencedType.GetProperty("InheritanceKind").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("InheritanceKind").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsGeneric
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsGeneric").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsShared
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsShared").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("IsShared").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint GetStartPoint(vsCMPart Part)
        // {
        //     object value = ReferencedType.GetMethod("GetStartPoint").Invoke(_reference, new object[] { Part });
        //     return (TextPoint) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint GetEndPoint(vsCMPart Part)
        // {
        //     object value = ReferencedType.GetMethod("GetEndPoint").Invoke(_reference, new object[] { Part });
        //     return (TextPoint) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElement2 AddBase(System.Object Base, System.Object Position)
        // {
        //     object value = ReferencedType.GetMethod("AddBase").Invoke(_reference, new object[] { Base, Position });
        //     return value != null ? new CodeElement2(value) : null;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeAttribute2 AddAttribute(System.String Name, System.String Value, System.Object Position)
        // {
        //     object value = ReferencedType.GetMethod("AddAttribute").Invoke(_reference, new object[] { Name, Value, Position });
        //     return value != null ? new CodeAttribute2(value) : null;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void RemoveBase(System.Object Element)
        // {
        //     ReferencedType.GetMethod("RemoveBase").Invoke(_reference, new object[] { Element });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void RemoveMember(System.Object Element)
        // {
        //     ReferencedType.GetMethod("RemoveMember").Invoke(_reference, new object[] { Element });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeInterface AddImplementedInterface(System.Object Base, System.Object Position)
        // {
        //     object value = ReferencedType.GetMethod("AddImplementedInterface").Invoke(_reference, new object[] { Base, Position });
        //     return (CodeInterface) value;
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public CodeFunction2 AddFunction(System.String Name, vsCMFunction Kind, System.Object Type, System.Object Position, vsCMAccess Access, System.Object Location)
        {
            object value = ReferencedType.GetMethod("AddFunction").Invoke(_reference, new object[] { Name, Kind != null ? Kind.Reference : null, Type, Position, Access != null ? Access.Reference : null, Location });
            return value != null ? new CodeFunction2(value) : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeVariable AddVariable(System.String Name, System.Object Type, System.Object Position, vsCMAccess Access, System.Object Location)
        // {
        //     object value = ReferencedType.GetMethod("AddVariable").Invoke(_reference, new object[] { Name, Type, Position, Access != null ? Access.Reference : null, Location });
        //     return (CodeVariable) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeProperty AddProperty(System.String GetterName, System.String PutterName, System.Object Type, System.Object Position, vsCMAccess Access, System.Object Location)
        // {
        //     object value = ReferencedType.GetMethod("AddProperty").Invoke(_reference, new object[] { GetterName, PutterName, Type, Position, Access != null ? Access.Reference : null, Location });
        //     return (CodeProperty) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeClass2 AddClass(System.String Name, System.Object Position, System.Object Bases, System.Object ImplementedInterfaces, vsCMAccess Access)
        // {
        //     object value = ReferencedType.GetMethod("AddClass").Invoke(_reference, new object[] { Name, Position, Bases, ImplementedInterfaces, Access != null ? Access.Reference : null });
        //     return value != null ? new CodeClass2(value) : null;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeStruct AddStruct(System.String Name, System.Object Position, System.Object Bases, System.Object ImplementedInterfaces, vsCMAccess Access)
        // {
        //     object value = ReferencedType.GetMethod("AddStruct").Invoke(_reference, new object[] { Name, Position, Bases, ImplementedInterfaces, Access != null ? Access.Reference : null });
        //     return (CodeStruct) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeEnum AddEnum(System.String Name, System.Object Position, System.Object Bases, vsCMAccess Access)
        // {
        //     object value = ReferencedType.GetMethod("AddEnum").Invoke(_reference, new object[] { Name, Position, Bases, Access != null ? Access.Reference : null });
        //     return (CodeEnum) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeDelegate AddDelegate(System.String Name, System.Object Type, System.Object Position, vsCMAccess Access)
        // {
        //     object value = ReferencedType.GetMethod("AddDelegate").Invoke(_reference, new object[] { Name, Type, Position, Access != null ? Access.Reference : null });
        //     return (CodeDelegate) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void RemoveInterface(System.Object Element)
        // {
        //     ReferencedType.GetMethod("RemoveInterface").Invoke(_reference, new object[] { Element });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeEvent AddEvent(System.String Name, System.String FullDelegateName, System.Boolean CreatePropertyStyleEvent, System.Object Location, vsCMAccess Access)
        // {
        //     object value = ReferencedType.GetMethod("AddEvent").Invoke(_reference, new object[] { Name, FullDelegateName, CreatePropertyStyleEvent, Location, Access != null ? Access.Reference : null });
        //     return (CodeEvent) value;
        // }
        
    }

    internal class CodeFunction2
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE80.GetType("EnvDTE80.CodeFunction2");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE80.CodeFunction2' from assembly 'EnvDTE80, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public CodeFunction2()
            : this(null)
        {
        }
        
        public CodeFunction2(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) ? reference : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 DTE
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("DTE").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements Collection
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Collection").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Name
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Name").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("Name").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String FullName
        // {
        //     get { return (System.String) ReferencedType.GetProperty("FullName").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public ProjectItem ProjectItem
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("ProjectItem").GetValue(_reference, new object[] { });
        //         return value != null ? new ProjectItem(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMElement Kind
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Kind").GetValue(_reference, new object[] { });
        //         return value != null ? new vsCMElement(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsCodeType
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsCodeType").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMInfoLocation InfoLocation
        // {
        //     get { return (vsCMInfoLocation) ReferencedType.GetProperty("InfoLocation").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public CodeElements Children
        {
            get
            {
                object value = ReferencedType.GetProperty("Children").GetValue(_reference, new object[] { });
                return value != null ? new CodeElements(value) : null;
            }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Language
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Language").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint StartPoint
        // {
        //     get { return (TextPoint) ReferencedType.GetProperty("StartPoint").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint EndPoint
        // {
        //     get { return (TextPoint) ReferencedType.GetProperty("EndPoint").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object ExtenderNames
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("ExtenderNames").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object Extender
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("Extender").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String ExtenderCATID
        // {
        //     get { return (System.String) ReferencedType.GetProperty("ExtenderCATID").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object Parent
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("Parent").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMFunction FunctionKind
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("FunctionKind").GetValue(_reference, new object[] { });
        //         return value != null ? new vsCMFunction(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Prototype
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Prototype").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public CodeTypeRef Type
        {
            get
            {
                object value = ReferencedType.GetProperty("Type").GetValue(_reference, new object[] { });
                return value != null ? new CodeTypeRef(value) : null;
            }
            set { ReferencedType.GetProperty("Type").SetValue(_reference, value != null ? value.Reference : null, new object[] { }); }
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public CodeElements Parameters
        {
            get
            {
                object value = ReferencedType.GetProperty("Parameters").GetValue(_reference, new object[] { });
                return value != null ? new CodeElements(value) : null;
            }
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public vsCMAccess Access
        {
            get
            {
                object value = ReferencedType.GetProperty("Access").GetValue(_reference, new object[] { });
                return value != null ? new vsCMAccess(value) : null;
            }
            set { ReferencedType.GetProperty("Access").SetValue(_reference, value != null ? value.Reference : null, new object[] { }); }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsOverloaded
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsOverloaded").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public System.Boolean IsShared
        {
            get { return (System.Boolean) ReferencedType.GetProperty("IsShared").GetValue(_reference, new object[] { }); }
            set { ReferencedType.GetProperty("IsShared").SetValue(_reference, value, new object[] { }); }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean MustImplement
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("MustImplement").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("MustImplement").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements Overloads
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Overloads").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public CodeElements Attributes
        {
            get
            {
                object value = ReferencedType.GetProperty("Attributes").GetValue(_reference, new object[] { });
                return value != null ? new CodeElements(value) : null;
            }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String DocComment
        // {
        //     get { return (System.String) ReferencedType.GetProperty("DocComment").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("DocComment").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Comment
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Comment").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("Comment").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean CanOverride
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("CanOverride").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("CanOverride").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMOverrideKind OverrideKind
        // {
        //     get { return (vsCMOverrideKind) ReferencedType.GetProperty("OverrideKind").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("OverrideKind").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsGeneric
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsGeneric").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint GetStartPoint(vsCMPart Part)
        // {
        //     object value = ReferencedType.GetMethod("GetStartPoint").Invoke(_reference, new object[] { Part });
        //     return (TextPoint) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint GetEndPoint(vsCMPart Part)
        // {
        //     object value = ReferencedType.GetMethod("GetEndPoint").Invoke(_reference, new object[] { Part });
        //     return (TextPoint) value;
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public CodeParameter2 AddParameter(System.String Name, System.Object Type, System.Object Position)
        {
            object value = ReferencedType.GetMethod("AddParameter").Invoke(_reference, new object[] { Name, Type, Position });
            return value != null ? new CodeParameter2(value) : null;
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public CodeAttribute2 AddAttribute(System.String Name, System.String Value, System.Object Position)
        {
            object value = ReferencedType.GetMethod("AddAttribute").Invoke(_reference, new object[] { Name, Value, Position });
            return value != null ? new CodeAttribute2(value) : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void RemoveParameter(System.Object Element)
        // {
        //     ReferencedType.GetMethod("RemoveParameter").Invoke(_reference, new object[] { Element });
        // }
        
    }

    internal class CodeParameter2
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE80.GetType("EnvDTE80.CodeParameter2");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE80.CodeParameter2' from assembly 'EnvDTE80, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public CodeParameter2()
            : this(null)
        {
        }
        
        public CodeParameter2(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) ? reference : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 DTE
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("DTE").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements Collection
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Collection").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public System.String Name
        {
            get { return (System.String) ReferencedType.GetProperty("Name").GetValue(_reference, new object[] { }); }
            set { ReferencedType.GetProperty("Name").SetValue(_reference, value, new object[] { }); }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String FullName
        // {
        //     get { return (System.String) ReferencedType.GetProperty("FullName").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public ProjectItem ProjectItem
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("ProjectItem").GetValue(_reference, new object[] { });
        //         return value != null ? new ProjectItem(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMElement Kind
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Kind").GetValue(_reference, new object[] { });
        //         return value != null ? new vsCMElement(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsCodeType
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsCodeType").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMInfoLocation InfoLocation
        // {
        //     get { return (vsCMInfoLocation) ReferencedType.GetProperty("InfoLocation").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements Children
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Children").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Language
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Language").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint StartPoint
        // {
        //     get { return (TextPoint) ReferencedType.GetProperty("StartPoint").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint EndPoint
        // {
        //     get { return (TextPoint) ReferencedType.GetProperty("EndPoint").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object ExtenderNames
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("ExtenderNames").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object Extender
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("Extender").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String ExtenderCATID
        // {
        //     get { return (System.String) ReferencedType.GetProperty("ExtenderCATID").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElement2 Parent
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Parent").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElement2(value) : null;
        //     }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public CodeTypeRef Type
        {
            get
            {
                object value = ReferencedType.GetProperty("Type").GetValue(_reference, new object[] { });
                return value != null ? new CodeTypeRef(value) : null;
            }
            set { ReferencedType.GetProperty("Type").SetValue(_reference, value != null ? value.Reference : null, new object[] { }); }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements Attributes
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Attributes").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String DocComment
        // {
        //     get { return (System.String) ReferencedType.GetProperty("DocComment").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("DocComment").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMParameterKind ParameterKind
        // {
        //     get { return (vsCMParameterKind) ReferencedType.GetProperty("ParameterKind").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("ParameterKind").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String DefaultValue
        // {
        //     get { return (System.String) ReferencedType.GetProperty("DefaultValue").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("DefaultValue").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint GetStartPoint(vsCMPart Part)
        // {
        //     object value = ReferencedType.GetMethod("GetStartPoint").Invoke(_reference, new object[] { Part });
        //     return (TextPoint) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint GetEndPoint(vsCMPart Part)
        // {
        //     object value = ReferencedType.GetMethod("GetEndPoint").Invoke(_reference, new object[] { Part });
        //     return (TextPoint) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeAttribute2 AddAttribute(System.String Name, System.String Value, System.Object Position)
        // {
        //     object value = ReferencedType.GetMethod("AddAttribute").Invoke(_reference, new object[] { Name, Value, Position });
        //     return value != null ? new CodeAttribute2(value) : null;
        // }
        
    }

    internal class CodeAttribute2
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE80.GetType("EnvDTE80.CodeAttribute2");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE80.CodeAttribute2' from assembly 'EnvDTE80, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public CodeAttribute2()
            : this(null)
        {
        }
        
        public CodeAttribute2(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) ? reference : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 DTE
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("DTE").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements Collection
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Collection").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public System.String Name
        {
            get { return (System.String) ReferencedType.GetProperty("Name").GetValue(_reference, new object[] { }); }
            set { ReferencedType.GetProperty("Name").SetValue(_reference, value, new object[] { }); }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String FullName
        // {
        //     get { return (System.String) ReferencedType.GetProperty("FullName").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public ProjectItem ProjectItem
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("ProjectItem").GetValue(_reference, new object[] { });
        //         return value != null ? new ProjectItem(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMElement Kind
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Kind").GetValue(_reference, new object[] { });
        //         return value != null ? new vsCMElement(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsCodeType
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsCodeType").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsCMInfoLocation InfoLocation
        // {
        //     get { return (vsCMInfoLocation) ReferencedType.GetProperty("InfoLocation").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements Children
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Children").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Language
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Language").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint StartPoint
        // {
        //     get { return (TextPoint) ReferencedType.GetProperty("StartPoint").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint EndPoint
        // {
        //     get { return (TextPoint) ReferencedType.GetProperty("EndPoint").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object ExtenderNames
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("ExtenderNames").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object Extender
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("Extender").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String ExtenderCATID
        // {
        //     get { return (System.String) ReferencedType.GetProperty("ExtenderCATID").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object Parent
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("Parent").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Value
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Value").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("Value").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Target
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Target").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("Target").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeElements Arguments
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Arguments").GetValue(_reference, new object[] { });
        //         return value != null ? new CodeElements(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint GetStartPoint(vsCMPart Part)
        // {
        //     object value = ReferencedType.GetMethod("GetStartPoint").Invoke(_reference, new object[] { Part });
        //     return (TextPoint) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public TextPoint GetEndPoint(vsCMPart Part)
        // {
        //     object value = ReferencedType.GetMethod("GetEndPoint").Invoke(_reference, new object[] { Part });
        //     return (TextPoint) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void Delete()
        // {
        //     ReferencedType.GetMethod("Delete").Invoke(_reference, new object[] {  });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public CodeAttributeArgument AddArgument(System.String Value, System.Object Name, System.Object Position)
        // {
        //     object value = ReferencedType.GetMethod("AddArgument").Invoke(_reference, new object[] { Value, Name, Position });
        //     return (CodeAttributeArgument) value;
        // }
        
    }

    internal class DTE2
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE80.GetType("EnvDTE80.DTE2");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE80.DTE2' from assembly 'EnvDTE80, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public DTE2()
            : this(null)
        {
        }
        
        public DTE2(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) ? reference : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Name
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Name").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String FileName
        // {
        //     get { return (System.String) ReferencedType.GetProperty("FileName").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Version
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Version").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object CommandBars
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("CommandBars").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Windows Windows
        // {
        //     get { return (Windows) ReferencedType.GetProperty("Windows").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Events Events
        // {
        //     get { return (Events) ReferencedType.GetProperty("Events").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public AddIns AddIns
        // {
        //     get { return (AddIns) ReferencedType.GetProperty("AddIns").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Window MainWindow
        // {
        //     get { return (Window) ReferencedType.GetProperty("MainWindow").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Window ActiveWindow
        // {
        //     get { return (Window) ReferencedType.GetProperty("ActiveWindow").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsDisplay DisplayMode
        // {
        //     get { return (vsDisplay) ReferencedType.GetProperty("DisplayMode").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("DisplayMode").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Solution Solution
        // {
        //     get { return (Solution) ReferencedType.GetProperty("Solution").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Commands Commands
        // {
        //     get { return (Commands) ReferencedType.GetProperty("Commands").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Properties Properties
        // {
        //     get { return (Properties) ReferencedType.GetProperty("Properties").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public SelectedItems SelectedItems
        // {
        //     get { return (SelectedItems) ReferencedType.GetProperty("SelectedItems").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String CommandLineArguments
        // {
        //     get { return (System.String) ReferencedType.GetProperty("CommandLineArguments").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsOpenFile
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsOpenFile").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 DTE
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("DTE").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Int32 LocaleID
        // {
        //     get { return (System.Int32) ReferencedType.GetProperty("LocaleID").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public WindowConfigurations WindowConfigurations
        // {
        //     get { return (WindowConfigurations) ReferencedType.GetProperty("WindowConfigurations").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Documents Documents
        // {
        //     get { return (Documents) ReferencedType.GetProperty("Documents").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public Document ActiveDocument
        {
            get
            {
                object value = ReferencedType.GetProperty("ActiveDocument").GetValue(_reference, new object[] { });
                return value != null ? new Document(value) : null;
            }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Globals Globals
        // {
        //     get { return (Globals) ReferencedType.GetProperty("Globals").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public StatusBar StatusBar
        // {
        //     get { return (StatusBar) ReferencedType.GetProperty("StatusBar").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String FullName
        // {
        //     get { return (System.String) ReferencedType.GetProperty("FullName").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean UserControl
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("UserControl").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("UserControl").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public ObjectExtenders ObjectExtenders
        // {
        //     get { return (ObjectExtenders) ReferencedType.GetProperty("ObjectExtenders").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Find Find
        // {
        //     get { return (Find) ReferencedType.GetProperty("Find").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsIDEMode Mode
        // {
        //     get { return (vsIDEMode) ReferencedType.GetProperty("Mode").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public ItemOperations ItemOperations
        // {
        //     get { return (ItemOperations) ReferencedType.GetProperty("ItemOperations").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public UndoContext UndoContext
        {
            get
            {
                object value = ReferencedType.GetProperty("UndoContext").GetValue(_reference, new object[] { });
                return value != null ? new UndoContext(value) : null;
            }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Macros Macros
        // {
        //     get { return (Macros) ReferencedType.GetProperty("Macros").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object ActiveSolutionProjects
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("ActiveSolutionProjects").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 MacrosIDE
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("MacrosIDE").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String RegistryRoot
        // {
        //     get { return (System.String) ReferencedType.GetProperty("RegistryRoot").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 Application
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Application").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public ContextAttributes ContextAttributes
        // {
        //     get { return (ContextAttributes) ReferencedType.GetProperty("ContextAttributes").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public SourceControl SourceControl
        // {
        //     get { return (SourceControl) ReferencedType.GetProperty("SourceControl").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean SuppressUI
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("SuppressUI").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("SuppressUI").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Debugger Debugger
        // {
        //     get { return (Debugger) ReferencedType.GetProperty("Debugger").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Edition
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Edition").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public ToolWindows ToolWindows
        // {
        //     get { return (ToolWindows) ReferencedType.GetProperty("ToolWindows").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void Quit()
        // {
        //     ReferencedType.GetMethod("Quit").Invoke(_reference, new object[] {  });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object GetObject(System.String Name)
        // {
        //     object value = ReferencedType.GetMethod("GetObject").Invoke(_reference, new object[] { Name });
        //     return (System.Object) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Window OpenFile(System.String ViewKind, System.String FileName)
        // {
        //     object value = ReferencedType.GetMethod("OpenFile").Invoke(_reference, new object[] { ViewKind, FileName });
        //     return (Window) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void ExecuteCommand(System.String CommandName, System.String CommandArgs)
        // {
        //     ReferencedType.GetMethod("ExecuteCommand").Invoke(_reference, new object[] { CommandName, CommandArgs });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public wizardResult LaunchWizard(System.String VSZFile, System.Object[]& ContextParams)
        // {
        //     object value = ReferencedType.GetMethod("LaunchWizard").Invoke(_reference, new object[] { VSZFile, ContextParams });
        //     return (wizardResult) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String SatelliteDllPath(System.String Path, System.String Name)
        // {
        //     object value = ReferencedType.GetMethod("SatelliteDllPath").Invoke(_reference, new object[] { Path, Name });
        //     return (System.String) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.UInt32 GetThemeColor(vsThemeColors Element)
        // {
        //     object value = ReferencedType.GetMethod("GetThemeColor").Invoke(_reference, new object[] { Element });
        //     return (System.UInt32) value;
        // }
        
    }

    internal class UndoContext
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE.GetType("EnvDTE.UndoContext");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE.UndoContext' from assembly 'EnvDTE, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public UndoContext()
            : this(null)
        {
        }
        
        public UndoContext(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) ? reference : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 DTE
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("DTE").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 Parent
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Parent").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsStrict
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsStrict").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsAborted
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsAborted").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public System.Boolean IsOpen
        {
            get { return (System.Boolean) ReferencedType.GetProperty("IsOpen").GetValue(_reference, new object[] { }); }
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public void Open(System.String Name, System.Boolean Strict)
        {
            ReferencedType.GetMethod("Open").Invoke(_reference, new object[] { Name, Strict });
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public void Close()
        {
            ReferencedType.GetMethod("Close").Invoke(_reference, new object[] {  });
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void SetAborted()
        // {
        //     ReferencedType.GetMethod("SetAborted").Invoke(_reference, new object[] {  });
        // }
        
    }

    internal class Document
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE.GetType("EnvDTE.Document");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE.Document' from assembly 'EnvDTE, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public Document()
            : this(null)
        {
        }
        
        public Document(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) ? reference : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 DTE
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("DTE").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Kind
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Kind").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Documents Collection
        // {
        //     get { return (Documents) ReferencedType.GetProperty("Collection").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Window ActiveWindow
        // {
        //     get { return (Window) ReferencedType.GetProperty("ActiveWindow").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String FullName
        // {
        //     get { return (System.String) ReferencedType.GetProperty("FullName").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Name
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Name").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Path
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Path").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean ReadOnly
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("ReadOnly").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("ReadOnly").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean Saved
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("Saved").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("Saved").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Windows Windows
        // {
        //     get { return (Windows) ReferencedType.GetProperty("Windows").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public ProjectItem ProjectItem
        {
            get
            {
                object value = ReferencedType.GetProperty("ProjectItem").GetValue(_reference, new object[] { });
                return value != null ? new ProjectItem(value) : null;
            }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object Selection
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("Selection").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object Extender
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("Extender").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object ExtenderNames
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("ExtenderNames").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String ExtenderCATID
        // {
        //     get { return (System.String) ReferencedType.GetProperty("ExtenderCATID").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Int32 IndentSize
        // {
        //     get { return (System.Int32) ReferencedType.GetProperty("IndentSize").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Language
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Language").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("Language").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Int32 TabSize
        // {
        //     get { return (System.Int32) ReferencedType.GetProperty("TabSize").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Type
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Type").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void Activate()
        // {
        //     ReferencedType.GetMethod("Activate").Invoke(_reference, new object[] {  });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void Close(vsSaveChanges Save)
        // {
        //     ReferencedType.GetMethod("Close").Invoke(_reference, new object[] { Save });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Window NewWindow()
        // {
        //     object value = ReferencedType.GetMethod("NewWindow").Invoke(_reference, new object[] {  });
        //     return (Window) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean Redo()
        // {
        //     object value = ReferencedType.GetMethod("Redo").Invoke(_reference, new object[] {  });
        //     return (System.Boolean) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean Undo()
        // {
        //     object value = ReferencedType.GetMethod("Undo").Invoke(_reference, new object[] {  });
        //     return (System.Boolean) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public vsSaveStatus Save(System.String FileName)
        // {
        //     object value = ReferencedType.GetMethod("Save").Invoke(_reference, new object[] { FileName });
        //     return (vsSaveStatus) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object Object(System.String ModelKind)
        // {
        //     object value = ReferencedType.GetMethod("Object").Invoke(_reference, new object[] { ModelKind });
        //     return (System.Object) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void PrintOut()
        // {
        //     ReferencedType.GetMethod("PrintOut").Invoke(_reference, new object[] {  });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void ClearBookmarks()
        // {
        //     ReferencedType.GetMethod("ClearBookmarks").Invoke(_reference, new object[] {  });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean MarkText(System.String Pattern, System.Int32 Flags)
        // {
        //     object value = ReferencedType.GetMethod("MarkText").Invoke(_reference, new object[] { Pattern, Flags });
        //     return (System.Boolean) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean ReplaceText(System.String FindText, System.String ReplaceText, System.Int32 Flags)
        // {
        //     object value = ReferencedType.GetMethod("ReplaceText").Invoke(_reference, new object[] { FindText, ReplaceText, Flags });
        //     return (System.Boolean) value;
        // }
        
    }

    internal class ProjectItem
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.EnvDTE.GetType("EnvDTE.ProjectItem");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'EnvDTE.ProjectItem' from assembly 'EnvDTE, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public ProjectItem()
            : this(null)
        {
        }
        
        public ProjectItem(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) ? reference : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsDirty
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsDirty").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("IsDirty").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String FileNames
        // {
        //     get { return (System.String) ReferencedType.GetProperty("FileNames").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Int16 FileCount
        // {
        //     get { return (System.Int16) ReferencedType.GetProperty("FileCount").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Name
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Name").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("Name").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public ProjectItems Collection
        // {
        //     get { return (ProjectItems) ReferencedType.GetProperty("Collection").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Properties Properties
        // {
        //     get { return (Properties) ReferencedType.GetProperty("Properties").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 DTE
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("DTE").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String Kind
        // {
        //     get { return (System.String) ReferencedType.GetProperty("Kind").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public ProjectItems ProjectItems
        // {
        //     get { return (ProjectItems) ReferencedType.GetProperty("ProjectItems").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean IsOpen
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("IsOpen").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public System.Object Object
        {
            get { return (System.Object) ReferencedType.GetProperty("Object").GetValue(_reference, new object[] { }); }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object Extender
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("Extender").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Object ExtenderNames
        // {
        //     get { return (System.Object) ReferencedType.GetProperty("ExtenderNames").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String ExtenderCATID
        // {
        //     get { return (System.String) ReferencedType.GetProperty("ExtenderCATID").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean Saved
        // {
        //     get { return (System.Boolean) ReferencedType.GetProperty("Saved").GetValue(_reference, new object[] { }); }
        //     set { ReferencedType.GetProperty("Saved").SetValue(_reference, value, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public ConfigurationManager ConfigurationManager
        // {
        //     get { return (ConfigurationManager) ReferencedType.GetProperty("ConfigurationManager").GetValue(_reference, new object[] { }); }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public FileCodeModel2 FileCodeModel
        {
            get
            {
                object value = ReferencedType.GetProperty("FileCodeModel").GetValue(_reference, new object[] { });
                return value != null ? new FileCodeModel2(value) : null;
            }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Document Document
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("Document").GetValue(_reference, new object[] { });
        //         return value != null ? new Document(value) : null;
        //     }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Project SubProject
        // {
        //     get { return (Project) ReferencedType.GetProperty("SubProject").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Project ContainingProject
        // {
        //     get { return (Project) ReferencedType.GetProperty("ContainingProject").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.Boolean SaveAs(System.String NewFileName)
        // {
        //     object value = ReferencedType.GetMethod("SaveAs").Invoke(_reference, new object[] { NewFileName });
        //     return (System.Boolean) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Window Open(System.String ViewKind)
        // {
        //     object value = ReferencedType.GetMethod("Open").Invoke(_reference, new object[] { ViewKind });
        //     return (Window) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void Remove()
        // {
        //     ReferencedType.GetMethod("Remove").Invoke(_reference, new object[] {  });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void ExpandView()
        // {
        //     ReferencedType.GetMethod("ExpandView").Invoke(_reference, new object[] {  });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void Save(System.String FileName)
        // {
        //     ReferencedType.GetMethod("Save").Invoke(_reference, new object[] { FileName });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void Delete()
        // {
        //     ReferencedType.GetMethod("Delete").Invoke(_reference, new object[] {  });
        // }
        
    }

    internal class VSWebProjectItem
    {
        public static Type ReferencedType
        {
            get
            {
                if (_referencedType == null)
                {
                    _referencedType = ReferencedAssemblies.VsWebSite.GetType("VsWebSite.VSWebProjectItem");
                    if (_referencedType == null)
                    {
                        throw new InvalidOperationException("Failed to load type 'VsWebSite.VSWebProjectItem' from assembly 'VsWebSite.Interop, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'.");
                    }
                }
                return _referencedType;
            }
        }
        private static Type _referencedType;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public object Reference
        {
            get { return _reference; }
            set { _reference = value; }
        }
        private object _reference;
        
        public VSWebProjectItem()
            : this(null)
        {
        }
        
        public VSWebProjectItem(object reference)
        {
            _reference = ReferencedType.IsInstanceOfType(reference) ? reference : null;
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public DTE2 DTE
        // {
        //     get
        //     {
        //         object value = ReferencedType.GetProperty("DTE").GetValue(_reference, new object[] { });
        //         return value != null ? new DTE2(value) : null;
        //     }
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public ProjectItem ProjectItem
        {
            get
            {
                object value = ReferencedType.GetProperty("ProjectItem").GetValue(_reference, new object[] { });
                return value != null ? new ProjectItem(value) : null;
            }
        }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public Project ContainingProject
        // {
        //     get { return (Project) ReferencedType.GetProperty("ContainingProject").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public RelatedFiles RelatedFiles
        // {
        //     get { return (RelatedFiles) ReferencedType.GetProperty("RelatedFiles").GetValue(_reference, new object[] { }); }
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public System.String UpdateLocalCopy()
        // {
        //     object value = ReferencedType.GetMethod("UpdateLocalCopy").Invoke(_reference, new object[] {  });
        //     return (System.String) value;
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void UpdateRemoteCopy()
        // {
        //     ReferencedType.GetMethod("UpdateRemoteCopy").Invoke(_reference, new object[] {  });
        // }
        
        // [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        // public void WaitUntilReady()
        // {
        //     ReferencedType.GetMethod("WaitUntilReady").Invoke(_reference, new object[] {  });
        // }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public void Load()
        {
            ReferencedType.GetMethod("Load").Invoke(_reference, new object[] {  });
        }
        
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Auto-generated wrapper")]
        public void Unload()
        {
            ReferencedType.GetMethod("Unload").Invoke(_reference, new object[] {  });
        }
        
    }

}