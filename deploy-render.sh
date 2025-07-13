#!/bin/bash

# Render Deployment Preparation Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required files exist
check_files() {
    print_status "Checking required files..."
    
    local required_files=(
        "render.yaml"
        "backend/src/main/resources/application-render.properties"
        "frontend/package.json"
        "backend/build.gradle"
    )
    
    for file in "${required_files[@]}"; do
        if [ -f "$file" ]; then
            print_success "✓ $file"
        else
            print_error "✗ $file (missing)"
            exit 1
        fi
    done
}

# Check repository status
check_repository() {
    print_status "Checking repository..."
    
    if [ ! -d ".git" ]; then
        print_error "Git repository not found. Please initialize git."
        exit 1
    fi
    
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "You have uncommitted changes. Please commit them:"
        echo "  git add ."
        echo "  git commit -m 'Prepare for Render deployment'"
        echo "  git push origin main"
    else
        print_success "Repository is clean"
    fi
}

# Show deployment steps
show_steps() {
    print_status "Deploy on Render:"
    echo ""
    echo "1. Push to GitHub:"
    echo "   git add . && git commit -m 'Deploy' && git push"
    echo ""
    echo "2. Go to https://render.com"
    echo "3. Click 'New +' → 'Blueprint'"
    echo "4. Connect your GitHub repository"
    echo "5. Review and deploy!"
    echo ""
    echo "Your app will be available at:"
    echo "  Frontend: https://university-frontend.onrender.com"
    echo "  Backend: https://university-backend.onrender.com"
}

# Main script
main() {
    echo "🚀 Render Deployment Check"
    echo "=========================="
    echo ""
    
    check_files
    check_repository
    show_steps
    
    print_success "Ready for deployment!"
}

main "$@" 