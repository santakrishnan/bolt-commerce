# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Arrow E-commerce seriously. If you have discovered a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: [security@yourdomain.com](mailto:security@yourdomain.com)

Include the following information:
- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability

### Response Time

- We will acknowledge your email within 48 hours
- We will provide a detailed response within 5 business days
- We will keep you informed about the progress of fixing the vulnerability

### Disclosure Policy

- Security issues should be reported privately
- We will coordinate the disclosure timeline with you
- We aim to fix critical vulnerabilities within 30 days

## Security Best Practices

When contributing to this project:
- Never commit sensitive information (API keys, passwords, tokens)
- Use environment variables for configuration
- Keep dependencies up to date
- Run security scans regularly (`pnpm audit`)
- Follow the principle of least privilege

## Security Updates

Security updates will be released as patch versions and documented in the CHANGELOG.md file with a `[SECURITY]` tag.

## Contact

For any security-related questions, contact: [security@yourdomain.com](mailto:security@yourdomain.com)
