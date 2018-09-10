const { getRunningPods } = require('./lib/k8s');
const { podLabels, maxRetry } = require('./lib/config');
const CurrentDate = () => { };
CurrentDate.toString = () => `[${new Date().toISOString()}]`
console.info = console.info.bind(console, '%s', CurrentDate);
console.error = console.error.bind(console, '%s', CurrentDate);

console.info('Started pod dependency lookup');
let noOfTrys = 1;
const checkIfPodsRunning = async () => {
  try {
    console.info(`checking for running pods try ${noOfTrys}`);
    const pods = await getRunningPods();
    if (pods.length > 0) {
      console.info(`found running pod with label(s) ${podLabels}`);
      process.exit(0);
    } else if (noOfTrys < maxRetry) {
      setTimeout(checkIfPodsRunning, 1500);
    } else {
      console.error(`didn't find any running pod with label(s) ${podLabels} after ${noOfTrys} try(s)`);
      process.exit(1);
    }
    noOfTrys++;
  } catch (error) {
    console.error('couldn\'t fetch running pods');
    console.error(error, error.message, error.stack);
  }
};
setTimeout(checkIfPodsRunning, 1500);