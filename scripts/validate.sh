#!/bin/bash
# Validation script for Infraguard repository
# This script validates Terraform, shell scripts, and cloud-init configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
ERRORS=0
WARNINGS=0
SUCCESS=0

echo "============================================"
echo "Infraguard Repository Validation"
echo "============================================"
echo ""

# Function to print colored messages
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    ((ERRORS++))
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    ((WARNINGS++))
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    ((SUCCESS++))
}

# Check if required tools are installed
check_dependencies() {
    echo "Checking dependencies..."
    
    local deps=("terraform" "git")
    for dep in "${deps[@]}"; do
        if command -v "$dep" &> /dev/null; then
            print_success "$dep is installed"
        else
            print_error "$dep is not installed"
        fi
    done
    
    # Optional tools
    if command -v shellcheck &> /dev/null; then
        print_success "shellcheck is installed (optional)"
    else
        print_warning "shellcheck is not installed (recommended for shell script validation)"
    fi
    
    if command -v yamllint &> /dev/null; then
        print_success "yamllint is installed (optional)"
    else
        print_warning "yamllint is not installed (recommended for YAML validation)"
    fi
    
    echo ""
}

# Validate Terraform configurations
validate_terraform() {
    echo "Validating Terraform configurations..."
    
    # Find all directories containing .tf files
    local tf_dirs=(
        "terraform/sec-ops-infra"
        "terraform/zerotier/terraform"
        "terraform/sec-ops-infra/examples/aws-basic"
    )
    
    for dir in "${tf_dirs[@]}"; do
        if [ -d "$dir" ]; then
            echo "  Checking $dir..."
            
            # Format check
            if terraform fmt -check -recursive "$dir" &> /dev/null; then
                print_success "Terraform format check passed for $dir"
            else
                print_warning "Terraform files in $dir need formatting (run: terraform fmt)"
            fi
            
            # Initialize and validate
            cd "$dir" || continue
            if terraform init -backend=false &> /dev/null; then
                if terraform validate &> /dev/null; then
                    print_success "Terraform validation passed for $dir"
                else
                    print_error "Terraform validation failed for $dir"
                fi
            else
                print_error "Terraform init failed for $dir"
            fi
            cd - &> /dev/null || exit
        else
            print_warning "Directory $dir not found"
        fi
    done
    
    echo ""
}

# Validate shell scripts
validate_shell_scripts() {
    echo "Validating shell scripts..."
    
    # Find all .sh files
    local scripts
    mapfile -t scripts < <(find . -type f -name "*.sh" ! -path "./.git/*")
    
    if [ ${#scripts[@]} -eq 0 ]; then
        print_warning "No shell scripts found"
        return
    fi
    
    for script in "${scripts[@]}"; do
        # Check if file is executable
        if [ -x "$script" ]; then
            print_success "$script is executable"
        else
            print_warning "$script is not executable (run: chmod +x $script)"
        fi
        
        # Syntax check
        if bash -n "$script" &> /dev/null; then
            print_success "$script syntax is valid"
        else
            print_error "$script has syntax errors"
        fi
        
        # Shellcheck if available
        if command -v shellcheck &> /dev/null; then
            if shellcheck "$script" &> /dev/null; then
                print_success "$script passed shellcheck"
            else
                print_warning "$script has shellcheck warnings"
            fi
        fi
    done
    
    echo ""
}

# Validate cloud-init YAML files
validate_cloudinit() {
    echo "Validating cloud-init configurations..."
    
    # Find all YAML files in cloudinit directory
    if [ ! -d "cloudinit/examples" ]; then
        print_warning "cloudinit/examples directory not found"
        return
    fi
    
    local yaml_files
    mapfile -t yaml_files < <(find cloudinit/examples -type f \( -name "*.yaml" -o -name "*.yml" \))
    
    if [ ${#yaml_files[@]} -eq 0 ]; then
        print_warning "No cloud-init YAML files found"
        return
    fi
    
    for file in "${yaml_files[@]}"; do
        # Check if file starts with #cloud-config
        if head -n 1 "$file" | grep -q "#cloud-config"; then
            print_success "$file has correct cloud-config header"
        else
            print_warning "$file missing #cloud-config header"
        fi
        
        # YAML syntax check with yamllint if available
        if command -v yamllint &> /dev/null; then
            if yamllint -d relaxed "$file" &> /dev/null; then
                print_success "$file passed YAML validation"
            else
                print_warning "$file has YAML issues"
            fi
        fi
    done
    
    echo ""
}

# Check for common issues
check_common_issues() {
    echo "Checking for common issues..."
    
    # Check for sensitive files that shouldn't be committed
    local sensitive_patterns=(
        "*.tfvars"
        "*.pem"
        "*.key"
        "*password*"
        "*secret*"
        ".env"
    )
    
    for pattern in "${sensitive_patterns[@]}"; do
        if git ls-files | grep -i "$pattern" &> /dev/null; then
            print_warning "Found files matching pattern '$pattern' - ensure no secrets are committed"
        fi
    done
    
    # Check if .gitignore exists
    if [ -f ".gitignore" ]; then
        print_success ".gitignore file exists"
    else
        print_error ".gitignore file is missing"
    fi
    
    # Check for README files
    if [ -f "README.md" ]; then
        print_success "Main README.md exists"
    else
        print_error "Main README.md is missing"
    fi
    
    echo ""
}

# Main execution
main() {
    check_dependencies
    validate_terraform
    validate_shell_scripts
    validate_cloudinit
    check_common_issues
    
    # Summary
    echo "============================================"
    echo "Validation Summary"
    echo "============================================"
    echo -e "${GREEN}Successful checks: $SUCCESS${NC}"
    echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
    echo -e "${RED}Errors: $ERRORS${NC}"
    echo ""
    
    if [ $ERRORS -gt 0 ]; then
        echo "Validation completed with errors!"
        exit 1
    elif [ $WARNINGS -gt 0 ]; then
        echo "Validation completed with warnings."
        exit 0
    else
        echo "All validations passed!"
        exit 0
    fi
}

# Run main function
main
