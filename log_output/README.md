
## Log output app


Deploy with:
```bash
kubectl apply -k manifests

kubectl get deployments
kubectl get pods
kubectl logs -f <name>
2025-11-11T13:34:15.751Z: 12c0a7f6-3d5e-4afe-8caf-947bc3594550
kubectl delete -k manifests
```



### Notes

```bash
k3d cluster create -a 2
kubectl cluster-info
k3d cluster start
k3d cluster stop
k3d cluster delete
```