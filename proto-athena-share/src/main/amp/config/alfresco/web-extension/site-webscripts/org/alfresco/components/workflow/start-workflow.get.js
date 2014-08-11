<import resource="classpath:alfresco/site-webscripts/org/alfresco/components/workflow/workflow.lib.js">
model.workflowDefinitions = getUserWorkflowDefinitions();

function main()
{
   // Widget instantiation metadata...
   var startWorkflow = {
      id : "StartWorkflow", 
      name : "Alfresco.component.StartWorkflow",
      options : {
         failureMessage : "message.failure",
         submitButtonMessageKey : "button.startWorkflow",
         defaultUrl : getSiteUrl("my-tasks"),
         selectedItems : (page.url.args.selectedItems != null) ? page.url.args.selectedItems: "",
         destination : (page.url.args.destination != null) ? page.url.args.destination : "",
         workflowDefinitions : model.workflowDefinitions
      }
   };
   model.widgets = [startWorkflow];
}

//Copy of getWorkflowDefinitions() defined in workflow.lib.js
//It only adds &user=#{user.name} at the end of the request, to only show user-specific workflow definitions
function getUserWorkflowDefinitions()
{
   var hiddenWorkflowNames = getHiddenWorkflowNames(),
      connector = remote.connect("alfresco"),
      result = connector.get("/api/workflow-definitions?exclude=" + hiddenWorkflowNames.join(",")+"&user="+user.name);
   if (result.status == 200)
   {
      var workflows = eval('(' + result + ')').data;
      workflows.sort(sortByTitle);
      return workflows;
   }
   return [];
}

main();
