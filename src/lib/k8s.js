const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const { namespace, podLabels } = require('./config');
const client = new Client({ config: config.getInCluster() });
// const client = new Client({ config: config.fromKubeconfig(), version: '1.9' });
let specLoaded = false;

const getRunningPods = () => new Promise(async (resolve, reject) => {
  try {
    if (!specLoaded) {
      await client.loadSpec();
      specLoaded = true;
    }
    const response = await client.api.v1.namespaces(namespace).pods.get({ qs: { labelSelector: podLabels, fieldSelector: 'status.phase=Running' } });
    resolve(response.body.items);
  } catch (error) {
    reject(error);
  }
});

module.exports = {
  getRunningPods
};
