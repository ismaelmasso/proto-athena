function main()
{
   var siteId, theUrl, json, data;
   siteId = page.url.templateArgs.site;

   // get the roles available for the given site
   theUrl = "/api/sites/" + siteId + "/grantedsitegroups";
   json = remote.call(theUrl);
   data = eval('(' + json + ')');
   model.groups = data.groups;

   // Widget instantiation metadata...
   var groupsList = {
      id : "GrantedSiteGroupsList",
      name : "Alfresco.GrantedSiteGroupsList",
      options : {
         siteId : (page.url.templateArgs.site != null) ? page.url.templateArgs.site : "",
         groups : model.groups
      }
   };
   model.widgets = [groupsList];
}

main();