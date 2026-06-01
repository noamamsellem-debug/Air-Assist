# Registre des traitements (RGPD — art. 30)

> Structure type à tenir à jour par le responsable de traitement (Air Assist).
> À faire valider par le DPO / un avocat avant lancement commercial.

| Traitement | Finalité | Base légale | Catégories de données | Personnes concernées | Destinataires | Durée de conservation | Mesures de sécurité |
|------------|----------|-------------|------------------------|----------------------|---------------|------------------------|---------------------|
| Gestion des réclamations EC 261 | Réclamer l'indemnité au nom du passager | Exécution du mandat (contrat) | Identité, coordonnées, données de vol, PNR | Passagers clients | Compagnies aériennes, PSP | Durée du dossier + archivage légal | Chiffrement au repos, accès par rôle, journalisation |
| Mandat & consentement | Preuve légale du mandat | Obligation légale / contrat | Signature électronique, horodatage, version CGV | Passagers clients | — (interne), prestataire e-signature | Durée légale de prescription | Preuve immuable, accès restreint |
| Documents justificatifs | Étayer la réclamation | Exécution du mandat | Cartes d'embarquement, justificatifs | Passagers clients | Compagnies (transmission ciblée) | Durée du dossier | Chiffrement AES-256-GCM au repos |
| Reversement (PSP) | Verser la part client (70 %) | Exécution du contrat | Token PSP (PAS d'IBAN), statut KYC | Passagers clients | PSP agréé | Durée légale comptable | Token uniquement, aucune donnée bancaire stockée |
| Comptes CRM | Authentifier les agents | Intérêt légitime | E-mail, rôle, hash de mot de passe | Salariés/agents | — | Durée d'emploi | Hash bcrypt, RBAC, journalisation des accès |
| Audience site (si activée) | Mesure d'audience | Consentement | Cookies de mesure | Visiteurs | Sous-traitant analytics UE | 13 mois max | Anonymisation/IP tronquée |

## Droits des personnes
Accès, rectification, effacement, limitation, portabilité, opposition, retrait du consentement —
point de contact : `contact@air-assist.example`. Réclamation possible auprès de la CNIL.

## Sous-traitants (à compléter)
- Hébergeur (UE)
- Prestataire e-signature (eIDAS)
- PSP / KYC
- Fournisseur de données de vol
- E-mail transactionnel

Chaque sous-traitant doit faire l'objet d'un accord de sous-traitance (art. 28) et héberger
les données dans l'UE (ou garanties équivalentes).
