
## Ex 1.11 added

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