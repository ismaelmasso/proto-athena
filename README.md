How to run the project
---

```
cd proto-athena-repo
mvn [clean] integration-test -Pamp-to-war [-Ppurge]

cd proto-athena-share
mvn [clean] integration-test -Pamp-to-war
```

How to deploy the project
---

```
mvn deploy
```
