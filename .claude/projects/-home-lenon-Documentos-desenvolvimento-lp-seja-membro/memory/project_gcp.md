---
name: GCP Cloud Run Deploy Config
description: GCP project, region, service name and credentials info for Cloud Run deployment
type: project
---

Deploy target: GCP Cloud Run
- Project ID: `caldeira-lake`
- Region: `southamerica-east1`
- Service name: `lp-seja-membro`
- GitHub secret: `GCP_CREDENTIALS` (service account key JSON with Cloud Run Admin, Artifact Registry Writer, Service Account User permissions)

**Why:** Landing page hosted on Cloud Run, CI/CD via GitHub Actions on push to main.
**How to apply:** Use these values in `.github/workflows/deploy.yml`. Artifact Registry repo needs to be created or referenced.
