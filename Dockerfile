FROM node:16
WORKDIR /app/
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
RUN mkdir .next/ && chown node .next/
USER node
EXPOSE 3000
CMD ["yarn", "dev"]
