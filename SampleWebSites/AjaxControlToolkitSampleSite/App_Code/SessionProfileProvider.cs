// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.


using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web.Profile;

/// <summary>
/// A stub implementation of a profile provider that lets us save values into
/// the session instead of creating a DB
/// </summary>
public class SessionProfileProvider : ProfileProvider
{
    private static Dictionary<string, Dictionary<string, object>> _profileValues = new Dictionary<string, Dictionary<string, object>>();

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
        get { return "ToolkitSampleWebsite"; }
        set { }
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