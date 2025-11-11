
## Log output app

### Ex. 1.5 notes
```bash
kubectl apply -k manifests
kubectl get pods
kubectl port-forward <pod_name> 3003:3000

...
kubectl port-forward webserver-dep-579c7b6b64-86ggr 3003:3000
Forwarding from 127.0.0.1:3003 -> 3000
Forwarding from [::1]:3003 -> 3000
...

kubectl delete -k manifests

```



