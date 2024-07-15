FROM node:20 as builder

WORKDIR /home/node

COPY . .

RUN npm install
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
