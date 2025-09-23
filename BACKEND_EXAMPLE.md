# Exemplo de Implementação da Rota /me no Backend

Este arquivo contém um exemplo de como implementar a rota `/me` no backend para retornar as informações do usuário autenticado.

## Estrutura da Resposta

A rota `/me` deve retornar um JSON com a seguinte estrutura:

```json
{
  "user_id": 123,
  "user_name": "João Silva",
  "user_scopes": ["user", "admin"]
}
```

## Exemplo de Implementação (FastAPI/Python)

```python
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from typing import List

router = APIRouter()
security = HTTPBearer()

# Configuração do JWT (ajuste conforme sua implementação)
SECRET_KEY = "sua-chave-secreta"
ALGORITHM = "HS256"

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Extrai e valida o token JWT"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

@router.get("/me")
async def get_me(current_user_id: str = Depends(get_current_user)):
    """
    Retorna informações do usuário autenticado
    """
    # Aqui você faria a consulta no banco de dados
    # Exemplo de dados mockados:
    user_data = {
        "user_id": int(current_user_id),
        "user_name": "João Silva",
        "user_scopes": ["user", "admin"]  # Scopes do usuário
    }
    
    return user_data
```

## Exemplo de Implementação (Node.js/Express)

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso necessário' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rota /me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.sub; // ou req.user.id, dependendo da estrutura do token
    
    // Aqui você faria a consulta no banco de dados
    // Exemplo de dados mockados:
    const userData = {
      user_id: userId,
      user_name: "João Silva",
      user_scopes: ["user", "admin"] // Scopes do usuário
    };
    
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
```

## Scopes Recomendados

Para o sistema de reserva de assentos, os seguintes scopes são recomendados:

- `user`: Usuário comum (pode fazer reservas)
- `admin`: Administrador (pode aprovar/reprovar reservas)
- `super_admin`: Super administrador (acesso total)

## Integração com o Frontend

O frontend já está configurado para consumir esta rota através do serviço `authService.getMe()` e o hook `useAuth()` já implementa a lógica para verificar scopes e mostrar o botão de admin quando apropriado.

## Teste da Rota

Para testar a rota, você pode usar:

```bash
curl -H "Authorization: Bearer SEU_TOKEN_AQUI" http://localhost:8000/me
```

Ou usar o Postman/Insomnia com:
- Method: GET
- URL: http://localhost:8000/me
- Headers: Authorization: Bearer SEU_TOKEN_AQUI
