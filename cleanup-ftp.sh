#!/usr/bin/env bash
#
# Einmalige Bereinigung des Webservers.
#
# Frühere Deploys haben Dateien hochgeladen, die dort nicht hingehören (Worker,
# node_modules, Build-Tools). Die erweiterte Ausschlussliste in deploy.sh
# verhindert das künftig — sie entfernt die Altlasten aber nicht, weil lftp
# ausgeschlossene Pfade komplett ignoriert. Dieses Skript räumt sie einmalig weg.
#
# Danach kann die Datei gelöscht werden.

set -euo pipefail

if [ ! -f ".env" ]; then
  echo "❌ .env nicht gefunden."
  exit 1
fi
source .env

# Was weg soll. index.html, assets/ und downloads/ stehen bewusst NICHT hier.
DIRS=(worker node_modules __pycache__)
FILES=(
  crop-svg.py
  make-abteilungslogo.py
  _generate-social.js
  package.json
  package-lock.json
  agentdb.rvf
  agentdb.rvf.lock
  .gitignore
  .DS_Store
  assets/.DS_Store
  downloads/.DS_Store
)

cat <<INFO
Server:  ${FTP_PROTOCOL}://${FTP_HOST}${FTP_REMOTE_PATH:-/}

Rekursiv gelöscht werden die Verzeichnisse:
  ${DIRS[*]}

Sowie die Einzeldateien:
  ${FILES[*]}

Erhalten bleiben: index.html, assets/, downloads/

Das ist nicht umkehrbar.
INFO

read -r -p "Wirklich löschen? Tippe 'ja': " answer
[ "$answer" = "ja" ] || { echo "Abgebrochen."; exit 0; }

{
  echo "set ssl:verify-certificate no"
  echo "set net:timeout 20"
  echo "set net:max-retries 2"
  echo "set cmd:fail-exit no"
  for d in "${DIRS[@]}";  do echo "rm -rf $d"; done
  for f in "${FILES[@]}"; do echo "rm -f $f";  done
  echo "bye"
} | lftp -u "${FTP_USER}","${FTP_PASS}" "${FTP_PROTOCOL}://${FTP_HOST}"

echo
echo "✅ Bereinigung abgeschlossen."
