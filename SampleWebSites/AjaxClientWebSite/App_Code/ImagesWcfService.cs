using System;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Collections.Generic;
using ImagesModel;
using CustomData;

[DataContract]
public class ImageInfo
{
    [DataMember]
    public int ImageID;
    [DataMember]
    public string Name;
    [DataMember]
    public string Description;
    [DataMember]
    public string Contributor;
    [DataMember]
    public string Uri;
}

[ServiceContract(Namespace = "Uc")]
[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
public class ImagesWcfService
{
    static List<ImageInfo> imageInfos = null; 
    
    public ImagesWcfService() {
        if (imageInfos == null)
        {
            ImagesEntities dc = new ImagesEntities();
            imageInfos = new List<ImageInfo>();
            var images = dc.Images.Include("Contributor");
            foreach (Images image in images)
            {
                imageInfos.Add(new ImageInfo() { ImageID = image.ImageID, Name = image.Name, Description = image.Description, Contributor = (image.Contributor == null) ? "" : image.Contributor.FirstName + " " + image.Contributor.LastName, Uri = image.Uri });
            }
        } 
    }

    [OperationContract]
    public ImageInfo[] GetImages(string orderby)
    {
        var results = from c in imageInfos
                      select c;
        switch (orderby)
        {
            case "Description":
                results = imageInfos.OrderBy(n => n.Description);
                break;
            case "Contributor":
                results = imageInfos.OrderBy(n => n.Contributor);
                break;
            default:
                results = imageInfos.OrderBy(n => n.Name);
                break;
        }
        return results.ToArray();
    }

    [OperationContract]
    public void SaveImages(List<Change<ImageInfo>> changeSet)
    {
        foreach (var c in changeSet)
        {
            switch (c.action)
            {
                case ChangeOperationType.insert:
                    InsertImage(c.item);
                    break;
                case ChangeOperationType.update:
                    UpdateImage(c.item);
                    break;
                case ChangeOperationType.remove:
                    RemoveImage(c.item);
                    break;
            }
        }
    }

    public void InsertImage(ImageInfo newImage)
    {
        int newID = 0;
        foreach (ImageInfo image in imageInfos)
        {
            if (image.ImageID >= newID)
            {
                newID = image.ImageID + 1;
            }
        }
        newImage.ImageID = newID;
        imageInfos.Add(newImage);
    }

    public void RemoveImage(ImageInfo removedImage)
    {
        foreach (ImageInfo image in imageInfos)
        {
            if (image.ImageID.Equals(removedImage.ImageID))
            {
                imageInfos.Remove(image);
                break;
            }
        }
    }

    public void UpdateImage(ImageInfo updatedImage)
    {
        foreach (ImageInfo image in imageInfos)
        {
            if (image.ImageID.Equals(updatedImage.ImageID))
            {
                image.Name = updatedImage.Name;
                image.Description = updatedImage.Description;
                image.Contributor = updatedImage.Contributor;
                image.Uri = updatedImage.Uri;
                break;
            }
        }
    }
}

