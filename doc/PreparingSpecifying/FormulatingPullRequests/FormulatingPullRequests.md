# Formulating Pull Requests

Viele große Open-Source-Projekte haben ein öffentliches GitHub-Repository. Sie können unkompliziert git clone ausführen, den Code herunterladen und ausführen bzw. kompilieren. Nicht funktionieren wird, den Code zu ändern und nach einem Commit mit git push wieder hochzuladen: Sie sind ja kein Mitglied des Entwicklerteams und können deswegen keine Änderungen durchführen. git push scheitert daher mit einer Fehlermeldung.
Nun könnten Sie natürlich mit den Entwicklern in Kontakt treten und sie bitten, Sie ins Team zu nehmen und Ihnen Collaboration-Rechte für das Repository zu geben. Das Echo wird jedoch verhalten bis skeptisch ausfallen. Schließlich ist unklar, wie groß Ihr Know-how ist, ob Ihr Code qualitativ überzeugt und den Richtlinien der anderen Entwickler entspricht usw. Generell versuchen die meisten Projekte, die Anzahl der Personen, die eigenständig Änderungen im Repository durchführen dürfen, möglichst klein zu halten.

GitHub hat deswegen eine andere Vorgehensweise etabliert, die von den meisten anderen Git-Plattformen in ähnlicher Form praktiziert wird:

**Erst Fork, ...**

* Um an einem fremden Projekt mitzuarbeiten, besuchen Sie seine GitHub-Seite und klicken dort auf den Button Fork.
* Sie erstellen damit eine Kopie des fremden Repositorys in Ihrem eigenen GitHub-Account.
* Im nächsten Schritt können Sie nun von dieser Kopie mit git clone ein lokales Repository auf Ihrem Rechner erstellen.
* Dort führen Sie die gewünschten Änderungen durch, testen Ihren Code, führen Commits aus.
* Wenn Ihre Änderungen abgeschlossen sind, übertragen Sie diese schließlich mit git push zurück in ihren GitHub-Fork, also in Ihre Kopie des ursprünglichen Repositorys.

**... dann Pull-Request**

* In der GitHub-Weboberfläche finden Sie in Ihrem lokalen Fork im Dialogblatt Pull-Requests den Button _New pull request_. Damit werden Sie auf die Seite des ursprünglichen Projekts umgeleitet.

    ![NewPullRequestButton](./pictures/NewPullRequestButton.png)

* Die GitHub-Oberfläche zeigt zuerst eine Zusammenfassung der durchgeführten Änderungen an.
* In einem weiteren Schritt übermitteln Sie eine Nachricht an die Entwickler des externen Repositorys, üblicherweise mit Informationen dazu, was Sie geändert haben und eventuell auch, warum.
* _Create pull request_ schließt den Vorgang ab.

    ![CreatePullRequestButton](./pictures/CreatePullRequestButton.png)

* Es obliegt den Besitzern des fremden Repositorys, Ihre Änderungen zu akzeptieren (_Merge pull request_), abzulehnen oder auch Verbesserungsvorschläge zu machen bzw. weitere Änderungen von Ihnen einzufordern (_Comment_).

Pull-Requests bieten die einzige Möglichkeit, an GitHub-Projekten teilzunehmen, ohne Mitglied des jeweiligen Entwicklerteams zu sein.  
Häufig werden sie projektintern verwendet, um unkoordinierte Änderungen am Repository zu verhindern. (Weitere Details zum Pull-Request auch in unten genannter Quelle.)

Beachten Sie, dass Forks und Pull Requests keine Git-Techniken sind. Dementsprechend gibt es dafür auch keine git-Subkommandos. Vielmehr müssen Sie diese Operationen in der Weboberfläche Ihrer Git-Plattform durchführen. Die Nomenklatur kann dabei je nach Plattform variieren. Unter GitLab ist beispielsweise von Merge-Requests die Rede.

Quelle:  
_Git - Projektverwaltung für Entwickler und DevOps-Teams_  
Bernd Öggl und Michael Kofler  
Rheinwerk Verlag

[Up to Preparing](../PreparingSpecifying.md)
