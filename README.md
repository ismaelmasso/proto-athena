What is it
---
proto-athena (soon to become alfresco-site-tenant) is a project composed by a Repository and a Share Alfresco Module Packages (AMPs) that implement the Alfresco multi-tenancy use case using Alfresco Site as Tenant.

This means that users of different sites can never access the same data, unless explicitely configured by an admin.

Although Alfresco Site were supposed to be designed with isolation in mind, there are still some parts of the system (such as users, groups and workflows) that are shared across sites: this modules will allow Site Managers to _whitelist_ groups and workflows that need to be shown/chosen/configured within a given site.


Where to download binaries
---
You can access the publicly available (released and nightly-built) binaries with the following URL

http://repository-maoo.forge.cloudbees.com/release/co/uk/rrd/alfresco/

How to run the project
---

```
cd proto-athena-repo
mvn [clean] integration-test -Pamp-to-war [-Ppurge]

cd proto-athena-share
mvn [clean] integration-test -Pamp-to-war
```

How to deploy
---

```
mvn deploy
```

How to release
---

```
mvn release:prepare release:perform
```
