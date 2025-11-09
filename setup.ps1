Write-Host "Setting up SaaS Boilerplate..." -ForegroundColor Cyan
Write-Host ""

# Check if .env files exist
if (-not (Test-Path "server/.env")) {
    Write-Host "Creating server/.env from template..." -ForegroundColor Yellow
    Copy-Item "server/.env.example" "server/.env"
    Write-Host "Warning: Please edit server/.env and add your DATABASE_URL" -ForegroundColor Yellow
} else {
    Write-Host "server/.env already exists" -ForegroundColor Green
}

if (-not (Test-Path "client/.env")) {
    Write-Host "Creating client/.env from template..." -ForegroundColor Yellow
    Copy-Item "client/.env.example" "client/.env"
    Write-Host "client/.env created" -ForegroundColor Green
} else {
    Write-Host "client/.env already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Installing server dependencies..." -ForegroundColor Cyan
Set-Location server
pnpm install

Write-Host ""
Write-Host "Installing client dependencies..." -ForegroundColor Cyan
Set-Location ../client
pnpm install

Set-Location ..

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Edit server/.env and add your DATABASE_URL from Neon"
Write-Host "2. Run 'cd server; pnpm run db:push' to set up the database"
Write-Host "3. Run 'cd server; pnpm run db:generate' to generate Prisma Client"
Write-Host "4. Start the server: 'cd server; pnpm run dev'"
Write-Host "5. Start the client: 'cd client; pnpm run dev'"
Write-Host "" -ForegroundColor Cyan
