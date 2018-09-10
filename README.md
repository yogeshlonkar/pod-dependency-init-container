# Pod dependecy init container

This container can be used as init container to specify dependecy of other pod. It will check exit with success code if any pod with give label selector is found running in current namespace.

## How to use it

The docker image is hosted on docker hub and can be found here:
https://hub.docker.com/r/ylonkar/pod-dependency-init-container/

### Settings

| Environment Variable | Required | Default | Description |
| --- | --- | --- | --- |
| POD_LABELS | Yes | - | This is comma (,) seperated string for labels of dependency pods which which will be check of `Running` phase. |
| MAX_RETRY | NO | 5 | Maximum number of times for which init container will try to check if any pod with give `POD_LABELS` is `Running`. |
| RETRY_TIME_OUT | NO | 1500 | Number of milliseconds init container will time out between each retry. |

Example usage:
```yaml
spec:
  containers:
  ...
  serviceAccountName: {{ .Values.serviceAccount }} #optional
  initContainers:
  - name: pod-dependency
    image: ylonkar/pod-dependency-init-container:1.0
    env:
    - name: POD_LABELS
      value: app=nodeapp,name=mongo-1
    - name: MAX_RETRY
      value: "10"
    - name: RETRY_TIME_OUT
      value: "5000"
```

## RBAC
In case of RBAC this container requires `pods` resource `get`, `list`, `watch` access. Which can be provided by below yaml
```yaml
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: {{ .Values.serviceAccount }}
rules:
  - apiGroups:
      - ""
    resources:
      - pods
      - services
      - endpoints
    verbs:
      - get
      - list
      - watch
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ .Values.serviceAccount }}
  namespace: {{ .Values.namespace }}
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: system:serviceaccount:{{ .Values.serviceAccount }}:default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: {{ .Values.serviceAccount }}
subjects:
- kind: ServiceAccount
  name: {{ .Values.serviceAccount }}
  namespace: {{ .Values.namespace }}
```

## To do

- Add tests!
- Add to travis-ci
