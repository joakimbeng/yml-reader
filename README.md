YML Reader
==========
[![Build Status](https://travis-ci.org/joakimbeng/yml-reader.svg)](https://travis-ci.org/joakimbeng/yml-reader)

**INFO** This is a modified fork of [jono-tt/yml-reader](https://github.com/jono-tt/yml-reader) with the difference that no values are cleaned or removed. Also the cli tool has been removed. So if you want those feature you better use the original module instead.

---

This tool allows you to write configurations in YML with extensions to include other files from within your yml and also allows for substitution of ENVIRONMENT variables so that you can build complex configurations but keep the contents of those configurations in separate configuration files.

This is useful for keeping most of your configurations identical for all envionments with only small pieces of the configuration specific to an environment. For example if you had a Kubernetes configuration where you would like to have different disk volumes, say you'd like to have a `hostPath` for local development but use `awsElasticBlockStore` for QA and Staging but then use `gcePersistentDisk` for production you could do something like:

main-containers.yml:
```
apiVersion: v1
kind: Pod
metadata:
  name: postgres
  labels:
    name: postgres
spec:
  containers:
    -
      image: postgres:9.4
      name: postgres
      ...
      volumeMounts:
        - name: postgres-persistent-storage
          # mount path within the container
          mountPath: /var/lib/postgres
  volumes:
    - !include storage/{{VOLUME_TYPE}}_postgres.yml

```

storage/development_postgres.yml:
```
name: postgres-persistent-storage
hostPath:
  path: /private/var/postgres/cs-api-data
```

storage/staging_postgres.yml:
```
name: postgres-persistent-storage
awsElasticBlockStore:
  volumeID: aws://my-zone/v123
  fsType: ext4
```

storage/production_postgres.yml:
```
name: postgres-persistent-storage
gcePersistentDisk:
  pdName: my-data-disk
  fsType: ext4
```

### Usages ###
#### Include ####
Using includes you are able to bring in other configuration files to orchestrate multiple sources into a single yml or JSON output. There are 2 types of includes you are able to use within your yml files:

- `!include file.yml`
  - This will include the file specified and will error if the file does not exist
- `!include? file-not-exists.yml`
  - This will include the file if it exists but will ignore the file if it does not exist

Environment property substitutions can also be used within the file paths so that you can have specific items brought in based on that environment value. E.g:
```
foo:
  !include test/{{MY_RUNTIME}}_property.yml
```
Which would produce the file path `test/staging_property.yml` if the env variable (`MY_RUNTIME`) value was set to `staging`.

#### Env ####
You can also specify scalar values within your yaml by using the directive `ENV`. For e.g:
```
host: !env MY_SERVICE_HOST
description: "This is using host {{MY_SERVICE_HOST}}"
```
When the env property `MY_SERVICE_HOST` is set to `localhost` will produce the output:
```JSON
{
   "host": "localhost",
   "description": "This is using host localhost"
}
```
