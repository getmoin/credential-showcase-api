## Helm upgrade command

```bash
helm upgrade --install credential-showcase ./charts/credential-showcase -f ./charts/credential-showcase/values.yaml --wait

helm uninstall credential-showcase

oc delete secret,ingress,pvc,route,service,deployment,statefulset,configmap --selector "app.kubernetes.io/instance=credential-showcase"
```