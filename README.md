How to run the project
---

```
cd proto-athena-repo
mvn [clean] integration-test -Pamp-to-war [-Ppurge]

cd proto-athena-share
mvn [clean] integration-test -Pamp-to-war -Dmaven.tomcat.port=8081
```

How to deploy the project
---

```
mvn deploy
```