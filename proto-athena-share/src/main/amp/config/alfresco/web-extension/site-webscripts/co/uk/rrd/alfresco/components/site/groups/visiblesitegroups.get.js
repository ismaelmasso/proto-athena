function main()
{
   var siteId, theUrl, json, data;
   siteId = page.url.templateArgs.site;

   // Widget instantiation metadata...
   var groupsList = {
      id : "VisibleSiteGroupsList",
      name : "Alfresco.VisibleSiteGroupsList",
      options : {
         siteId : (page.url.templateArgs.site != null) ? page.url.templateArgs.site : ""
      }
   };
   model.widgets = [groupsList];
}

main();