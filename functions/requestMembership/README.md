# Erstellen der Datenbank-Ressourcen für eine Mitgliedschaft

> Diese Funktion erstellt einen neuen Eintrag in der Appwrite-Collection `mitgliedschaften` und sendet eine Benachrichtigung per E-Mail.

**Die E-Mail muss verifiziert sein!**

_TODO(@floherzler): wie müssen wir den AGB-Timestamp speichern?_

## Funktion erhält:
- `membership_id`: welcher Verwendungszweck wird für die Überweisung angegeben?
- `user_id`: für wen wird die Mitgliedschaft beantragt?
- `typ`: `privat` oder `business`
- `dauer`: in Jahren, default ist 1 Jahr
- `preis`: den fälligen Gesamtpreis

## Aktionen:
### Datenbank (`mitgliedschaft`-Collection)
- alle erhaltenen Informationen
- `beantragungs_datum`: auf den aktuellen Zeitstempel
- `status`: auf `beantragt`
- `bezahl_status`: auf `warten` gesetzt
- `kontingent_start`: auf `preis`

### E-Mail
- Benachrichtigung über Eingang des Antrags einer Migliedschaft
- PDF einer generierten Rechnung
- Zahlungsaufruf für innerhalb einer Woche
