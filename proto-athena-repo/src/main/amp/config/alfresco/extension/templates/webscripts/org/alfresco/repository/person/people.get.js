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
    var usad = people.getPerson(person.properties.userName)
	if(people.isAdmin(usad)){
	 model.peoplelist.push(peopleCollection);
	 model.peoplelist = peopleCollection;
	 return ;
	}
	
    //RRD - Define list of site accessible by currently logged user
    var userSites = null;
      userSites = siteService.listUserSites(person.properties.userName, 1000);
 
      notAllowed = [];

    //RRD: Fetch the user's groups; add the user *only if* there's one group in common
    //with groupNames list
    if(userSites==null) return ;
    for(i in userSites)
    {
        var site = siteService.getSite(userSites[i].shortName);
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
                logger.info(groupNames+"Iterating on person '"+name+"' Group '"+personGroupName+"'; contained? "+arrContains(groupNames,personGroupName));
                if (arrContains(groupNames,personGroupName)) {
                    isVisible = true;
                }
            }
            logger.debug("Person '"+name+"' is visible? "+isVisible);

            //RRD: Filter OUT users that are NOT part of at least one visible groups
            if (isVisible && !containsuser(notAllowed,name))
            {
                model.peoplelist.push(peopleCollection[i]);
                notAllowed[i]=name;
            }
            
           
        }
    }/* else {
        model.peoplelist = peopleCollection;
    }*/
    
    notAllowed=null;
}

//RRD: util method (@TODO - duplicated with potentialmembers.get.js)
function arrContains(arr, value) {
if(arr==undefined||arr==null){arr=[];}
    var i = arr.length;
    while (i--) {
    	if (arr[i] == value) return true;
    }
    return false;
}

function containsuser(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

main();