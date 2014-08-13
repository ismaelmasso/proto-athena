<#-- list / search / groups -->

<#import "authority.lib.ftl" as authorityLib/>
<#import "../generic-paged-results.lib.ftl" as genericPaging />
{
	"data": [
		<#list groups as group>
		    <#-- RRD: filter in only groups whose fullName is contained -->
		    <#-- into rrdathena:groupNames property of the current site -->
		    <#-- If groupNames is null, it means this call doesn't come -->
		    <#-- from an Alfresco Site -->
    		<#if groupNames?? && !(groupNames?seq_contains(group.fullName))>
    		    <#-- do nothing -->
    		<#else>
			    <@authorityLib.authorityJSON authority=group />
			    <#if group_has_next>,</#if>
			</#if>
		</#list>
	]

   <@genericPaging.pagingJSON />
}
