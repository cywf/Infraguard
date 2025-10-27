# Contributing to Infraguard

Thank you for your interest in contributing to Infraguard! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professional communication

## How to Contribute

### Reporting Issues

1. Check if the issue already exists
2. Use the issue template if available
3. Provide detailed information:
   - Description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, versions, etc.)
   - Relevant logs or error messages

### Suggesting Features

1. Open an issue with the "feature request" label
2. Describe the feature and its use case
3. Explain why it would benefit the project
4. Provide examples if possible

### Submitting Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/Infraguard.git
   cd Infraguard
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clear, documented code
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   - Run existing tests
   - Test manually if applicable
   - Verify Terraform configurations with `terraform validate`
   - Test Ansible playbooks with `--check` mode

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```
   
   Use clear commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `refactor:` for code refactoring
   - `test:` for test additions
   - `chore:` for maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear title and description
   - Reference related issues
   - Explain what changed and why
   - Add screenshots for UI changes

## Development Guidelines

### Terraform

- Use meaningful resource names
- Add comments for complex configurations
- Use variables for configurable values
- Include outputs for important information
- Follow HashiCorp style guidelines
- Test with `terraform fmt`, `terraform validate`, `terraform plan`

### Ansible

- Use YAML format consistently
- Name tasks descriptively
- Use variables for flexibility
- Include error handling
- Test playbooks with `--check` and `--diff`
- Document required variables

### Shell Scripts

- Use `#!/bin/bash` shebang
- Add error handling with `set -e`
- Include usage comments
- Use meaningful variable names
- Make scripts idempotent when possible
- Test on target platforms

### Documentation

- Use clear, concise language
- Include examples
- Update README.md when needed
- Keep documentation in sync with code
- Use proper markdown formatting

## Security Guidelines

1. **Never commit secrets**
   - Use environment variables
   - Use secrets managers (Vault, etc.)
   - Add sensitive patterns to .gitignore

2. **Security hardening**
   - Follow CIS benchmarks
   - Implement least privilege
   - Enable logging and monitoring
   - Use strong encryption

3. **Code review**
   - Review for security vulnerabilities
   - Check for credential exposure
   - Validate input sanitization
   - Verify secure defaults

## Testing

### Terraform Testing

```bash
# Format check
terraform fmt -check

# Validate configuration
terraform validate

# Plan without applying
terraform plan
```

### Ansible Testing

```bash
# Syntax check
ansible-playbook --syntax-check playbook.yml

# Dry run
ansible-playbook --check playbook.yml

# Test on single host first
ansible-playbook playbook.yml --limit test-host
```

### Script Testing

```bash
# Syntax check for bash
bash -n script.sh

# Use shellcheck if available
shellcheck script.sh
```

## Project Structure

When adding new components:

- Place Terraform configs in `terraform/`
- Place Ansible playbooks in `ansible/playbooks/`
- Place Ansible roles in `ansible/roles/`
- Place Packer templates in `packer/templates/`
- Place scripts in appropriate directories
- Add documentation in README files

## Questions?

If you have questions:
1. Check existing documentation
2. Search closed issues
3. Open a new issue with the "question" label
4. Be specific about what you need help with

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing to Infraguard!
