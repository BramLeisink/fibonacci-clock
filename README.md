# Fibonacci Klok 📟

Dit project is een interactieve **Fibonacci-klok** die de tijd op een unieke manier weergeeft. De klok gebruikt gekleurde blokken die gebaseerd zijn op de **Fibonacci-reeks** om uren en minuten weer te geven.

![Screenshot van de Fibonacci Klok](/static/screenshot.png)

## 🚀 Functionaliteiten

- **Thema's:** Kies uit verschillende kleurthema's.
- **Vormen:** Pas de blokken aan naar **rond**, **vierkant** of **cirkelvormig**.
- **Responsief:** Werkt op zowel desktop als mobiel.
- **Dynamische Animaties:** Blokken veranderen soepel om de tijd bij te werken.

## 📚 Hoe werkt het?

De klok toont de tijd met blokken die waarden uit de Fibonacci-reeks (**1, 1, 2, 3, 5**) gebruiken. Elke kleur representeert een onderdeel van de tijd:

- **Uren**: Rode blokken
- **Minuten**: Groene blokken
- **Combinatie**: Blauwe blokken

Tel de blokken bij elkaar op om de huidige tijd te berekenen. (Deze kleuren zijn aanpasbaar.)

### URL parameters

Door middel van URL-parameters is zijn de instellingen van de klok gemakkelijk aan te passen. Dit kan handig zijn, bijvoorbeeld als het niet mogelijk is om zelf de instellingen aan te passen (denk aan bijvoorbeeld een TV). De volgende instellingen zijn via URL-parameters beschikbaar:

* `colors` past het kleurenthema aan. Mogelijke waarden zijn de thema's die later worden omschreven;
* `shape` bepaald de vorm van de vlakken. Mogelijke waarden zijn `rounded`, `square` en `circle`;
* `glow` past aan of de vlakken een gekleurde gloed hebben. Mogelijke waarden zijn `true` en `false`;
* `animate` verandert of de vlakken met een animatie veranderen. Mogelijke waarden zijn `true` en `false`;
* `minutes` bepaald of ook de minuten in de klok worden laten zien. Mogelijke waarden zijn `true` en `false`;
* `legend` zorgt er voor dat de legenda wel/niet te zien is. Mogelijke waarden zijn `true` en `false`;
* `mode` verandert het globale kleurenthemea (licht of donken). Mogelijke waarden zijn `light` en `dark`.

Deze parameters kunnen bijvoorbeeld als volgt worden gebruikt:

`http://fibonacci.bramleisink.nl/?colors=sunrise&mode=dark&fullscreen=true&glow=true`

### Kleurenthema's

* `default`
* `sunrise`
* `ocean`
* `forrest`

## 🛠️ Installatie

1. **Clone de repository**:
   ```bash
   git clone https://github.com/BramLeisink/fibonacci-clock.git
   cd fibonacci-clock
   ```
2. **Installeer afhankelijkheden**:
   ```
   npm install
   ```
3. **Start de applicatie**:
   ```
   npm run dev
   ```
4. **Open in de browser**: Ga naar http://localhost:5173.
