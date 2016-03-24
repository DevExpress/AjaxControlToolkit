using NUnit.Framework;
using System;
using System.Data.SqlClient;
using System.Drawing.Printing;
using System.Net;
using System.Net.Mail;
using System.Security;
using System.Security.Permissions;
using System.Web;

namespace AjaxControlToolkit.Tests {

    [TestFixture]
    public class AjaxFileUploadTests {

        [Test]
        public void MediumTrust() {
            var appDomain = CreateMediumTrustDomain();
            var wrapper = (TestClassWrapper)appDomain.CreateInstanceAndUnwrap(
                typeof(TestClassWrapper).Assembly.FullName,
                typeof(TestClassWrapper).FullName);

            Assert.DoesNotThrow(() => wrapper.TestMethod(), "Medium trust environment exception");
        }

        class TestClassWrapper : MarshalByRefObject {
            public void TestMethod() {
                AjaxFileUploadHelper.RootTempFolderPath = "";
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
