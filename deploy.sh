#!/bin/bash

# University Course Management System Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check if required ports are available
check_ports() {
    local ports=("3000" "8080" "3306" "80")
    local available=true
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            print_warning "Port $port is already in use"
            available=false
        fi
    done
    
    if [ "$available" = false ]; then
        print_error "Some required ports are already in use. Please free up the ports and try again."
        exit 1
    fi
    print_success "All required ports are available"
}

# Function to create .env file if it doesn't exist
setup_env() {
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp env.example .env
        print_warning "Please edit .env file with your production values before continuing"
        print_status "Press Enter to continue or Ctrl+C to abort..."
        read
    else
        print_success ".env file already exists"
    fi
}

# Function to build and start services
deploy() {
    local mode=$1
    
    print_status "Starting deployment in $mode mode..."
    
    if [ "$mode" = "production" ]; then
        docker-compose -f docker-compose.prod.yml up --build -d
    else
        docker-compose up --build -d
    fi
    
    print_success "Services started successfully"
}

# Function to wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for MySQL
    print_status "Waiting for MySQL..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker-compose exec -T mysql mysqladmin ping -h localhost --silent; then
            print_success "MySQL is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "MySQL failed to start within 60 seconds"
        exit 1
    fi
    
    # Wait for Backend
    print_status "Waiting for Backend..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
            print_success "Backend is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Backend failed to start within 60 seconds"
        exit 1
    fi
    
    # Wait for Frontend
    print_status "Waiting for Frontend..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            print_success "Frontend is ready"
            break
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "Frontend failed to start within 60 seconds"
        exit 1
    fi
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    docker-compose ps
    
    print_status "Service URLs:"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:8080"
    echo "Health Check: http://localhost:8080/actuator/health"
    if [ -f docker-compose.prod.yml ] && docker-compose -f docker-compose.prod.yml ps | grep -q nginx; then
        echo "Nginx Proxy: http://localhost"
    fi
}

# Function to show logs
show_logs() {
    print_status "Showing logs (Ctrl+C to exit)..."
    docker-compose logs -f
}

# Function to stop services
stop_services() {
    print_status "Stopping services..."
    docker-compose down
    print_success "Services stopped"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up..."
    docker-compose down -v
    docker system prune -f
    print_success "Cleanup completed"
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        check_docker
        check_ports
        setup_env
        deploy "development"
        wait_for_services
        show_status
        ;;
    "deploy-prod")
        check_docker
        check_ports
        setup_env
        deploy "production"
        wait_for_services
        show_status
        ;;
    "start")
        docker-compose up -d
        show_status
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        docker-compose up -d
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  deploy        Deploy in development mode (default)"
        echo "  deploy-prod   Deploy in production mode with nginx"
        echo "  start         Start existing containers"
        echo "  stop          Stop containers"
        echo "  restart       Restart containers"
        echo "  logs          Show logs"
        echo "  status        Show service status"
        echo "  cleanup       Stop containers and clean up volumes"
        echo "  help          Show this help message"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac 