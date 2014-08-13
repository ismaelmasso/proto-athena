/**
 * List/Search groups
 */

function main ()
{
	// Get the args
	var siteShortName = args["site"];
	var shortNameFilter = args["shortNameFilter"];
	var zone = args["zone"];
    var sortBy = args["sortBy"];
    var sortAsc = args["dir"] != "desc";
    var paging = utils.createPaging(args);
	
	if (shortNameFilter == null)
	{
		shortNameFilter = "";
	}

    if (sortBy == null)
    {
        sortBy = "displayName";
    }

	logger.log("Passing site to /api/groups : "+siteShortName);
	logger.log("shortNameFilter: "+shortNameFilter);
    if (siteShortName != null)
    {
        var site = siteService.getSite(siteShortName);
        if (site == null) {
            // Site cannot be found
            status.setCode(status.STATUS_NOT_FOUND, "The site " + siteShortName + " does not exist.");
            return;
        }
        var siteNode = site.node;
        model.groupNames = siteNode.properties["rrdathena:groupNames"];
    }

    // Get the groups
    model.groups = groups.getGroupsInZone(shortNameFilter, zone, paging, sortBy, sortAsc);
    model.paging = paging;
}

main();
