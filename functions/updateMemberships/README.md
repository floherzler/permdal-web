# Überprüfe Mitgliedschaften

> Diese Funktion überprüft täglich alle Mitgliedschaften und sendet daraufhin Benachrichtigungen per E-Mail und deaktiviert abgelaufene Mitgliedschaften.

## Aktionen pro Mitgliedschaft
- `status` ist `warten` und `beantragungs_datum` war vor 7 Tagen
    - E-Mail mit Zahlungserinnerung
- `status` ist `aktiv` und `ende` ist in 14 Tagen
    - E-Mail mit Ablaufserinnerung
- `status` ist `aktiv` und `ende` ist heute
    - setze `status` auf `abgelaufen`
    - entferne User-Label `privatKunde`/ `businessKunde`
    - E-Mail mit Information über Ablauf
    - _TODO(@floherzler) kann Guthaben noch aufgebraucht werden, bis wann und wie?_
- `status` ist `abgelaufen` -> nichts