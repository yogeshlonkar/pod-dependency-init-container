module.exports = {
  namespace: process.env.KUBE_NAMESPACE,
  podLabels: process.env.POD_LABELS && process.env.POD_LABELS || '',
  retryTimeOut: process.env.RETRY_TIME_OUT > 1500 && process.env.RETRY_TIME_OUT || 1500,
  maxRetry: process.env.MAX_RETRY > 0 && process.env.MAX_RETRY || 5,
};
