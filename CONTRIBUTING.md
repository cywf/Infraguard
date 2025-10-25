# Contributing to Infraguard

Thank you for your interest in contributing to Infraguard! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Guidelines](#development-guidelines)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Security Vulnerabilities](#security-vulnerabilities)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment. We expect all contributors to:

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Git
- Terraform >= 1.0
- Cloud provider accounts (AWS, Azure, GCP, DigitalOcean, or Linode)
- Basic knowledge of Infrastructure as Code (IaC)
- Familiarity with cloud-init and bash scripting

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR-USERNAME/Infraguard.git
   cd Infraguard
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/cywf/Infraguard.git
   ```

3. **Create a branch for your changes**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

1. **Bug Fixes** - Fix issues in existing code
2. **New Features** - Add new cloud provider support, scripts, or configurations
3. **Documentation** - Improve or add documentation
4. **Examples** - Add example configurations or use cases
5. **Testing** - Add tests or improve test coverage
6. **Security** - Security improvements and vulnerability fixes

### Finding Issues to Work On

- Check the [Issues](https://github.com/cywf/Infraguard/issues) page
- Look for issues labeled `good first issue` or `help wanted`
- Comment on an issue to let others know you're working on it

## Development Guidelines

### Terraform Code Standards

1. **Formatting**
   ```bash
   # Format all Terraform files
   terraform fmt -recursive
   ```

2. **Validation**
   ```bash
   # Validate Terraform configuration
   terraform validate
   ```

3. **Documentation**
   - Document all variables in `variables.tf` with descriptions
   - Include examples in README files
   - Use descriptive resource names

4. **Module Structure**
   ```
   module/
   ├── README.md        # Module documentation
   ├── main.tf          # Main resources
   ├── variables.tf     # Input variables
   ├── outputs.tf       # Output values
   └── examples/        # Usage examples
       └── basic/
   ```

### Bash Script Standards

1. **Shebang and Set Options**
   ```bash
   #!/bin/bash
   set -e  # Exit on error
   set -u  # Exit on undefined variable
   ```

2. **Error Handling**
   - Always check command exit codes
   - Provide meaningful error messages
   - Use logging where appropriate

3. **Documentation**
   - Include script description at the top
   - Comment complex logic
   - Provide usage examples

### Cloud-Init Standards

1. **Format**
   - Use YAML format with `#cloud-config` header
   - Validate YAML syntax before committing

2. **Security**
   - Never include real credentials or secrets
   - Use variable placeholders for sensitive data
   - Document security considerations

3. **Testing**
   - Test configurations in a safe environment
   - Document any cloud-specific requirements

### Commit Message Guidelines

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(terraform): add GCP support for sec-ops-infra

Add Google Cloud Platform provider configuration and
resources for security operations infrastructure.

Closes #123
```

```
fix(docker): correct syntax errors in install script

Fixed invalid bash syntax and improved error handling
in docker_install.sh

Fixes #456
```

## Submitting Changes

### Pull Request Process

1. **Update your fork**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes**
   - Run formatters and validators
   - Test in at least one cloud environment
   - Ensure documentation is updated

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request**
   - Go to GitHub and create a PR from your fork
   - Fill out the PR template completely
   - Link related issues

5. **PR Review**
   - Address reviewer feedback promptly
   - Keep the PR focused on a single concern
   - Update documentation as needed

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Tests have been added/updated
- [ ] Documentation has been updated
- [ ] Commit messages follow guidelines
- [ ] All checks pass (linting, validation)
- [ ] No sensitive information committed
- [ ] Changes are backwards compatible (or documented)

## Reporting Issues

### Bug Reports

Include the following information:

1. **Description** - Clear description of the bug
2. **Steps to Reproduce** - Detailed steps to reproduce the issue
3. **Expected Behavior** - What you expected to happen
4. **Actual Behavior** - What actually happened
5. **Environment**:
   - Cloud provider
   - Terraform version
   - Operating system
6. **Logs** - Relevant error messages or logs
7. **Screenshots** - If applicable

### Feature Requests

Include the following information:

1. **Use Case** - Describe the problem you're trying to solve
2. **Proposed Solution** - Your suggested implementation
3. **Alternatives** - Other solutions you've considered
4. **Additional Context** - Any other relevant information

## Security Vulnerabilities

**Do not report security vulnerabilities through public GitHub issues.**

Instead:

1. Email security concerns to the maintainers
2. Include detailed information about the vulnerability
3. Allow time for the issue to be addressed before public disclosure

See [SECURITY.md](./SECURITY.md) for more details.

## Code Review Process

### For Contributors

- Be open to feedback
- Respond to comments in a timely manner
- Ask questions if feedback is unclear
- Make requested changes or explain why you disagree

### For Reviewers

- Be constructive and respectful
- Explain the reasoning behind suggestions
- Distinguish between required changes and suggestions
- Approve PRs when they meet standards

## Documentation

### Documentation Standards

1. **README Files**
   - Include purpose, usage, and examples
   - Keep formatting consistent
   - Update when making changes

2. **Code Comments**
   - Explain why, not what
   - Keep comments up to date
   - Remove commented-out code

3. **Examples**
   - Provide working examples
   - Include comments explaining the example
   - Test examples before committing

## Testing

### Manual Testing

1. **Terraform Configurations**
   ```bash
   terraform init
   terraform plan
   terraform apply
   terraform destroy
   ```

2. **Bash Scripts**
   ```bash
   shellcheck script.sh
   bash -n script.sh  # Syntax check
   ```

3. **Cloud-Init**
   ```bash
   cloud-init schema --config-file config.yaml
   ```

## License

By contributing to Infraguard, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have questions about contributing:

1. Check existing documentation
2. Search closed issues
3. Open a new issue with the `question` label
4. Reach out to maintainers

## Thank You!

Your contributions help make Infraguard better for everyone. We appreciate your time and effort!
