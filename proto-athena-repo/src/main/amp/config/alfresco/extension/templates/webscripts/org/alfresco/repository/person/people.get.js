// Get the args
var filter = args["filter"];
var maxResults = args["maxResults"];
var sortBy = args["sortBy"];
var sortAsc = args["dir"] != "desc";
var siteShortName = args["site"];

function main() {
    // Get the collection of people
    var peopleCollection = people.getPeople(filter, maxResults != null ? parseInt(maxResults) : 0, sortBy, sortAsc);

    // Pass the queried sites to the template
    model.peoplelist = [];

    //RRD: Fetch the user's groups; add the user *only if* there's one group in common
    //with groupNames list
    if (siteShortName != null)
    {
        var site = siteService.getSite(siteShortName);
        if (site == null) {
            // Site cannot be found
            status.setCode(status.STATUS_NOT_FOUND, "The site " + siteShortName + " does not exist.");
            return;
        }
        var siteNode = site.node;
        groupNames = siteNode.properties["rrdathena:groupNames"];

        for (i = 0, ii = peopleCollection.length; i < ii; i++)
        {
            name = search.findNode(peopleCollection[i]).properties.userName;
            var personNode = people.getPerson(name);
            var personGroups = people.getContainerGroups(personNode);
            var isVisible = false;

            for (j = 0, jj = personGroups.length; j < jj; j++) {
                personGroup = personGroups[j];
                var personGroupName = personGroups[j].properties.authorityName;
                logger.debug("Iterating on person '"+name+"' Group '"+personGroupName+"'; contained? "+arrContains(groupNames,personGroupName));
                if (arrContains(groupNames,personGroupName)) {
                    isVisible = true;
                }
            }
            logger.debug("Person '"+name+"' is visible? "+isVisible);

            //RRD: Filter OUT users that are NOT part of at least one visible groups
            if (isVisible)
            {
                model.peoplelist.push(peopleCollection[i]);
            }
        }
    } else {
        model.peoplelist = peopleCollection;
    }
}

//RRD: util method (@TODO - duplicated with potentialmembers.get.js)
function arrContains(arr, value) {
    var i = arr.length;
    while (i--) {
    	if (arr[i] == value) return true;
    }
    return false;
}

main();