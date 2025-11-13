
## Ex 3.3

- Change Ingress to Gateway API

## Ex 3.2 added

- Change LoadBalancer to Ingress
- Add PATH_PREFIX env for log_output

## Ex 3.1 added

- change Ingress to LoadBalancer

Notes
```bash

gcloud container clusters create dwk-cluster --zone=europe-north1-b --cluster-version=1.32 --disk-size=32 --num-nodes=3 --machine-type=e2-micro
gcloud container clusters get-credentials dwk-cluster  --location europe-north1-b


```

Enable Docker buildx

```bash
docker buildx create --use --name multiarch
docker buildx inspect --bootstrap
docker buildx build --platform linux/amd64,linux/arm64 -t jjairola/pingpong:latest --push .
```


## Ex 2.7 added

- StatefulSet with one replicate for PostgreSQL


## Ex 2.5 added

- configmap

## Ex 2.3

- Added namepsace excersices

```bash
kubectl create namespace exercises
```

## Ex 2.1

* log_output uses http get to get pingpongs

## Ex 1.11

* Added pingpong



## Ex 1.10

```bash

kubectl apply -k manifests

Check:
http://localhost:8081/

kubectl delete -k manifests

```
