<@markup id="css" >
   <#-- CSS Dependencies -->
   <@link rel="stylesheet" type="text/css" href="${url.context}/res/components/dashlets/dynamic-welcome.css" group="dashlets" />
</@>

<@markup id="js">
   <#-- JavaScript Dependencies -->
   <@script type="text/javascript" src="${url.context}/res/components/dashlets/dynamic-welcome.js" group="dashlets"/>
</@>

<@markup id="widgets">
   <@createWidgets group="dashlets"/>
</@>

<@markup id="html">
   <@uniqueIdDiv>
      <#if showDashlet>
         <#assign el=args.htmlid?html>
         <div class="dashlet dynamic-welcome">
            <a id="${el}-close-button" class="welcome-close-button" href="#">
               <img src="${url.context}/res/components/images/delete-16.png" />
               <span>${msg("welcome.close")}</span>
            </a>
            <div class="welcome-body">

               <#-- OVERVIEW CONTAINER -->
               <@markup id="overviewContainer">
                  <div class="welcome-info">
                     <h1>${msg(title, user.fullName, site)?html}</h1>
                     <#if description??>
                        <p class="welcome-info-text">${msg(description)}</p>
                     </#if>
                  </div>
               </@markup>

            </div>
          </div>
      </#if>
   </@>
</@>