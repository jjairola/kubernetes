const k8s = require('@kubernetes/client-node');
const axios = require('axios');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);
const customObjectsApi = kc.makeApiClient(k8s.CustomObjectsApi);

const dummySiteGroup = 'example.com';
const dummySiteVersion = 'v1';
const dummySitePlural = 'dummysites';

async function watchDummySites() {
  try {
    const watch = new k8s.Watch(kc);
    const req = await watch.watch(
      `/apis/${dummySiteGroup}/${dummySiteVersion}/${dummySitePlural}`,
      {},
      async (type, apiObj, watchObj) => {
        if (type === 'ADDED') {
          console.log(`DummySite added: ${apiObj.metadata.name}`);
          await handleDummySite(apiObj);
        }
      },
      (err) => {
        console.error('Watch error:', err);
      }
    );
  } catch (err) {
    console.error('Failed to start watching:', err);
  }
}

async function handleDummySite(dummySite) {
  const websiteUrl = dummySite.spec.website_url;
  console.log(`Handling DummySite: ${dummySite.metadata.name} with URL: ${websiteUrl}`);

  try {
    const response = await axios.get(websiteUrl);
    const html = response.data;

    // Create ConfigMap with HTML content
    const configMapName = `${dummySite.metadata.name}-html`;
    const configMap = {
      apiVersion: 'v1',
      kind: 'ConfigMap',
      metadata: {
        name: configMapName,
        namespace: dummySite.metadata.namespace || 'default',
      },
      data: {
        'index.html': html,
      },
    };

    await k8sApi.createNamespacedConfigMap(dummySite.metadata.namespace || 'default', configMap);
    console.log(`Created ConfigMap: ${configMapName}`);

    // Create Service
    const serviceName = `${dummySite.metadata.name}-service`;
    const service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: serviceName,
        namespace: dummySite.metadata.namespace || 'default',
      },
      spec: {
        selector: {
          app: dummySite.metadata.name,
        },
        ports: [
          {
            port: 80,
            targetPort: 80,
          },
        ],
      },
    };

    await k8sApi.createNamespacedService(dummySite.metadata.namespace || 'default', service);
    console.log(`Created Service: ${serviceName}`);

    // Create Pod with nginx serving the HTML
    const podName = `${dummySite.metadata.name}-pod`;
    const pod = {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: {
        name: podName,
        namespace: dummySite.metadata.namespace || 'default',
        labels: {
          app: dummySite.metadata.name,
        },
      },
      spec: {
        containers: [
          {
            name: 'nginx',
            image: 'nginx:alpine',
            ports: [
              {
                containerPort: 80,
              },
            ],
            volumeMounts: [
              {
                name: 'html',
                mountPath: '/usr/share/nginx/html',
              },
            ],
          },
        ],
        volumes: [
          {
            name: 'html',
            configMap: {
              name: configMapName,
            },
          },
        ],
      },
    };

    await k8sApi.createNamespacedPod(dummySite.metadata.namespace || 'default', pod);
    console.log(`Created Pod: ${podName}`);

  } catch (error) {
    console.error(`Error handling DummySite ${dummySite.metadata.name}:`, error.message);
  }
}

watchDummySites();