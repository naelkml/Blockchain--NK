# 🗳️ DApp Vote — React + Ethers.js (Sepolia)

## 📌 Description

Ce projet est une **application Web3 frontend** permettant d’interagir avec un **smart contract de vote déjà déployé** sur la blockchain Ethereum (réseau Sepolia).

🎯 **Objectif :** construire un bureau de vote décentralisé  
👉 Lecture des résultats → Connexion wallet → Vote → Temps réel → Explorer blockchain

---

## 🌐 Contrat utilisé

- 📍 Adresse : `0x291Ac3C6a92dF373dEa40fee62Ad39831B8A1DDC`

👉 Vérifier sur Etherscan :  
https://sepolia.etherscan.io/address/0x291Ac3C6a92dF373dEa40fee62Ad39831B8A1DDC

---

## 🧱 Stack technique

- **React + Vite** — Frontend
- **Ethers.js v6** — Interaction blockchain
- **MetaMask** — Wallet utilisateur
- **Sepolia** — Réseau Ethereum de test

---

## 🧠 Fonctionnalités

L’application permet de :

- 📊 Lire les résultats en temps réel (sans wallet)
- 🔐 Se connecter avec MetaMask
- 🗳️ Voter pour un candidat (transaction signée)
- ⏳ Gérer un cooldown de 3 minutes entre votes
- 📡 Écouter les votes en temps réel (events)
- 🔎 Explorer l’historique des transactions on-chain

---

## 👥 Candidats

- Léon Blum  
- Jacques Chirac  
- François Mitterrand  

---

## 📁 Structure du projet

```
src/
├── App.jsx        # Logique principale
├── main.jsx       # Entrée React
├── config.js      # Adresse contrat + réseau
└── abi.json       # ABI du smart contract
```

---

## 🔧 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Lancer le projet

```bash
npm run dev
```

👉 Accès : http://localhost:5173

---

## 🖥️ Fonctionnement

### 📖 Lecture des données (sans MetaMask)

- Utilisation de `BrowserProvider`
- Appels des fonctions `view`
- Aucun gas requis

```js
const provider = new BrowserProvider(window.ethereum)
const contract = new Contract(CONTRACT_ADDRESS, ABI, provider)

const count = await contract.getCandidatesCount()
```

---

### 🔐 Connexion MetaMask

- Demande d’accès via `eth_requestAccounts`
- Vérification du réseau Sepolia
- Récupération de l’adresse utilisateur

```js
await provider.send("eth_requestAccounts", [])
const signer = await provider.getSigner()
const address = await signer.getAddress()
```

---

### 🗳️ Vote (transaction on-chain)

- Vérification du cooldown
- Signature via MetaMask
- Envoi de transaction
- Attente confirmation (~12s)

```js
const tx = await contract.vote(candidateIndex)
await tx.wait()
```

---

### ⏳ Cooldown

- Basé sur `block.timestamp` (on-chain)
- Compte à rebours côté frontend
- Empêche le spam de votes

---

### 📡 Events en temps réel

- Écoute de `Voted`
- Mise à jour automatique de l’UI

```js
contract.on("Voted", handler)
```

---

### 🔎 Blockchain Explorer intégré

- Récupération des events via `queryFilter`
- Affichage :
  - Hash de transaction
  - Bloc
  - Votant
  - Candidat
  - Timestamp
  - Gas utilisé

---

## 🔁 Flux utilisateur

1. Chargement → résultats affichés
2. Connexion MetaMask
3. Vote
4. Signature → envoi → confirmation
5. Mise à jour des résultats
6. Cooldown actif
7. Écoute des votes en temps réel

---

## ⚠️ Prérequis

- Node.js v18+
- MetaMask installé
- Réseau Sepolia activé
- ETH de test :  
https://cloud.google.com/application/web3/faucet/ethereum/sepolia

---

## 🔐 Sécurité

- 🔑 La clé privée reste dans MetaMask
- 🧾 Toutes les transactions sont signées
- 🔍 Données publiques et vérifiables sur Etherscan

---

## 📚 Concepts appris

- Provider vs Signer
- Fonctions `view` vs écriture
- Transactions Ethereum
- Events on-chain
- Interaction React ↔ Blockchain
- Lecture historique (`queryFilter`)
- Gestion du gas et des blocs

---

## 🚀 Améliorations possibles

- 💰 Afficher le solde ETH du wallet
- 📊 Barre de progression des votes
- 🔍 Détail complet d’un bloc
- 🔗 Lien Etherscan après transaction
- 🔄 Gestion changement de compte MetaMask

---

## 🧑‍💻 Auteur

Projet réalisé dans le cadre du module **3WEB3 — Bloc 4 (B3)**  
