function main()
{
   var siteId = page.url.templateArgs.site;

   model.showAddButton = (args.action != "select")

   // Widget instantiation metadata...
   var workflowsList = {
      id : "VisibleSiteWorkflows",
      name : "Alfresco.VisibleSiteWorkflows",
      options : {
         siteId : (!model.showAllWorkflows && page.url.templateArgs.site != null) ? page.url.templateArgs.site : "",
         action : (args.action) ? args.action : "add"
      }
   };
   model.widgets = [workflowsList];
}

main();