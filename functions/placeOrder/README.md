# Vermerkung der Mitglieder-Bestellungen

> Diese Funktion verknüpft die Mitgliedschaft mit verfügbaren Produkten in Staffeln.

## Funktion erhält:
- `mitgliedschaft_id`
- `user_id`
- `user_mail`
- `staffel_id`
- `menge`
- `preis`
- `abholung` als Zeitstempel

## Aktionen
1. prüft ob aktives Mitglied
2. prüft ob noch genügend Guthaben
3. prüft ob noch genügend `menge_verfuegbar`
4. reserviert angegebene Menge (zählt alle Bestellungen zusammen und aktualisiert `menge_verfuegbar` in `staffeln`)
5. erstellt Eintrag in `bestellungen` mit reservierter Menge und Abholdatum
6. versendet Bestätigungsmail

**Funktion gibt Fehlermeldung zurück, falls in den vorangehenden Schritten etwas fehlschlägt!**
