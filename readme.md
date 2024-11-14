cd backend
npm run dev

cd ../frontend
npm run dev

env backend

PORT = 8080
MONGO_URI = mongodb://administrator123:Congtinh0109%40%40@20.255.97.95:27017/
TOKEN_SECRET = 150131091ad22d4e4acecd1340fef3d6cef0477a3745520756e19c9f2021f37f18bb45aa135049ee36d4ad7439dc8cad72d928c95332c6b8da59c56521d85a56

env frontend

NEXT_PUBLIC_BASE_URL="http://localhost:8080/api"



