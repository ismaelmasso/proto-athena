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
    public static final String PARAM_INCLUDE = "include";
    private static final String PARAM_USER = "user";
    private static final String PARAM_SITES = "sites";
    private static Logger logger = Logger.getLogger(WorkflowDefinitionsGet.class);

    SiteService siteService;

    public void setSiteService(SiteService siteService) {
        this.siteService = siteService;
    }

    @Override
    protected Map<String, Object> buildModel(WorkflowModelBuilder modelBuilder, WebScriptRequest req, Status status, Cache cache)
    {
        HashMap<String,SiteInfo> sitesArray = new HashMap<String,SiteInfo>();
        HashSet<String> workflowsArray = new HashSet<String>();

        ExcludeFilter excludeFilter = null;
        String excludeParam = req.getParameter(PARAM_EXCLUDE);
        if (excludeParam != null && excludeParam.length() > 0)
        {
            excludeFilter = new ExcludeFilter(excludeParam);
        }

        //Iterate through user's site and all them to the site list
        String user = req.getParameter(PARAM_USER);
        if (user != null && user.length() > 0) {
            List<SiteInfo> sites = siteService.listSites(user);
            for (SiteInfo site : sites) {
                sitesArray.put(site.getShortName(),site);
            }
        }

        String sites = req.getParameter(PARAM_SITES);
        if (sites != null && sites.length() > 0) {
            for (String siteName : StringUtils.tokenizeToStringArray(sites, ",")) {
                sitesArray.put(siteName,siteService.getSite(siteName));
            }
        }

        for(SiteInfo site : sitesArray.values()) {

        }

        IncludeFilter includeFilter = null;
        String includeParam = req.getParameter(PARAM_INCLUDE);

        if (includeParam != null && includeParam.length() > 0)
        {
            includeFilter = new IncludeFilter(includeParam);
        }
        logger.debug(String.format("Invoking WorkflowDefinitionsGet with includes[%s] and excludes[%s]", includeParam, excludeParam));

        // list all workflow's definitions simple representation
        List<WorkflowDefinition> workflowDefinitions = workflowService.getDefinitions();

        ArrayList<Map<String, Object>> results = new ArrayList<Map<String, Object>>();

        for (WorkflowDefinition workflowDefinition : workflowDefinitions)
        {
            // if present, filter in/out in/excluded definitions
            if (includeFilter != null && includeFilter.isMatch(workflowDefinition.getName()))
            {
                results.add(modelBuilder.buildSimple(workflowDefinition));
            } else if (excludeFilter == null || !excludeFilter.isMatch(workflowDefinition.getName()))
            {
                results.add(modelBuilder.buildSimple(workflowDefinition));
            }
        }
        Map<String, Object> model = new HashMap<String, Object>();
        model.put("workflowDefinitions", results);
        return model;
    }

    /**
     * Helper class to check for included items.
     */
    public class IncludeFilter extends ExcludeFilter {
        public IncludeFilter(String filters) {
            super(filters);
        }
    }
}