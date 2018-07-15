mkdir .gcloud-secrets
echo "$GCLOUD_AUTH" >> .gcloud-secrets/gcloud_auth.json
export GOOGLE_APPLICATION_CREDENTIALS=.gcloud-secrets/gcloud_auth.json
gcloud container clusters get-credentials soundplace --zone us-central1-b --project soundplace-infra
kubectl rolling-update data-api-pod --image=tsirlucas/soundplace-api:latest --image-pull-policy=Always
