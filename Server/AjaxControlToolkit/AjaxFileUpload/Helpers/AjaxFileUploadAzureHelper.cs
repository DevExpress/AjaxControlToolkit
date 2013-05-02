using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;

namespace AjaxControlToolkit
{
    public class AjaxFileUploadAzureHelper
    {

        internal static void StoreToAzure(string azureConnectionString, string azureContainerName, AjaxFileUploadEventArgs args)
        {
            if(string.IsNullOrEmpty(azureConnectionString))
                throw new Exception("You must provide azure connection string since you set StoreToAzure property to true.");

            var storageAccount = CloudStorageAccount.DevelopmentStorageAccount;
            if (azureConnectionString.ToLower().Replace(" ", "") != "usedevelopmentstorage=true")
                storageAccount = CloudStorageAccount.Parse(azureConnectionString);

            var blobClient = storageAccount.CreateCloudBlobClient();
            var blobContainer = blobClient.GetContainerReference(azureContainerName);
            if (!blobContainer.Exists())
                blobContainer.Create();

            var blob = blobContainer.GetBlockBlobReference(args.FileName);

            if (blob.Exists())
                blob.Delete();

            using (var stream = args.GetStreamContents())
            {
                blob.UploadFromStream(stream);
            }
            
        }
    }
}
