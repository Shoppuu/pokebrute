# Pokebrute - Game Design

## Vision

Jeu de combats automatiques inspiré de La Brute dans l'univers Pokémon.

Le joueur observe les combats mais ne choisit pas les actions pendant le combat.

---

## Qualités

- Commun
- Rare
- Épique
- Légendaire

### Multiplicateurs actuels

- Commun : 1.00
- Rare : 1.10
- Épique : 1.20
- Légendaire : 1.35

---

## Types

Types actuellement disponibles :

- NORMAL
- FIRE
- WATER
- GRASS
- ELECTRIC
- FIGHTING
- PSYCHIC
- FLYING

### Bonus de type

Avantage : +30% dégâts

---

## Progression

Les statistiques de base définissent la croissance.

Une espèce rapide reste rapide au niveau 100.
Une espèce offensive reste offensive au niveau 100.

---

## Combat

### PV

PV = DEF × 10 (objectif cible)

### Initiative

La vitesse décide qui attaque en premier.

### Dégâts

Dégâts = ATK × aléatoire(0.8 à 1.2)

### Esquive

Chance = SPD / 1000

Maximum : 25%

### Résultat

Le combat génère une suite d'événements :

- attaque
- esquive
- victoire

Ces événements sont ensuite animés côté interface.

---

## Philosophie

Le joueur regarde un combat vivant se dérouler à l'écran, à la manière de La Brute.
