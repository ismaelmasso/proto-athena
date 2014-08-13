Installing proto-athena module(s)
---

- Download proto-athena-repo-<version>.amp and copy it into $ALF_HOME/amps
- Download proto-athena-share-<version>.amp and copy it into $ALF_HOME/amps_share
- Shutdown Alfresco using $ALF_HOME/alfresco.sh stop
- Run MMT using $ALF_HOME/bin/apply_amps.sh
- Restart Alfresco using $ALF_HOME/alfresco.sh start

### Notes

- $ALF_HOME points to the Alfresco Installer root location
- Binaries can be found at http://repository-maoo.forge.cloudbees.com/release/co/uk/rrd/alfresco
- Modules can also be included in a Maven build adding the following elements:

```
<repositories>
    ...
    <repository>
        <id>maoo-cloudbees</id>
        <url>dav:https://repository-maoo.forge.cloudbees.com/release</url>
    </repository>
</repositories>
```

For Alfresco Repository WAR overlay
```
<dependencies>
    <dependency>
        <groupId>co.uk.rrd.alfresco</groupId>
        <artifactId>proto-athena-repo</artifactId>
        <version>0.1</version>
        <type>amp</type>
    </dependency>
</dependencies>
```

For Alfresco Share WAR overlay
```
<dependencies>
    <dependency>
        <groupId>co.uk.rrd.alfresco</groupId>
        <artifactId>proto-athena-share</artifactId>
        <version>0.1</version>
        <type>amp</type>
    </dependency>
</dependencies>
```