# Vermerk der Zahlung für eine Mitgliedschaft

> Diese Funktion aktualisiert die Felder der Appwrite-Collection `mitgliedschaften` und sendet eine Benachrichtigung per E-Mail. Damit ist die Mitgliedschaft aktiviert.

> Nur User mit `admin`-Label können diese Funktion aufrufen

## Funktion erhält:
- `membership_id`: Dokumenten-ID ist die gleiche aus dem Verwendungszweck der Überweisung
- `bezahl_datum`

## Aktionen:
### Datenbank (`mitgliedschaft`-Collection)
- `bezahl_datum`: auf das erhaltene Datum
- `status`: auf `aktiv`
- `bezahl_status`: auf `bezahlt`
- `start`: Datetime.now
- `ende`: Datetime.now +  `dauer`
- `kontingent_aktuell`: auf das volle `kontingent_start`

### Auth (`users`)
- vergebe User-Label basierend auf Mitgliedschafts-Typ
    - `privatKunde` / `businessKunde`

### E-Mail
- Benachrichtigung über Aktivierung einer Migliedschaft
- Anfangsinformationen
- Infos über Ablaufdatum
