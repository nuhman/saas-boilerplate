#!/bin/bash

echo "Setting up SaaS Boilerplate..."
echo ""

# Check if .env files exist
if [ ! -f "server/.env" ]; then
    echo "Creating server/.env from template..."
    cp server/.env.example server/.env
    echo "Warning: Please edit server/.env and add your DATABASE_URL"
else
    echo "server/.env already exists"
fi

if [ ! -f "client/.env" ]; then
    echo "Creating client/.env from template..."
    cp client/.env.example client/.env
    echo "client/.env created"
else
    echo "client/.env already exists"
fi

echo ""
echo "Installing server dependencies..."
cd server
pnpm install

echo ""
echo "Installing client dependencies..."
cd ../client
pnpm install

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit server/.env and add your DATABASE_URL from Neon"
echo "2. Run 'cd server && pnpm run db:push' to set up the database"
echo "3. Run 'cd server && pnpm run db:generate' to generate Prisma Client"
echo "4. Start the server: 'cd server && pnpm run dev'"
echo "5. Start the client: 'cd client && pnpm run dev'"
echo ""
