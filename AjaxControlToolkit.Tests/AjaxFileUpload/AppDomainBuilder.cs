using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Drawing.Printing;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security;
using System.Security.Permissions;
using System.Text;
using System.Web;

namespace AjaxControlToolkit.Tests {

    class AppDomainBuilder {

        internal AppDomain CreateMediumTrustDomain() {
            var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
            var systemWebAssemblyNames = new string[]{
                "System.Web, PublicKey=002400000480000094000000060200000024000052534131000400000100010007d1fa57c4aed9f0a32e84aa0faefd0de9e8fd6aec8f87fb03766c834c99921eb23be79ad9d5dcc1dd9ad236132102900b723cf980957fc4e177108fc607774f29e8320e92ea05ece4e821c0a5efe8f1645c4c0c93c1ab99285d622caa652c1dfad63d745d6f2de5f17e5eaf0fc4963d261c8a12436518206dc093344d5ad293",
                "System.Web.Abstractions, PublicKey=0024000004800000940000000602000000240000525341310004000001000100b5fc90e7027f67871e773a8fde8938c81dd402ba65b9201d60593e96c492651e889cc13f1415ebb53fac1131ae0bd333c5ee6021672d9718ea31a8aebd0da0072f25d87dba6fc90ffd598ed4da35e44c398c454307e8e33b8426143daec9f596836f97c8f74750e5975c64e2189f45def46b2a2b1247adc3652bf5c308055da9",
                "System.Web.ApplicationServices, PublicKey=0024000004800000940000000602000000240000525341310004000001000100b5fc90e7027f67871e773a8fde8938c81dd402ba65b9201d60593e96c492651e889cc13f1415ebb53fac1131ae0bd333c5ee6021672d9718ea31a8aebd0da0072f25d87dba6fc90ffd598ed4da35e44c398c454307e8e33b8426143daec9f596836f97c8f74750e5975c64e2189f45def46b2a2b1247adc3652bf5c308055da9",
                "System.Web.DataVisualization, PublicKey=0024000004800000940000000602000000240000525341310004000001000100b5fc90e7027f67871e773a8fde8938c81dd402ba65b9201d60593e96c492651e889cc13f1415ebb53fac1131ae0bd333c5ee6021672d9718ea31a8aebd0da0072f25d87dba6fc90ffd598ed4da35e44c398c454307e8e33b8426143daec9f596836f97c8f74750e5975c64e2189f45def46b2a2b1247adc3652bf5c308055da9",
                "System.Web.DynamicData, PublicKey=0024000004800000940000000602000000240000525341310004000001000100b5fc90e7027f67871e773a8fde8938c81dd402ba65b9201d60593e96c492651e889cc13f1415ebb53fac1131ae0bd333c5ee6021672d9718ea31a8aebd0da0072f25d87dba6fc90ffd598ed4da35e44c398c454307e8e33b8426143daec9f596836f97c8f74750e5975c64e2189f45def46b2a2b1247adc3652bf5c308055da9",
                "System.Web.Extensions, PublicKey=0024000004800000940000000602000000240000525341310004000001000100b5fc90e7027f67871e773a8fde8938c81dd402ba65b9201d60593e96c492651e889cc13f1415ebb53fac1131ae0bd333c5ee6021672d9718ea31a8aebd0da0072f25d87dba6fc90ffd598ed4da35e44c398c454307e8e33b8426143daec9f596836f97c8f74750e5975c64e2189f45def46b2a2b1247adc3652bf5c308055da9",
                "System.Web.Routing, PublicKey=0024000004800000940000000602000000240000525341310004000001000100b5fc90e7027f67871e773a8fde8938c81dd402ba65b9201d60593e96c492651e889cc13f1415ebb53fac1131ae0bd333c5ee6021672d9718ea31a8aebd0da0072f25d87dba6fc90ffd598ed4da35e44c398c454307e8e33b8426143daec9f596836f97c8f74750e5975c64e2189f45def46b2a2b1247adc3652bf5c308055da9"
            };
            AppDomainSetup setup = new AppDomainSetup() {
                ApplicationBase = baseDirectory,
                PartialTrustVisibleAssemblies = systemWebAssemblyNames
            };

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
