const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const { namespace, podLabels } = require('./config');

const client = new Client({ config: config.getInCluster() });
let specLoaded = false;

const getRunningPods = async () => {
  try {
    if (!specLoaded) {
      await client.loadSpec();
      specLoaded = true;
    }

    const podLabelArray = podLabels.split(',').map(label => label.trim());
    const podsRunning = await Promise.all(
        podLabelArray.map(async podLabel => {
          const response = await client.api.v1.namespaces(namespace).pods.get({ qs: { labelSelector: podLabel, fieldSelector: 'status.phase=Running' } });
          return (response.body.items.length);
        })
    );

    return(podsRunning.every(podCount => podCount > 0));

  } catch (error) {
    throw (error);
  }
};

module.exports = {
  getRunningPods
};
