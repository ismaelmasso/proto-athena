/*
 * Copyright (C) 2005-2011 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */
package co.uk.rrd.alfresco.workflow;

import java.util.*;

import org.alfresco.repo.web.scripts.workflow.AbstractWorkflowWebscript;
import org.alfresco.repo.web.scripts.workflow.WorkflowModelBuilder;
import org.alfresco.service.cmr.repository.NodeService;
import org.alfresco.service.cmr.site.SiteInfo;
import org.alfresco.service.cmr.site.SiteService;
import org.alfresco.service.cmr.workflow.WorkflowDefinition;
import org.alfresco.service.namespace.QName;
import org.apache.log4j.Logger;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.util.StringUtils;

/**
 * Webscript impelementation to return the latest version of all deployed
 * workflow definitions.
 * It supports the following parameters:
 * <b>user</b> will filter in only workflow definitions associated with sites that are accessible to the given user
 * <b>sites</b> will filter in only workflow definitions associated with a given list of sites
 */
public class WorkflowDefinitionsGet extends AbstractWorkflowWebscript
{

    private static Logger logger = Logger.getLogger(WorkflowDefinitionsGet.class);
    private static QName PROP_WORKFLOW_NAMES = QName.createQName("http:/rrd.co.uk/alfresco/model/content/1.0","workflowNames");

    private static final String PARAM_USER = "user";
    private static final String PARAM_SITES = "sites";

    SiteService siteService;
    NodeService nodeService;

    public void setSiteService(SiteService siteService) {
        this.siteService = siteService;
    }
    public void setNodeService(NodeService nodeService) { this.nodeService = nodeService; }

    @Override
    protected Map<String, Object> buildModel(WorkflowModelBuilder modelBuilder, WebScriptRequest req, Status status, Cache cache)
    {
        String user = req.getParameter(PARAM_USER);
        String sites = req.getParameter(PARAM_SITES);

        //Fetch the list of workflows related with user and/or sites specified in the request
        HashSet<String> workflowsArray = getWorkflowDefinitions(user, sites);
        String includeParam = StringUtils.arrayToDelimitedString(workflowsArray.toArray(),",");

        IncludeNamesFilter includeFilter = null;
        if (user != null || sites != null)
        {
            includeFilter = new IncludeNamesFilter(includeParam);
        }

        ExcludeFilter excludeFilter = null;
        String excludeParam = req.getParameter(PARAM_EXCLUDE);
        if (excludeParam != null && excludeParam.length() > 0)
        {
            excludeFilter = new ExcludeFilter(excludeParam);
        }

        // list all workflow's definitions simple representation
        List<WorkflowDefinition> workflowDefinitions = workflowService.getDefinitions();

        logger.debug(String.format("Invoking WorkflowDefinitionsGet with includes[%s] and excludes[%s]", includeParam, excludeParam));

        ArrayList<Map<String, Object>> results = new ArrayList<Map<String, Object>>();

        for (WorkflowDefinition workflowDefinition : workflowDefinitions)
        {
            String workflowDefinitionName = workflowDefinition.getName();
            if (includeFilter != null && !includeFilter.isMatch(workflowDefinitionName)) {
                //skip it
            } else if (includeFilter == null || includeFilter.isMatch(workflowDefinitionName))
            {
                results.add(modelBuilder.buildSimple(workflowDefinition));
            } else if (excludeFilter == null || !excludeFilter.isMatch(workflowDefinitionName))
            {
                results.add(modelBuilder.buildSimple(workflowDefinition));
            }
        }
        Map<String, Object> model = new HashMap<String, Object>();
        model.put("workflowDefinitions", results);
        return model;
    }

    protected HashSet<String> getWorkflowDefinitions(String user, String sites) {
        HashMap<String,SiteInfo> sitesArray = new HashMap<String,SiteInfo>();
        HashSet<String> workflowsArray = new HashSet<String>();

        //If user= is specified, iterate through user's sites and add them to siteArray
        if (user != null && user.length() > 0) {
            List<SiteInfo> siteList = siteService.listSites(user);
            for (SiteInfo site : siteList) {
                sitesArray.put(site.getShortName(),site);
            }
            logger.debug(String.format("List of user sites: [%s]", sitesArray.values()));
        }

        //If sites= is specified, add them to siteArray
        if (sites != null && sites.length() > 0) {
            for (String siteName : StringUtils.tokenizeToStringArray(sites, ",")) {
                sitesArray.put(siteName,siteService.getSite(siteName));
            }
            logger.debug(String.format("Final list of sites: [%s]", sitesArray.values()));
        }

        //Iterate through siteArray and collect associated workflow IDs; adding them all to workflowsArray Set, we'll
        //consequently compact it (removing duplicates)
        for(SiteInfo site : sitesArray.values()) {
            List<String> workflowIds = (List<String>)nodeService.getProperty(site.getNodeRef(), PROP_WORKFLOW_NAMES);
            if (workflowIds != null) {
                workflowsArray.addAll(workflowIds);
            }
        }
        return workflowsArray;
    }

    /**
     * Helper class to check for included items.
     */
    protected class IncludeNamesFilter {
        final List<String> workflowNames;
        public IncludeNamesFilter(String workflowNames) {
            this.workflowNames = Arrays.asList(StringUtils.tokenizeToStringArray(workflowNames, ","));
        }
        public boolean isMatch(String item) {
            return workflowNames.contains(item);
        }
    }
}