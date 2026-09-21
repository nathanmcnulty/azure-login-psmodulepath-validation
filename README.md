# Azure Login PSModulePath validation

Private validation harness for the `azure/login` PowerShell module-path startup issue.

The workflow runs one cold `pwsh` process per fresh GitHub-hosted job. The PowerShell command is byte-identical between arms; only the child process's `PSModulePath` differs.
