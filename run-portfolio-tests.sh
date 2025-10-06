#!/bin/bash

# Portfolio API Test Runner
# This script runs all portfolio-related tests and provides detailed output

echo "🧪 Running Portfolio API Tests..."
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to run tests with error handling
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "\n${BLUE}Running $test_name...${NC}"
    echo "Command: $test_command"
    echo "----------------------------------------"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ $test_name passed${NC}"
        return 0
    else
        echo -e "${RED}❌ $test_name failed${NC}"
        return 1
    fi
}

# Track test results
total_tests=0
passed_tests=0

# Test 1: Portfolio API Unit Tests
run_test "Portfolio API Unit Tests" "npm run test:run src/hooks/portfolio/api/__tests__/portfolioApi.test.ts"
if [ $? -eq 0 ]; then
    ((passed_tests++))
fi
((total_tests++))

# Test 2: Portfolio Template Selector Component Tests
run_test "Portfolio Template Selector Component Tests" "npm run test:run src/components/portfolio/__tests__/PortfolioTemplateSelector.test.tsx"
if [ $? -eq 0 ]; then
    ((passed_tests++))
fi
((total_tests++))

# Test 3: Portfolio Data Hook Tests
run_test "Portfolio Data Hook Tests" "npm run test:run src/hooks/portfolio/__tests__/usePortfolioData.test.ts"
if [ $? -eq 0 ]; then
    ((passed_tests++))
fi
((total_tests++))

# Test 4: All Portfolio Tests Together
run_test "All Portfolio Tests" "npm run test:run -- --reporter=verbose src/hooks/portfolio/ src/components/portfolio/"
if [ $? -eq 0 ]; then
    ((passed_tests++))
fi
((total_tests++))

# Test 5: Coverage Report
echo -e "\n${BLUE}Generating Coverage Report...${NC}"
echo "----------------------------------------"
if npm run test:coverage -- src/hooks/portfolio/ src/components/portfolio/; then
    echo -e "${GREEN}✅ Coverage report generated${NC}"
    ((passed_tests++))
else
    echo -e "${YELLOW}⚠️  Coverage report generation had issues${NC}"
fi
((total_tests++))

# Summary
echo -e "\n${BLUE}Test Summary${NC}"
echo "============"
echo -e "Total Tests: ${total_tests}"
echo -e "Passed: ${GREEN}${passed_tests}${NC}"
echo -e "Failed: ${RED}$((total_tests - passed_tests))${NC}"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "\n${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed${NC}"
    exit 1
fi
