# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.9.x   | :white_check_mark: |
| < 0.9   | :x:                |

## Reporting a Vulnerability

We take the security of VERSA ARCH AI seriously.

If you discover a security vulnerability, please do **NOT** open an issue. 

Instead, please email `security@versa-arch.ai` (or the repository maintainer).

### Critical Areas
Please pay special attention to:
- **API Key Leakage**: Ensure `GEMINI_API_KEY` is never exposed in client-side bundles.
- **Prompt Injection**: The `learner_input` is sanitized before being sent to Agents, but rigorously test for jailbreaks.
- **Dependency Vulnerabilities**: We regularly scan `package.json` for patched versions.

We will acknowledge your report within 48 hours.
