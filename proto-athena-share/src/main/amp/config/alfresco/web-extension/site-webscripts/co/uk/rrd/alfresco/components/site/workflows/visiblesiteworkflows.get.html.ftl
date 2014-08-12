<@markup id="css" >
   <#-- CSS Dependencies -->
   <@link href="${url.context}/res/components/site/workflows/visiblesiteworkflows.css"/>
</@>

<@markup id="js">
   <#-- JavaScript Dependencies -->
   <@script src="${url.context}/res/components/site/workflows/visiblesiteworkflows.js" />
</@>

<@markup id="widgets">
   <@createWidgets/>
</@>

<@markup id="html">
   <@uniqueIdDiv>
      <div id="${args.htmlid}-workflowlistWrapper" class="workflowlistWrapper">
         <div class="title theme-color-2">${msg("workflowlist.title")}</div>
         <div id="${args.htmlid}-workflowlist" class="workflowlist">
         </div>
         <div class="sinvite">
            <button id="${args.htmlid}-add-workflows">${msg("button.add-workflows")}</button>
         </div>
      </div>
   </@>
</@>
