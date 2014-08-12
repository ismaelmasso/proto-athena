function main()
{
   var siteId, theUrl, json, data;
   siteId = page.url.templateArgs.site;

   // Widget instantiation metadata...
   var workflowsList = {
      id : "VisibleSiteWorkflows",
      name : "Alfresco.VisibleSiteWorkflows",
      options : {
         siteId : (page.url.templateArgs.site != null) ? page.url.templateArgs.site : ""
      }
   };
   model.widgets = [workflowsList];
}

main();