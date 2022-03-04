# Introduction to Git and GitHub

### Was ist Git?

Git ist ein dezentrales Versionsverwaltungsprogramm. Bei Softwareprojekten hilft Git dabei, sich die von unterschiedlichen Entwicklern durchgeführten Änderungen zu merken. Später können Sie nachvollziehen, wer wann welche Änderungen durchgeführt hat (und wer für den zwei Jahre später entdeckten katastrophalen Sicherheitsbug verantwortlich war ...).  
Grundsätzlich können Sie Git für jede Art von Projekt verwenden, bei dem nur Sie oder ein ganzes Team immer wieder diverse Dateien verändern, hinzufügen oder löschen.  

Besonders gut funktioniert Git, wenn ein Projekt aus vielen, relativ kleinen Text- dateien besteht. Zwar kommt Git auch mit Binärdateien zurecht, allerdings lassen sich dann Veränderungen in solchen Dateien schwer nachvollziehen. Insofern ist Git nicht ideal geeignet, um Änderungen in Office-Dokumenten, in Audio- und Videodateien oder in den Images virtueller Maschinen zu verfolgen.  

Im Terminal oder in der PowerShell steuern Sie Git durch das Kommando git. Die zahlreichen Optionen dieses Kommandos erlauben Ihnen, Git-Projekte von externen Repositorys wie GitHub herunterzuladen, geänderte Dateien in einem »Commit« zu speichern und wieder hochzuladen, zwischen verschiedenen Zweigen eines Softwareprojekts zu wechseln (z. B. master und develop ), Änderungen rückgängig zu machen etc. (Als Repository gilt die Sammlung aller Dateien eines Projekts, wobei darin nicht nur die aktuelle Version enthalten ist, sondern auch alle früheren Versionen und alle Entwicklungszweige.)  

Zumindest ein Subset der Git-Funktionen können Sie aber auch über komfortable Oberflächen nutzen. Nahezu alle gängigen Entwicklungsumgebungen (Visual Studio, Xcode, IntelliJ, Android Studio usw.) sowie die meisten größeren Editoren (Atom, Sublime, VSCode etc.) stellen Menükommandos zur Auswahl, mit denen Sie elementare Git-Operationen unkompliziert durchführen können. Analog gilt das auch für
Weboberflächen wie GitHub oder GitLab. Damit können Sie nicht nur Git-Projekte verwalten und beispielsweise die in einer Datei durchgeführten Änderungen verfolgen, sondern auch diverse Zusatzfunktionen nutzen (Issue/Bug-Management, automatisierte Tests etc.).  

Bei allem Charme, der von komfortablen Benutzeroberflächen ausgeht, muss Ihnen aber klar sein: Wenn Sie Git nicht verstehen, werden Sie bei der Anwendung noch so hübscher Tools früher oder später in der Sackgasse landen (eher früher).

### Git versus GitHub versus GitLab

Grundsätzlich ist Git ein dezentrales Werkzeug, das nicht auf zentrale Repositorys angewiesen ist. In der Praxis sind externe Git-Repositorys wie GitHub oder GitLab aber allgegenwärtig. Sie vereinfachen den Datenaustausch zwischen den Mitgliedern eines Entwicklungsteams erheblich, dienen als zusätzliches Backup und stellen diverse Zusatzfunktionen (Dokumentation, Bug-Tracker, Qualitätssicherung etc.) zur Verfügung. Bei öffentlichen Projekten fungieren sie auch als Informations- und Downloadseite für alle Personen, die am Projekt interessiert sind.  

Moderne Weboberflächen erleichtern sowohl den Einstieg als auch die Administration von Projekten. Unter den Git-Hosting-Anbietern hat die 2018 von Microsoft aufgekaufte Firma GitHub aktuell den größten Marktanteil. Open-Source-Projekte konnten dort schon immer kostenlos eingerichtet werden.  
Zu GitHub gibt es eine Menge Alternativen. Am bekanntesten ist die Firma GitLab, die ganz ähnliche Funktionen anbietet – auch in diesem Fall je nach Anforderung kostenlos oder kommerziell. Die eigentliche Besonderheit von GitLab besteht darin, dass der Quellcode des Programms frei zur Verfügung steht. Damit ist es möglich, GitLab auf einem eigenen Server einzurichten.  
Weitere Anbieter für das Git-Hosting bzw. für entsprechende Software sind Azure Repos, Bitbucket sowie Gitea und Gitolite (beide zum Betrieb auf einem eigenen Server).  

Git-Hoster sind keine Alternative zu Git, sondern eine Ergänzung!
Anbieter wie GitHub oder GitLab ersetzen weder die Git-Konzepte noch das Kommando git! Vielmehr bauen diese Firmen auf den durch Git vorgegebenen Ideen auf. Sie bieten Zusatzfunktionen, die sich in der Praxis als enorm nützlich erwiesen haben, und sie mindern die Einstiegshürde.

Quelle:
_Git - Projektverwaltung für Entwickler und DevOps-Teams_  
Bernd Öggl und Michael Kofler  
Rheinwerk Verlag
