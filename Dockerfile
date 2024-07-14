FROM node:20 as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY .env ./
COPY package*.json ./

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --omit=dev

FROM node:20

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/swagger-docs.json ./
COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["node", "dist/src/main.js"]
