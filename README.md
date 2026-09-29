# Broadcast SaaS

Aplicacao simplificada de Broadcast com React, TypeScript, Firebase Auth, Firestore e Cloud Functions.

## Estrutura

- `web`: frontend Vite com React, Material UI e Tailwind CSS.
- `functions`: Cloud Functions responsaveis por tarefas de backend, incluindo atualizacao de mensagens agendadas.
- `firestore.rules`: isolamento multi-tenant por `clientId`.
- `firestore.indexes.json`: indices esperados para consultas em tempo real.

## Modelagem sem subcolecoes

Todas as entidades ficam em collections raiz:

- `clients/{uid}`: cadastro do cliente.
- `connections/{id}`: `{ clientId, name, createdAt, updatedAt }`.
- `contacts/{id}`: `{ clientId, connectionId, name, phone, createdAt, updatedAt }`.
- `messages/{id}`: `{ clientId, connectionId, contactIds, text, status, scheduledAt, sentAt, createdAt, updatedAt }`.

O isolamento entre clientes acontece por `clientId`, sempre igual ao `uid` autenticado. As regras do Firestore impedem leitura e escrita fora do tenant do usuario.

## Comandos

```bash
npm install
npm run dev:web
npm run build
firebase deploy
```
