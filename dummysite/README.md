## 5.1.

```bash

kubectl create namespace dummysite
kubectl apply -k manifests
kubectl port-forward svc/example-site-service 8080:80 -n dummysite


```