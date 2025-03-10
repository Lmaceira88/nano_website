# PowerShell script to copy multi-tenant implementation files to ProjectNano.co.uk folder

# Define paths
$sourceDir = $PWD.Path
$targetDir = "C:\Users\lmace\Desktop\ProjectNano.co.uk"

# Create necessary directories in target
New-Item -ItemType Directory -Force -Path "$targetDir\src\utils" | Out-Null
New-Item -ItemType Directory -Force -Path "$targetDir\src\hooks" | Out-Null
New-Item -ItemType Directory -Force -Path "$targetDir\src\components" | Out-Null
New-Item -ItemType Directory -Force -Path "$targetDir\src\app\api\tenants" | Out-Null
New-Item -ItemType Directory -Force -Path "$targetDir\src\app\api\[tenant]\appointments" | Out-Null

# Copy files
Write-Host "Copying multi-tenant implementation files..." -ForegroundColor Green

# Database schema
Copy-Item "$sourceDir\multi-tenant-schema.sql" -Destination "$targetDir\" -Force
Write-Host "✓ Copied multi-tenant-schema.sql" -ForegroundColor Cyan

# Documentation
Copy-Item "$sourceDir\MULTI_TENANT_IMPLEMENTATION.md" -Destination "$targetDir\" -Force
Write-Host "✓ Copied MULTI_TENANT_IMPLEMENTATION.md" -ForegroundColor Cyan

# Utilities and hooks
Copy-Item "$sourceDir\src\utils\tenantContext.ts" -Destination "$targetDir\src\utils\" -Force
Write-Host "✓ Copied tenantContext.ts" -ForegroundColor Cyan

Copy-Item "$sourceDir\src\utils\serverTenantContext.ts" -Destination "$targetDir\src\utils\" -Force
Write-Host "✓ Copied serverTenantContext.ts" -ForegroundColor Cyan

Copy-Item "$sourceDir\src\hooks\useTenant.ts" -Destination "$targetDir\src\hooks\" -Force
Write-Host "✓ Copied useTenant.ts" -ForegroundColor Cyan

# Middleware
Copy-Item "$sourceDir\src\middleware.ts" -Destination "$targetDir\src\" -Force
Write-Host "✓ Copied middleware.ts" -ForegroundColor Cyan

# API routes
Copy-Item "$sourceDir\src\app\api\tenants\route.ts" -Destination "$targetDir\src\app\api\tenants\" -Force
Write-Host "✓ Copied tenants API route" -ForegroundColor Cyan

Copy-Item "$sourceDir\src\app\api\[tenant]\appointments\route.ts" -Destination "$targetDir\src\app\api\[tenant]\appointments\" -Force
Write-Host "✓ Copied tenant-specific appointments API route" -ForegroundColor Cyan

# Components
Copy-Item "$sourceDir\src\components\TenantAppointmentList.tsx" -Destination "$targetDir\src\components\" -Force
Write-Host "✓ Copied TenantAppointmentList component" -ForegroundColor Cyan

Write-Host "✓ All files copied successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run the multi-tenant-schema.sql script in your Supabase SQL editor" -ForegroundColor Yellow
Write-Host "2. Update your .env file with the necessary environment variables" -ForegroundColor Yellow
Write-Host "3. Test the multi-tenant implementation by creating a test tenant" -ForegroundColor Yellow
Write-Host ""
Write-Host "For detailed instructions, refer to MULTI_TENANT_IMPLEMENTATION.md" -ForegroundColor Yellow 