# Development Deployment Workflow

> **EDUCATIONAL TEMPLATE** - This document explains the deployment workflow.
> Copy to `.github/workflows/deploy-dev.yml` only after replacing all placeholders.

**Prerequisites**: Read [CI-CD-Pipeline-Guide.md](CI-CD-Pipeline-Guide.md) and [CI.md](CI.md) first.

**Previous**: [CI.md](CI.md) - Continuous Integration workflow

---

## Overview

The deployment workflow runs when code is merged to `main`. It:

1. Authenticates with GCP using Workload Identity Federation
2. Builds the application for production
3. Deploys to Firebase Hosting and Functions

---

## Warning: Do Not Copy Until Ready

> **WARNING**: Do not copy this file to `.github/workflows/` until you have:
> 1. Set up Workload Identity Federation (see [setup-wif.sh](../../scripts/setup-wif.sh))
> 2. Replaced ALL `<YOUR-VALUE-HERE>` placeholders with real values
> 3. Added required secrets to your GitHub repository
> 4. Tested locally with Firebase emulators

---

## The Workflow File

Below is the complete `deploy-dev.yml` workflow with annotations.

```yaml
# ============================================================================
# deploy-dev.yml - Development Deployment Workflow
# ============================================================================
# This workflow deploys to the development environment when code is merged
# to the main branch.
#
# EDUCATIONAL TEMPLATE - Replace all <YOUR-VALUE-HERE> placeholders
# before copying to .github/workflows/
# ============================================================================

name: Deploy to Development  # <-- Display name in GitHub Actions UI

# ============================================================================
# TRIGGERS
# ============================================================================
on:
  push:
    branches:
      - main                            # <-- Deploy on merge to main
  workflow_dispatch:                    # <-- Allow manual trigger from UI

# ============================================================================
# ENVIRONMENT VARIABLES
# ============================================================================
# Define variables used across all jobs
env:
  NODE_VERSION: '20'                    # <-- Match your local Node version
  PNPM_VERSION: '8'                     # <-- Match your local pnpm version

# ============================================================================
# CONCURRENCY
# ============================================================================
# Prevents multiple deployments from running simultaneously
# Only one deployment to dev environment at a time
concurrency:
  group: deploy-dev
  cancel-in-progress: false             # <-- Don't cancel in-progress deploys

# ============================================================================
# JOBS
# ============================================================================
jobs:
  deploy:
    name: Build and Deploy
    runs-on: ubuntu-latest

    # ========================================================================
    # PERMISSIONS
    # ========================================================================
    # Required for Workload Identity Federation
    # id-token: write - allows requesting OIDC token from GitHub
    # contents: read - allows checking out the repository
    permissions:
      id-token: write                   # <-- REQUIRED for WIF authentication
      contents: read

    # ========================================================================
    # ENVIRONMENT
    # ========================================================================
    # Links to GitHub Environment for protection rules and secrets
    environment:
      name: development                 # <-- GitHub Environment name
      url: https://dev.<YOUR-DOMAIN>.com  # <-- Deployed URL (shown in UI)

    steps:
      # ======================================================================
      # STEP 1: Checkout Code
      # ======================================================================
      - name: Checkout repository
        uses: actions/checkout@v4

      # ======================================================================
      # STEP 2: Setup pnpm
      # ======================================================================
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      # ======================================================================
      # STEP 3: Setup Node.js
      # ======================================================================
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      # ======================================================================
      # STEP 4: Install Dependencies
      # ======================================================================
      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # ======================================================================
      # STEP 5: Build Application
      # ======================================================================
      # Builds all packages for production
      # Turborepo handles build order and caching
      - name: Build
        run: pnpm build
        env:
          # Add any build-time environment variables here
          VITE_API_URL: https://dev-api.<YOUR-DOMAIN>.com

      # ======================================================================
      # STEP 6: Authenticate with GCP (Workload Identity Federation)
      # ======================================================================
      # This is where WIF magic happens:
      # 1. GitHub provides an OIDC token proving this is a GitHub Action
      # 2. GCP validates the token against your Workload Identity Pool
      # 3. GCP returns temporary credentials for your service account
      - name: Authenticate to Google Cloud
        id: auth
        uses: google-github-actions/auth@v2
        with:
          # The WIF provider you created with setup-wif.sh
          workload_identity_provider: projects/<YOUR-GCP-PROJECT-NUMBER>/locations/global/workloadIdentityPools/github-actions-pool/providers/github-actions-provider
          # The service account to impersonate
          service_account: github-actions-sa@<YOUR-GCP-PROJECT-ID>.iam.gserviceaccount.com

      # ======================================================================
      # STEP 7: Setup Google Cloud SDK
      # ======================================================================
      # Installs gcloud CLI for Firebase deployment
      - name: Setup Google Cloud SDK
        uses: google-github-actions/setup-gcloud@v2
        with:
          project_id: <YOUR-GCP-PROJECT-ID>

      # ======================================================================
      # STEP 8: Deploy to Firebase Hosting
      # ======================================================================
      # Deploys the built static files to Firebase Hosting
      - name: Deploy to Firebase Hosting
        run: |
          npm install -g firebase-tools
          firebase deploy --only hosting --project <YOUR-GCP-PROJECT-ID>
        env:
          GOOGLE_APPLICATION_CREDENTIALS: ${{ steps.auth.outputs.credentials_file_path }}

      # ======================================================================
      # STEP 9: Deploy Firebase Functions
      # ======================================================================
      # Deploys the serverless backend functions
      - name: Deploy Firebase Functions
        run: |
          firebase deploy --only functions --project <YOUR-GCP-PROJECT-ID>
        env:
          GOOGLE_APPLICATION_CREDENTIALS: ${{ steps.auth.outputs.credentials_file_path }}

      # ======================================================================
      # STEP 10: Post-Deployment Notification (Optional)
      # ======================================================================
      # Add Slack/Discord notification here if desired
      - name: Deployment Summary
        run: |
          echo "## Deployment Complete" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "- **Environment**: Development" >> $GITHUB_STEP_SUMMARY
          echo "- **URL**: https://dev.<YOUR-DOMAIN>.com" >> $GITHUB_STEP_SUMMARY
          echo "- **Commit**: ${{ github.sha }}" >> $GITHUB_STEP_SUMMARY
```

---

## Step-by-Step Explanation

### Step 1-4: Setup

Standard setup steps that match your local development environment:
- Checkout code
- Install pnpm
- Install Node.js
- Install dependencies

### Step 5: Build

```yaml
- name: Build
  run: pnpm build
  env:
    VITE_API_URL: https://dev-api.<YOUR-DOMAIN>.com
```

The build step compiles your application with production optimizations. Environment variables prefixed with `VITE_` are embedded into the frontend bundle.

### Step 6: WIF Authentication

This is the most important step for secure deployment:

```yaml
- name: Authenticate to Google Cloud
  uses: google-github-actions/auth@v2
  with:
    workload_identity_provider: projects/<YOUR-GCP-PROJECT-NUMBER>/...
    service_account: github-actions-sa@<YOUR-GCP-PROJECT-ID>.iam.gserviceaccount.com
```

**What happens:**
1. GitHub generates a JWT token proving this workflow is running
2. The token includes claims like `repository`, `actor`, `ref`
3. GCP validates these claims against your Workload Identity Pool
4. If valid, GCP issues temporary credentials (valid ~1 hour)
5. These credentials are stored in a file for subsequent steps

### Step 7-9: Deployment

The deployment steps use the credentials from Step 6:

```yaml
env:
  GOOGLE_APPLICATION_CREDENTIALS: ${{ steps.auth.outputs.credentials_file_path }}
```

This tells Firebase CLI where to find the temporary credentials.

---

## Placeholders to Replace

Before using this workflow, replace these placeholders:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `<YOUR-DOMAIN>.com` | Your domain name | `myapp.com` |
| `<YOUR-GCP-PROJECT-ID>` | GCP project ID | `my-company-dev-123456` |
| `<YOUR-GCP-PROJECT-NUMBER>` | GCP project number (numeric) | `123456789012` |

### Finding Your Project Number

```bash
# Using gcloud CLI
gcloud projects describe <YOUR-GCP-PROJECT-ID> --format="value(projectNumber)"
```

---

## Security Considerations

### Why WIF Instead of Service Account Keys?

| Service Account Key | Workload Identity Federation |
|---------------------|------------------------------|
| Long-lived (never expires) | Short-lived (~1 hour) |
| Must be stored as secret | No secrets to store |
| Can be leaked in logs | Token is workflow-specific |
| Hard to rotate | Automatic rotation |

### Principle of Least Privilege

The service account should only have permissions needed for deployment:
- `roles/firebase.admin` - Deploy hosting and functions
- `roles/cloudfunctions.developer` - Deploy functions
- `roles/iam.serviceAccountUser` - Act as service account

**Do not grant** `roles/owner` or `roles/editor` - too permissive!

---

## Customization

### Adding Staging/Production Workflows

Create separate workflow files with different triggers:

**deploy-staging.yml**:
```yaml
on:
  push:
    branches:
      - 'release/**'
environment:
  name: staging
```

**deploy-prod.yml**:
```yaml
on:
  workflow_dispatch:  # Manual only
environment:
  name: production
```

### Adding Deployment Approval

In GitHub repository settings:
1. Go to **Settings** > **Environments**
2. Create environment `production`
3. Enable **Required reviewers**
4. Add team members who can approve

---

## Exercise

To better understand this workflow:

1. Copy the YAML to a temporary file
2. Replace all placeholders with dummy values (e.g., `my-test-project`)
3. Create a test repository
4. Copy the modified YAML to `.github/workflows/deploy-dev.yml`
5. Push and watch GitHub validate the workflow syntax
6. (The deployment will fail without real WIF setup - that's expected!)

This exercise helps you understand the workflow structure without risking real deployments.

---

## Troubleshooting

### "Unable to detect Application Default Credentials"

**Cause**: WIF authentication failed.

**Fix**: Verify:
- `workload_identity_provider` path is correct
- Service account email is correct
- WIF was set up correctly with `setup-wif.sh`

### "Permission denied on Firebase"

**Cause**: Service account missing Firebase permissions.

**Fix**: Grant `roles/firebase.admin` to the service account.

### "Build failed: Cannot find module"

**Cause**: Dependencies not installed or build order wrong.

**Fix**: 
1. Run `pnpm build` locally to verify
2. Check `turbo.json` for correct task dependencies

---

## Related Files

- [CI-CD-Pipeline-Guide.md](CI-CD-Pipeline-Guide.md) - Overview and concepts
- [CI.md](CI.md) - Continuous Integration workflow
- [setup-wif.sh](../../scripts/setup-wif.sh) - WIF setup script

---

> **Remember**: This is an educational template. Real deployments require completing the full setup checklist in [CI-CD-Pipeline-Guide.md](CI-CD-Pipeline-Guide.md).

