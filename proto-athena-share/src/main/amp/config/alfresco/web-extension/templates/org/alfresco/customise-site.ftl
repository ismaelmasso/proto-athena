<#include "include/alfresco-template.ftl" />
<@templateHeader/>

<@templateBody>
   <@markup id="alf-hd">
   <div id="alf-hd">
      <@region scope="global" id="share-header" chromeless="true"/>
      <h1 class="sub-title"><#if page.titleId??>${msg(page.titleId)!page.title}<#else>${page.title}</#if></h1>
   </div>
   </@>
   <#if access>
      <@markup id="bd">
      <div id="bd">
         <@region id="customise-pages" scope="template" />
         <div id="group-assoc">
           <h2>Associate Visible Groups</h2>
           <div class="yui-g grid theme-border-3">
              <div class="yui-u first column1">
                 <div class="yui-b">
                    <@region id="group-finder" scope="template" />
                 </div>
              </div>
              <div class="yui-u column2">
                 <div class="yui-b">
                    <@region id="visiblesitegroups" scope="template" />
                 </div>
              </div>
           </div>
           <div id="workflow-def-assoc">
             <h2>Associate Workflow Definitions</h2>
             <div class="yui-g grid theme-border-3">
               <div class="yui-u first column1">
                 <div class="yui-b">
                   <@region id="allsiteworkflows" scope="template" />
                 </div>
               </div>
               <div class="yui-u column2">
                 <div class="yui-b">
                   <@region id="visiblesiteworkflows" scope="template" />
                 </div>
               </div>
             </div>
           </div>
         </div>
      </div>
      </@>
   </#if>
</@>

<@templateFooter>
   <@markup id="alf-ft">
   <div id="alf-ft">
      <@region id="footer" scope="global" />
   </div>
   </@>
</@>
