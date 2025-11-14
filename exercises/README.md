## Ex 4.4

- AnalysisTemplate (cpu-usage)
- Rollout (pingpong, log_output)

Notes:
```bash
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml

brew install argoproj/tap/kubectl-argo-rollouts

kubectl argo rollouts get rollout log-output-rollout --watch
kubectl argo rollouts get rollout pingpong-rollout --watch
kubectl argo rollouts list rollouts --watch

kubectl -n prometheus port-forward prometheus-kube-prometheus-stack-1762-prometheus-0 9090:9090 --insecure-skip-tls-verify

kubectl argo rollouts dashboard


```

## Ex 4.3

```bash
sum(kube_pod_info{created_by_kind="StatefulSet", namespace="prometheus"})
```

## Ex 4.1

- ReadinessProbe

## Ex 3.4

- Add replacePrefixMatch

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
