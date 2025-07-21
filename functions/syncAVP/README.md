# Synchronisierung der Produkte aus dem Anbauplan

> Diese Funktioniert synchronisiert periodisch die Produkte und Staffeln aus dem Anbauplan über eine gesetzte Umgebungsvariable, die auf die CSV-Datei zugreifen kann.

## Funktion erhält:

## Aktionen:
- liest jede Zeile aus
  - existiert Produkt noch nicht?
    - erstelle in `produkte`
  - existiert Staffel noch nicht?
    - erstelle in `staffeln`

