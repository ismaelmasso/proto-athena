function main()
{
	// Get the site 
	var shortName = url.extension.split("/")[0];
	var site = siteService.getSite(shortName);
	if (site == null)
	{
		// Site cannot be found
		status.setCode(status.STATUS_NOT_FOUND, "The site " + shortName + " does not exist.");
		return;
	}

	// Are we adding a group ?
	if (json.has("group"))
	{
		// Get the user name
		var groupName = json.getJSONObject("group").get("fullName");
		if (groupName == null)
		{
			status.setCode(status.STATUS_BAD_REQUEST, "The fullName for the group has not been set.");
			return;
		}
		
		if(groupName.match("^GROUP_") == null)
		{
			status.setCode(status.STATUS_BAD_REQUEST, "Group Authority names should begin with 'GROUP_'.");
			return;	
		}
			
		var group = groups.getGroupForFullAuthorityName(groupName);
		if (group == null)
		{
			status.setCode(status.STATUS_BAD_REQUEST, "The group with group name " + groupName + " could not be found.");
			return;
		}


		// Set the membership details
		groupNames = site.node.properties["rrdathena:groupNames"];
		groupNames += ","+groupName;
		site.node.properties["rrdathena:groupNames"] = groupNames;

		return;
	}
	
	// Neither person or group specified.
	status.setCode(status.STATUS_BAD_REQUEST, "group has not been set.");
	return;
}

main();