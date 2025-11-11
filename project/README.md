
## Ex 1.6

### Notes

```bash
k3d cluster create --port 8082:30080@agent:0 -p 8081:80@loadbalancer --agents 2
kubectl apply -k manifests

Test: http://localhost:8082/

kubectl delete -k manifests

```