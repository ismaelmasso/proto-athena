function main() {
    // Get the site
    var shortName = url.extension.split("/")[0];
    var site = siteService.getSite(shortName);
    if (site == null)
    {
        // Site cannot be found
        status.setCode(status.STATUS_NOT_FOUND, "The site " + shortName + " does not exist.");
        return;
    }

    // Get the list of granted groups for the current site
    groupNames = site.node.properties["rrdathena:groupNames"];
    if (groupNames == null) {
        groups = [];
    } else {
        groups = groupNames.split(",");
    }
    model.groups = groups;
}
main();