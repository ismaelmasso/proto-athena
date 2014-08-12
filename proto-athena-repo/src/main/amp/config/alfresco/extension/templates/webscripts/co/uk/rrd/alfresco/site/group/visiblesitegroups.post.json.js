function main()
{
	// Get the site 
	var shortName = url.extension.split("/")[0];
	var site = siteService.getSite(shortName);
	if (site == null) {
		// Site cannot be found
		status.setCode(status.STATUS_NOT_FOUND, "The site " + shortName + " does not exist.");
		return;
	}
	var siteNode = site.node;

    var groupNames = [];

	// Are we adding a group ?
	if (json.has("groups")) {
	    var groups = json.getJSONArray("groups");

	    for (i=0; i < groups.length(); i++) {
            group = groups.get(i);

	    	// Get the user name
		    var groupName = group.get("itemName");

		    logger.log("Granting group name '"+groupName+"' to site '"+shortName+"' shortName");

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
            groupNames.push(groupName);
        }

		// Update the group list value
		logger.log("Groupnames for site '"+shortName+"': "+groupNames);
		siteNode.properties["rrdathena:groupNames"] = groupNames;
        siteNode.save();
        return;
	}
	
	// Neither person or group specified.
	status.setCode(status.STATUS_BAD_REQUEST, "group has not been set.");
}

main();