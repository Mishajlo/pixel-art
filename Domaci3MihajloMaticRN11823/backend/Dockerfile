# Koristimo Node.js sliku
FROM node:16

# Postavljamo radni direktorijum unutar kontejnera
WORKDIR /app/src

# Kopiramo package fajlove i instaliramo zavisnosti
COPY package*.json ./
RUN npm install

# Kopiramo ceo projekat u radni direktorijum
COPY . .

# Kreiramo build za TypeScript
RUN npm run build

# Otvaramo port na kojem backend server sluša
EXPOSE 3001

# Pokrećemo backend aplikaciju
CMD ["npm", "start"]

