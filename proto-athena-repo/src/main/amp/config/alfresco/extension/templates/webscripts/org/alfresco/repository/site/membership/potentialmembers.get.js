function main()
{
   // Get the args
   var siteShortName = url.templateArgs.shortname,
      site = siteService.getSite(siteShortName),
      showAll = args.showAll,
      filter = (args.filter != null) ? args.filter : (args.shortNameFilter != null) ? args.shortNameFilter : "",
      maxResults = (args.maxResults == null) ? 10 : parseInt(args.maxResults, 10),
      authorityType = args.authorityType,
      zone = args.zone;

   //RRD: Get the list of visible groups
   if (site == null) {
       // Site cannot be found
       status.setCode(status.STATUS_NOT_FOUND, "The site " + siteShortName + " does not exist.");
       return;
   }
   var siteNode = site.node;
   var groupNames = siteNode.properties["rrdathena:groupNames"];
   if (groupNames == null) {
       groupNames = [];
   }

   if (showAll == "true") {
       groupNames = null;
       logger.debug("Set groupNames to null, no filtering applied");
   }
   logger.debug("Group Names: "+groupNames);

   if (authorityType != null)
   {
      if (authorityType.match("USER|GROUP") == null)
      {
         status.setCode(status.STATUS_BAD_REQUEST, "The 'authorityType' argument must be either USER or GROUP.");
         return;
      }
   }

   var peopleFound = [],
      groupsFound = [],
      notAllowed = [],
      i, ii, name, paging,
      siteInvitations = [];

   if (authorityType == null || authorityType == "USER")
   {
      // Get the collection of people
      peopleFound = people.getPeople(filter, maxResults);

      //RRD: Initialise an empty list
      model.peopleFound = [];

      var criteria = {
              resourceName: siteShortName
           };
      siteInvitations = invitations.listInvitations(criteria);

      // Filter this collection for site membership
      for (i = 0, ii = peopleFound.length; i < ii; i++)
      {
         name = search.findNode(peopleFound[i]).properties.userName;

         //RRD: Fetch the user's groups; add the user *only if* there's one group in common
         //with groupNames list
         var personNode = people.getPerson(name);
         var personGroups = people.getContainerGroups(personNode);
         var isVisible = (groupNames == null);

         if (groupNames) {
             for (j = 0, jj = personGroups.length; j < jj; j++) {
                personGroup = personGroups[j];
                var personGroupName = personGroups[j].properties.authorityName;
                logger.debug("Iterating on person '"+name+"' Group '"+personGroupName+"'; contained? "+arrContains(groupNames,personGroupName));
                if (arrContains(groupNames,personGroupName)) {
                    isVisible = true;
                }
             }
             logger.debug("Person '"+name+"' is visible? "+isVisible);
         }

         //RRD: Filter OUT users that are NOT part of at least one visible groups
         if (!isVisible || site.getMembersRole(name) != null)
         {
            // User is already a member
            notAllowed.push(name);
         }
         else
         {
            if (contains(siteInvitations, name))
            {
               // User has already got an invitation
               notAllowed.push(name);
            } else {
                //RRD: Only add visible person objects
                model.peopleFound.push(peopleFound[i]);
            }
         }
      }

      //RRD: For backward-compatibility, keep the default behaviour if groupNames is null
      if (!groupNames) {
        model.peopleFound = peopleFound;
        logger.debug("Show all people");
      }
   }

   if (authorityType == null || authorityType == "GROUP")
   {
      // Get the collection of groups
      paging = utils.createPaging(maxResults, -1);
      groupsFound = groups.getGroupsInZone(filter, zone, paging, "displayName");

      //RRD: Initialise an empty list
      model.groupsFound = [];

      // Filter this collection for site membership
      for (i = 0, ii = groupsFound.length; i < ii; i++)
      {
         name = groupsFound[i].fullName;

         //RRD: filter OUT groups whose name IS NOT contained in groupNames
         if ((groupNames && !arrContains(groupNames,name)) || site.getMembersRole(name) != null)
         {
            // Group is already a member
            notAllowed.push(name);
         } else {
            //RRD: Only add matching groups
            model.groupsFound.push(groupsFound[i]);
         }
      }

      //RRD: For backward-compatibility, keep the default behaviour if groupNames is null
      if (!groupNames) {
        model.groupsFound = groupsFound;
        logger.debug("Show all groups");
      }
   }
   model.notAllowed = notAllowed;
}

function contains(arr, value) {
    var i = arr.length;
    while (i--) {
    	if (arr[i].inviteeUserName == value) return true;
    }
    return false;
}

//RRD: util method (@TODO - duplicated with people.get.js)
function arrContains(arr, value) {
    var i = arr.length;
    while (i--) {
    	if (arr[i] == value) return true;
    }
    return false;
}

main();