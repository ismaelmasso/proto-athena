<@markup id="css" >
   <#-- CSS Dependencies -->
   <@link href="${url.context}/res/components/site/groups/visiblesitegroups.css"/>
</@>

<@markup id="js">
   <#-- JavaScript Dependencies -->
   <@script src="${url.context}/res/components/site/groups/visiblesitegroups.js" />
</@>

<@markup id="widgets">
   <@createWidgets/>
</@>

<@markup id="html">
   <@uniqueIdDiv>
      <div id="${args.htmlid}-grouplistWrapper" class="grouplistWrapper">
         <div class="title theme-color-2">${msg("grouplist.title")}</div>
         <div id="${args.htmlid}-grouplist" class="grouplist">
         </div>
         <div class="addgroup">
            <button id="${args.htmlid}-add-button">${msg("button.add-groups")}</button>
         </div>
      </div>
   </@>
</@>
