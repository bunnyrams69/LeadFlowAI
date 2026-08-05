#!/bin/bash
echo ""
echo "⚡ Starting LeadFlow AI..."
echo ""

cd backend
pip install -r requirements.txt -q
uvicorn main:app --port 8000 &
BACKEND_PID=$!
echo "✓ Backend running at http://localhost:8000"

cd ../frontend
npm install -q
npm run dev &
FRONTEND_PID=$!
echo "✓ Frontend running at http://localhost:5173"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  LeadFlow AI is ready"
echo "  Open: http://localhost:5173"
echo "  API:  http://localhost:8000/docs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop all servers"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
