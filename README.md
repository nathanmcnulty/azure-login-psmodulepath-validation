# Azure Login PSModulePath validation

Reproduction and validation for slow PowerShell startup in `azure/login` when `enable-AzPSSession: true` prepends `/usr/share` on GitHub-hosted Linux runners.

| Validation | Result |
|---|---|
| [Cold-start reproduction](https://github.com/nathanmcnulty/azure-login-psmodulepath-validation/actions/runs/35564292172) | 4.48 s mean with the image default; 25.40 s with `/usr/share` prepended (10 fresh jobs per arm) |
| [Exact-base OIDC A/B](https://github.com/nathanmcnulty/azure-login-psmodulepath-validation/actions/runs/35564690907) | 54.8 s mean unpatched; 23.0 s patched |
| [Cross-platform tests](https://github.com/nathanmcnulty/azure-login-psmodulepath-validation/actions/runs/35564805984) | 56 tests and both bundles passed on Ubuntu and Windows |
| [Live OIDC validation](https://github.com/nathanmcnulty/azure-login-psmodulepath-validation/actions/runs/35564982024) | Tenant-only login and Az context verification passed on Ubuntu and Windows |

The test identity has no Azure role assignments.
