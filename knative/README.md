
## Ex 5.6

```bash

 cluster create knative-demo \
      --agents 2 \
      --k3s-arg "--disable=traefik@server:0" \
      --port "80:80@loadbalancer" \
      --port "443:443@loadbalancer"

brew install knative/client/kn

#Install 1.18.0.
#v1.20 requires kubernetes 1.32 (k3d/k3s 1.29+).

kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.18.0/serving-crds.yaml
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.18.0/serving-core.yaml

kubectl apply -f https://github.com/knative-extensions/net-kourier/releases/download/knative-v1.18.0/kourier.yaml

kubectl patch configmap/config-network \
  --namespace knative-serving \
  --type merge \
  --patch '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'

kubectl --namespace kourier-system get service kourier

kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.18.0/serving-default-domain.yaml

Chage nip.io to point localhost instead of loadbalancer internet ip

kubectl patch configmap config-domain \
  --namespace knative-serving \
  --type merge \
  -p '{"data":{"127.0.0.1.nip.io":""}}'

kubectl apply -f hello.yaml

kubectl get ksvc

Try:
http://hello.default.127.0.0.1.nip.io


# Autoscaling:

kubectl get pod -l serving.knative.dev/service=hello -w

# Traffic splitting

kn service update hello --env TARGET=Knative

kn service update hello \
--traffic hello-00001=50 \
--traffic @latest=50

kn revisions list   

```

