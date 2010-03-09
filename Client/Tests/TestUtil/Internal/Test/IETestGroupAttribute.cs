namespace Microsoft.Internal.Test {
    using System;

    [AttributeUsage(AttributeTargets.All, AllowMultiple=true)]
    public class IETestGroupAttribute : Attribute {
        private string _groupName;
        private IETestMode _mode;

        public IETestGroupAttribute(string groupName) {
            this._groupName = groupName;
        }

        public string GroupName {
            get {
                return _groupName;
            }
            set {
                _groupName = value;
            }
        }

        public IETestMode Mode {
            get {
                return _mode;
            }
            set {
                if (value < IETestMode.DebugAndRelease || value > IETestMode.ReleaseOnly) {
                    throw new ArgumentOutOfRangeException("mode");
                }
                _mode = value;
            }
        }

    }
}

