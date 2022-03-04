### GitFlow Workflow

Dieser Workflow definiert ein striktes Branching-Modell, das auf die Auslieferung von Releases abzielt.  
Der Gitflow-Workflow weist verschiedenen Branches strikte Rollen zu, die festlegen, wie und wann sie interagieren.  
Er hat alle Vorteile des Feature-Branch-Modells: Pull-Requests, isolierte Experimente und eine effizientere Zusammenarbeit.  
Der Gitflow-Workflow nutzt ein zentrales Repository als Kommunikations-Drehkreuz für alle Entwickler.  
Wie bei den anderen Workflows arbeiten die Entwickler lokal und pushen Branches in das zentrale Repository.  
Der Unterschied liegt in der Branch-Struktur des Projekts.  

**master and develop branch**  
Statt eines einzelnen _master branch_ sieht dieser Workflow zwei Branches vor, welche die History des Projekts abbilden.  
Der _master branch_ enthält die offizielle Release-Historie, der _develop branch_ dient als Integrations-Branch für Features.  
Es ist zudem üblich, alle Commits in den _master branch_ mit Versionsnummern zu taggen.  

![Gitflow-Workflow-1](./pictures/Gitflow-Workflow-1.png)

**feature branch**  
Jedes neue Feature sollte in seinem eigenen Branch entwickelt werden, der für Backups und aus Gründen der Zusammenarbeit in das zentrale Repository gepusht werden kann.  
Doch statt Branches auf Basis des _master branch_ zu erzeugen, wird der _develop branch_ als Quelle genutzt.  
Wenn ein Feature fertig ist, wird es zurück in diesen _develop branch_ gemergt.  
Der Gitflow-Workflow sieht vor, dass Features niemals direkt mit dem _master branch_ interagieren.

![Gitflow-Workflow-2](./pictures/Gitflow-Workflow-2.png)

Die Kombination von _feature branch_ und _develop branch_ entspricht soweit dem Feature-Branch-Workflow.  
Doch der Gitflow-Prozess geht darüber hinaus.

**release branch**  
Wenn der _develop branch_ genügend Features für ein Release enthält (oder sich ein vordefinierter Release-Termin nähert), wird vom _develop branch_ ein _release branch_ geforkt. Damit beginnt der nächste Release-Zyklus.  

![Gitflow-Workflow-3](./pictures/Gitflow-Workflow-3.png)  

Neue Features sollten ab diesem Punkt nicht mehr hinzugefügt werden, sondern nur Bugfixes und ähnliche Release-orientierte Änderungen.  
Sobald das Release zur Auslieferung bereit ist, wird es in den _master branch_ gemergt und mit einer Versionsnummer getaggt.  
Zusätzlich sollte es zurück in den _develop branch_ gemergt werden, der sich weiterentwickelt haben könnte, seitdem das Release initiiert wurde.  

Die Nutzung eines dedizierten _release branch_ zur Vorbereitung von Releases ermöglicht es, dass ein Team das aktuelle Release feinschleift, während das andere Team weiter an Features für das nächste Release arbeitet.  
Auf diese Weise lassen sich Entwicklungsphasen sehr gut definieren und in der Struktur des Repositorys abbilden.  

**hotfix branch**  
_hotfix branch_ eignen sich für das Patchen von Produktiv-Releases.  
Ein solcher Branch ist der einzige, der direkt vom _master branch_ geforkt wird.  
Sobald die Probleme gefixt sind, wird er sowohl in den _master branch_ als auch in den _develop branch_ gemergt und der _master branch_ wird mit einer aktualisierten Versionsnummer getaggt.

![Gitflow-Workflow-4](./pictures/Gitflow-Workflow-4.png)  

Durch eine solche dedizierte Entwicklungslinie für Bugfixes kann ein Team Probleme des Produktiv-Releases beheben, ohne den Rest des Workflows zu unterbrechen oder auf den nächsten Release-Zyklus warten zu müssen.  
_hotfix branch_ sind sozusagen Ad-hoc-Release-Branches, die direkt mit dem _master branch_ interagieren.

Quelle: 
//Seibert/Media
https://infos.seibert-media.net/display/Productivity/Git-Workflows+-+Der+Gitflow-Workflow