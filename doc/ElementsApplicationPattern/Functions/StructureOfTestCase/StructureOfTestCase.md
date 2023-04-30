# Structure of Test Case

Folder

Documentation

Eventuell mehrere Requests
- Variablen in mittlerer Ebene anlegen
- Spezifischen Input beschaffen
- Bedingungen herstellen (application under test oder anderes präparieren)
- Test request durchführen
- Umgebungsreaktion messen
- Test auswerten und Ergebnis speichern/ausgeben
- Umgebung (application under test oder andere) wieder in ursprünglichen Zustand bringen
- Variablen in mittlerer Ebene anlegen


# Structure of Request

### Structure of Pre-request Script
Erst Variablen laden
...
Zum Schluss URI zusammensetzen und local ablegen


### Structure of request  

[wo bekommt er URI und Body her?
Warum Keine Umgebungsvariablen? alles muss aus dem script kommen
parameter header etc. die immer gleich sind und darum nicht in den scripten stehen]


### Structure of the Post-request Script

Erst Variablen laden
...
Zum Schluss Ergebnis in Umgebung ablegen


