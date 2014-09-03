{
    "groups": [
        <#list groups as group>
            {
                "itemName":"${group}",
                "displayName":"${group?substring(group?index_of('_')+1)}"
            }
            <#if group_has_next>,</#if>
        </#list>
    ]
}