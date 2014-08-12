function main()
{
   var siteId, theUrl, json, data;
   siteId = page.url.templateArgs.site;

   // get the roles available for the given site
   theUrl = "/api/sites/" + siteId + "/visiblesitegroups";
   json = remote.call(theUrl);
   data = eval('(' + json + ')');
   model.groups = data.groups;

   // Widget instantiation metadata...
   var groupsList = {
      id : "VisibleSiteGroupsList",
      name : "Alfresco.VisibleSiteGroupsList",
      options : {
         siteId : (page.url.templateArgs.site != null) ? page.url.templateArgs.site : "",
         groups : model.groups
      }
   };
   model.widgets = [groupsList];
}

main();