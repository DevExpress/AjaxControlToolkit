


using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Web.Profile;
using System.Collections.Generic;

/// <summary>
/// Summary description for SessionProfileProvider
/// </summary>
public class SessionProfileProvider : ProfileProvider
{
    static Dictionary<string, Dictionary<string, object>> _profileValues = new Dictionary<string, Dictionary<string, object>>();

    public SessionProfileProvider()
    {
    
    }

    public override int DeleteInactiveProfiles(ProfileAuthenticationOption authenticationOption, DateTime userInactiveSinceDate)
    {
        throw new Exception("The method or operation is not implemented.");
    }

    public override int DeleteProfiles(string[] usernames)
    {


        throw new Exception("The method or operation is not implemented.");
    }

    public override int DeleteProfiles(ProfileInfoCollection profiles)
    {

        throw new Exception("The method or operation is not implemented.");
    }

    public override ProfileInfoCollection FindInactiveProfilesByUserName(ProfileAuthenticationOption authenticationOption, string usernameToMatch, DateTime userInactiveSinceDate, int pageIndex, int pageSize, out int totalRecords)
    {
        throw new Exception("The method or operation is not implemented.");
    }

    public override ProfileInfoCollection FindProfilesByUserName(ProfileAuthenticationOption authenticationOption, string usernameToMatch, int pageIndex, int pageSize, out int totalRecords)
    {

        throw new Exception("The method or operation is not implemented.");
    }

    public override ProfileInfoCollection GetAllInactiveProfiles(ProfileAuthenticationOption authenticationOption, DateTime userInactiveSinceDate, int pageIndex, int pageSize, out int totalRecords)
    {
        throw new Exception("The method or operation is not implemented.");
    }

    public override ProfileInfoCollection GetAllProfiles(ProfileAuthenticationOption authenticationOption, int pageIndex, int pageSize, out int totalRecords)
    {
        throw new Exception("The method or operation is not implemented.");
    }

    public override int GetNumberOfInactiveProfiles(ProfileAuthenticationOption authenticationOption, DateTime userInactiveSinceDate)
    {
        throw new Exception("The method or operation is not implemented.");
    }

    public override string ApplicationName
    {
        get
        {
            return "ToolkitTestsProfile";
        }
        set
        {
            
        }
    }

    public override SettingsPropertyValueCollection GetPropertyValues(SettingsContext context, SettingsPropertyCollection collection)
    {
        string username = (string)context["UserName"];
        bool isAuthenticated = (bool)context["IsAuthenticated"];

        Dictionary<string, object> values = _profileValues.ContainsKey(username) ? _profileValues[username] : null;

        SettingsPropertyValueCollection spvc = new SettingsPropertyValueCollection();
               

        foreach (SettingsProperty prop in collection)
        {
            SettingsPropertyValue spv = new SettingsPropertyValue(prop);
            if (values != null && values.ContainsKey(prop.Name))
            {
                spv.PropertyValue = values[prop.Name];
            }
            else
            {
                spv.PropertyValue = prop.DefaultValue;
            }
            spvc.Add(spv);
        }
        return spvc;
    }

    public override void SetPropertyValues(SettingsContext context, SettingsPropertyValueCollection collection)
    {
        string username = (string)context["UserName"];
        bool isAuthenticated = (bool)context["IsAuthenticated"];

        Dictionary<string, object> values = _profileValues.ContainsKey(username) ? _profileValues[username] : null;

        if (values == null)
        {
            values = new Dictionary<string, object>();
            _profileValues[username] = values;
        }


        foreach (SettingsPropertyValue propValue in collection)
        {
            values[propValue.Property.Name] = propValue.PropertyValue;
        }
        
    }
}
