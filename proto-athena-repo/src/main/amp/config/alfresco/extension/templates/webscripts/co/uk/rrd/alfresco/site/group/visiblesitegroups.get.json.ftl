{
    "groups": [
        <#list groups as group>
            {
                "itemName":"${group}",
                "displayName":"${group?split('_')[1]}"
            }
            <#if group_has_next>,</#if>
        </#list>
    ]
}