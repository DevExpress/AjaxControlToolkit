using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Drawing.Printing;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Security;
using System.Security.Permissions;
using System.Text;
using System.Web;
using System.Web.Caching;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class AjaxFileUploadTests {

        [Test]
        public void ProcessStream_MediumTrust() {
            var appDomain = CreateMediumTrustDomain();
            var wrapper = (TestClassWrapper)appDomain.CreateInstanceAndUnwrap(
                typeof(TestClassWrapper).Assembly.FullName,
                typeof(TestClassWrapper).FullName);

            Assert.DoesNotThrow(() => wrapper.ProcessStreamNonChunked(), "Medium trust environment exception");
        }

        [Test]
        public void ProcessStreamWithTempRootPath_MediumTrust() {
            var appDomain = CreateMediumTrustDomain();
            var wrapper = (TestClassWrapper)appDomain.CreateInstanceAndUnwrap(
                typeof(TestClassWrapper).Assembly.FullName,
                typeof(TestClassWrapper).FullName);

            Assert.Throws<SecurityException>(() => wrapper.ProcessStreamWithTempRootPathNonChunked(), "Medium trust environment exception");
        }

        public class TestClassWrapper : MarshalByRefObject {

            public void ProcessStreamNonChunked() {
                AjaxFileUploadHelper.RootTempFolderPath = "";
                var stream = GenerateStreamFromString("------WebKitFormBoundaryuzPlX1oHHDDbSusw\r\nContent-Disposition: form-data; name=\"act-file-data\"; filename=\"1#.txt\"\r\nContent-Type: text/plain\r\n\r\n123\r\n------WebKitFormBoundaryuzPlX1oHHDDbSusw--\r\n");
                new AjaxFileUploadHelper().ProcessStream(new FakeCache(), stream, "fileId", "fileName", false, false, false);
            }

            public void ProcessStreamWithTempRootPathNonChunked() {
                AjaxFileUploadHelper.RootTempFolderPath = @"D:\";
                var stream = GenerateStreamFromString("------WebKitFormBoundaryuzPlX1oHHDDbSusw\r\nContent-Disposition: form-data; name=\"act-file-data\"; filename=\"1#.txt\"\r\nContent-Type: text/plain\r\n\r\n123\r\n------WebKitFormBoundaryuzPlX1oHHDDbSusw--\r\n");
                new AjaxFileUploadHelper().ProcessStream(new FakeCache(), stream, "fileId", "fileName", false, false, false);
            }

            MemoryStream GenerateStreamFromString(string value) {
                return new MemoryStream(Encoding.UTF8.GetBytes(value ?? ""));
            }

            private class FakeCache : IWebCache {

                Dictionary<string, object> set = new Dictionary<string, object>();

                public object this[string key] {
                    get {
                        if(set.ContainsKey(key))
                            return set[key];

                        return null;
                    }
                    set {
                        set[key] = value;
                    }
                }
            }
        }

        private AppDomain CreateMediumTrustDomain() {
            var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
            var setup = new AppDomainSetup() { ApplicationBase = baseDirectory };
            var permissions = new PermissionSet(null);
            permissions.AddPermission(new EnvironmentPermission(EnvironmentPermissionAccess.Read, "TEMP;TMP;USERNAME;OS;COMPUTERNAME"));

            var fileIOPersmission = new FileIOPermission(PermissionState.None);
            fileIOPersmission.AddPathList(FileIOPermissionAccess.Append, baseDirectory);
            fileIOPersmission.AddPathList(FileIOPermissionAccess.PathDiscovery, baseDirectory);
            fileIOPersmission.AddPathList(FileIOPermissionAccess.Read, baseDirectory);
            fileIOPersmission.AddPathList(FileIOPermissionAccess.Write, baseDirectory);
            permissions.AddPermission(fileIOPersmission);

            var isolatedStorageFilePermission = new IsolatedStorageFilePermission(PermissionState.None);
            isolatedStorageFilePermission.UsageAllowed = IsolatedStorageContainment.AssemblyIsolationByUser;
            isolatedStorageFilePermission.UserQuota = 9223372036854775807;
            permissions.AddPermission(isolatedStorageFilePermission);

            permissions.AddPermission(new ReflectionPermission(ReflectionPermissionFlag.RestrictedMemberAccess));

            permissions.AddPermission(new SecurityPermission(
                SecurityPermissionFlag.Execution
                | SecurityPermissionFlag.ControlThread
                | SecurityPermissionFlag.ControlPrincipal
                | SecurityPermissionFlag.RemotingConfiguration));

            var sqlPermission = new SqlClientPermission(PermissionState.Unrestricted);
            sqlPermission.AllowBlankPassword = false;
            permissions.AddPermission(sqlPermission);

            permissions.AddPermission(new DnsPermission(PermissionState.Unrestricted));

            permissions.AddPermission(new WebPermission(PermissionState.Unrestricted));

            permissions.AddPermission(new PrintingPermission(PrintingPermissionLevel.DefaultPrinting));

            permissions.AddPermission(new TypeDescriptorPermission(TypeDescriptorPermissionFlags.RestrictedRegistrationAccess));

            permissions.AddPermission(new AspNetHostingPermission(AspNetHostingPermissionLevel.Medium));

            permissions.AddPermission(new SmtpPermission(SmtpAccess.Connect));

            return AppDomain.CreateDomain("Medium Trust", null, setup, permissions);
        }
    }
}
