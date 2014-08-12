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

    var workflowNames = [];

	// Are we adding a group ?
	if (json.has("workflows")) {
	    var workflows = json.getJSONArray("workflows");

	    for (i=0; i < workflows.length(); i++) {
            workflow = workflows.get(i);

	    	// Get the user name
		    var workflowName = workflow.get("itemName");

		    logger.log("Granting Workflow Definition name '"+workflowName+"' to site '"+shortName+"' shortName");

            if (workflowName == null)
            {
                status.setCode(status.STATUS_BAD_REQUEST, "The name for the Workflow Definition has not been set.");
                return;
            }
            workflowNames.push(workflowName);
        }

		// Update the group list value
		logger.log("Workflow Definitions for site '"+shortName+"': "+workflowNames);
		siteNode.properties["rrdathena:workflowNames"] = workflowNames;
        siteNode.save();
        return;
	}
	
	// Neither person or group specified.
	status.setCode(status.STATUS_BAD_REQUEST, "group has not been set.");
}

main();