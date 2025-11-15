# DummySite Controller

This project implements a Kubernetes controller that creates HTML copies of websites when a `DummySite` custom resource is created.

## Components

- **CRD**: `DummySite` custom resource with `website_url` property
- **Controller**: JavaScript-based controller that watches for `DummySite` resources
- **RBAC**: ServiceAccount, ClusterRole, and ClusterRoleBinding for controller permissions
- **Deployment**: Kubernetes deployment for the controller
- **Test**: Sample `DummySite` resource for testing

## Deployment Instructions

1. Apply the CRD:
   ```bash
   kubectl apply -f manifests/dummysite-crd.yaml
   ```

2. Apply RBAC resources:
   ```bash
   kubectl apply -f manifests/rbac.yaml
   ```

3. Build and push the controller image:
   ```bash
   cd controller
   docker build -t dummysite-controller:latest .
   # Push to your registry if needed
   ```

4. Apply the controller deployment:
   ```bash
   kubectl apply -f manifests/deployment.yaml
   ```

5. Test with example.com:
   ```bash
   kubectl apply -f manifests/test-dummysite.yaml
   ```

The controller will create:
- A ConfigMap containing the fetched HTML
- A Service to expose the website copy
- A Pod running nginx to serve the HTML

## Workflow

1. Apply role, account, and binding
2. Apply deployment
3. Apply DummySite resource
4. Controller automatically creates supporting resources