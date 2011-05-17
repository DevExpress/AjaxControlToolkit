using System;
using System.Data.Services;
using System.Collections.Generic;
using System.Linq;

public class ImagesDataService : DataService<ImagesModel.ImagesEntities>
{
    // This method is called only once to initialize service-wide policies.
    public static void InitializeService(IDataServiceConfiguration config)
    {
        // TODO: set rules to indicate which entity sets and service operations are visible, updatable, etc.
        // Examples:
        // config.SetEntitySetAccessRule("MyEntityset", EntitySetRights.AllRead);
        // config.SetServiceOperationAccessRule("MyServiceOperation", ServiceOperationRights.All);
        config.SetEntitySetAccessRule("*", EntitySetRights.All);
    }


    protected override void HandleException(HandleExceptionArgs args)
    {
        string message = "Message: " + args.Exception.Message;
        if (args.Exception.InnerException != null)
        {
            message += " InnerMessage: " + args.Exception.InnerException.Message;
        }
        args.Exception = new DataServiceException(400, "", message, "en-US", args.Exception);
    }
}