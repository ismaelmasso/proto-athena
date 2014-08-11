{
    "groups": [
        <#list groups as group>
            "${group}"
            <#if group_has_next>,</#if>
        </#list>
    ]
}