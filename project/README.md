## Ex 4.5

- mark as done

## Ex 3.11

- resources and limits

## Ex 3.10

Default GKE service account has read only access to buckets. Can only changed on cluster create.

### Crate cluster work workload identity enabled
```bash
gcloud container clusters create dwk-cluster \
--zone=europe-north1-b \
--num-nodes=3  \
--workload-pool=study-da2c4.svc.id.goog

gcloud container clusters get-credentials dwk-cluster  --location europe-north1-b

kubectl create namespace project

kubectl create serviceaccount backup-ksa \
    --namespace project

gcloud projects add-iam-policy-binding projects/study-da2c4 \
    --role=roles/storage.admin \
    --member=principal://iam.googleapis.com/projects/117293324223/locations/global/workloadIdentityPools/study-da2c4.svc.id.goog/subject/ns/project/sa/backup-ksa \
    --condition=None


```

Source:
- https://www.youtube.com/watch?v=bPiQqPV4sxU
– https://docs.cloud.google.com/kubernetes-engine/docs/how-to/workload-identity



## Ex 3.9 DBaaS vs DIY

| Category | DBaaS (e.g., Cloud SQL) | DIY (StatefulSet) |
|----------|--------------------------|-------------------|
| Initialization Work and Costs to initialize | |  |
| - Pros |  Fast to setup. Enable from console, cli or Terraform. Private networking (VPC peering). HA out of the box. No configuration files needed.  | Full control. Integrates directly with Kubernetes.
| - Cons | Cloud SQL very slow deployment time ~ 20min. | Manual config with manifests. Takes time to configure. |
| Maintenance |  |  |
| - Pros | Fully managed. Automatic updates and security patches, HA-failover. Integrates with GCP monitoring tools. | Customizable with custom extensions. Manual upgrades and security patches. |
| - Cons | Limited to vendor version + extensions | Requires high maintenance for security, updates, backups. |
| Backup Methods and their easy of usage |  |  |
| - Pros | Automatic backup (enable just one click from ui) | Full customizable backups, eg CronJob. |
| - Cons | Backups cost extra. Limited by backup features (daily) | Manual setup required. More time needed for mainiaining custom backup solution |



## Ex 3.7

- create namespace for each branch

## Ex 3.6

- add github worklflows

## Ex 3.5

- add builds for amd64
- update ports

Notes:
```bash
kubectl create namespace project

```

## Ex 2.10 added

- logging

## Ex 2.8 added

- PostgreSQL StatefulSet
- ConfigMaps
- Secrets


## Ex 2.6 added

- CACHE_DIR env

## Ex 2.4 added

- Added namepsace project

```bash
kubectl create namespace project
```

## Ex 2.2. added

- new todo-backend. stores in memory todos

## Ex 1.12 added

- webserver caches an random image for 10min
- added pvc


## Ex 1.9 added


```bash

kubectl apply -k manifests

Test:
http://localhost:8081/
http://localhost:8081/pingpong

kubectl delete -k manifests

```



## Ex 1.8

```bash

kubectl apply -k manifests

Test: http://localhost:8081/

kubectl delete -k manifests

```

## Ex 1.6

### Notes

```bash
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
kubectl apply -k manifests

Test: http://localhost:8082/

kubectl delete -k manifests

```