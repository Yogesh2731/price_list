set -e   # exit immediately on any error

echo "=== [1/3] Installing frontend dependencies ==="
cd frontend
npm install --include=dev

echo "=== [2/3] Building frontend (Vite) ==="
npm run build

echo "=== [3/3] Installing backend dependencies ==="
cd ../backend
npm install

echo "=== Build complete ==="
