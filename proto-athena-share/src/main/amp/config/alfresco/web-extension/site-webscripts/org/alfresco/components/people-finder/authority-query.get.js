var MAPPING_TYPE =
{
   API: 0,
   STATIC: 1
};

var mapUser = function(data)
{
   return (
   {
      authorityType: "USER",
      shortName: data.userName,
      fullName: data.userName,
      displayName: (data.firstName ? data.firstName + " " : "") + (data.lastName ? data.lastName : ""),
      description: data.jobtitle ? data.jobtitle : "",
      metadata:
      {
         avatar: data.avatar || null,
         jobTitle: data.jobtitle || "",
         organization: data.organization || ""
      }
   });
};

var mapGroup = function(data)
{
   return (
   {
      authorityType: "GROUP",
      shortName: data.shortName,
      fullName: data.fullName,
      displayName: data.displayName,
      description: data.fullName,
      metadata:
      {
      }
   });
};

var mapSiteUser = function(data)
{
   return (
   {
      authorityType: "USER",
      shortName: data.authority.userName,
      fullName: data.authority.userName,
      displayName: (data.authority.firstName ? data.authority.firstName + " " : "") + (data.authority.lastName ? data.authority.lastName : ""),
      description: data.role,
      metadata:
      {
      }
   })
};

var getMappings = function()
{

   //RRD: fetch siteName
   //var sitName = url.url.split("/")[4];
   //@TODO - hardcoded for now, until authority-query.get.js is fixed
   //var siteName = "swsdp";
   var siteName = args.siteId;
   var mappings = [],
      authorityType = args.authorityType === null ? "all" : String(args.authorityType).toLowerCase(),
      siteScope = args.site !== null ? true : false ;
   
   if (authorityType === "all" || authorityType == "user")
   {
      if (siteScope)
      {
         mappings.push(
         {
            type: MAPPING_TYPE.API,
            url: "/api/sites/" + encodeURIComponent(args.site) + "/memberships?nf="+ encodeURIComponent(args.filter) + "&authorityType=USER",
            rootObject: false,
            fn: mapSiteUser
         });
      } else
      {
         //RRD: add site as request parameter to the request
         mappings.push(
         {
            type: MAPPING_TYPE.API,
            url: "/api/people?filter=" + encodeURIComponent(args.filter) + "&site="+encodeURIComponent(siteName),
            rootObject: "people",
            fn: mapUser
         });
      }
   }

   if (authorityType === "all" || authorityType === "group")
   {
      //RRD: add site as request parameter to the request
      var url = "/api/groups?shortNameFilter=" + encodeURIComponent(args.filter) + "&site="+encodeURIComponent(siteName);
      if (args.zone !== "all")
      {
         url += "&zone=" + encodeURIComponent(args.zone === null ? "APP.DEFAULT" : args.zone);
      }
      
      mappings.push(
      {
         type: MAPPING_TYPE.API,
         url: url,
         rootObject: "data",
         fn: mapGroup
      });

// RRD - Do not show EVERYONE group
//      mappings.push(
//      {
//         type: MAPPING_TYPE.STATIC,
//         data: [
//            {
//               shortName: "EVERYONE",
//               fullName: "GROUP_EVERYONE",
//               displayName: msg.get("group.everyone"),
//               description: "GROUP_EVERYONE"
//            }
//         ],
//         fn: mapGroup
//      });
   }
   return mappings;
};

function main()
{
   var mappings = getMappings(),
      connector = remote.connect("alfresco"),
      authorities = [],
      mapping, result, data, i, ii, j, jj;
   
   for (i = 0, ii = mappings.length; i < ii; i++)
   {
      mapping = mappings[i];
      if (mapping.type == MAPPING_TYPE.API)
      {
         result = connector.get(mapping.url);
         if (result.status == 200)
         {
            data = eval('(' + result + ')');
            dataObj = (mapping.rootObject)? data[mapping.rootObject] : data;
            for (j = 0, jj = dataObj.length; j < jj; j++)
            {
               authorities.push(mapping.fn.call(this, dataObj[j]));
            }
         }
      }
      else if (mapping.type == MAPPING_TYPE.STATIC)
      {
         for (j = 0, jj = mapping.data.length; j < jj; j++)
         {
            authorities.push(mapping.fn.call(this, mapping.data[j]));
         }
      }
   }
   
   return authorities;
}

model.authorities = main();