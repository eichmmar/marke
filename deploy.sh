#!/usr/bin/env bash
set -euo pipefail

if [ ! -f ".env" ]; then
  echo "❌ .env nicht gefunden — bitte .env.example kopieren und ausfüllen."
  exit 1
fi
source .env

echo "🚀 Deploy nach ${FTP_PROTOCOL}://${FTP_HOST}${FTP_REMOTE_PATH} ..."

lftp -u "${FTP_USER}","${FTP_PASS}" "${FTP_PROTOCOL}://${FTP_HOST}" << LFTP_EOF
set ssl:verify-certificate no
mirror --reverse --delete --verbose \
  --exclude "^Ressourcen/" \
  --exclude "^\.git/" \
  --exclude "^\.env" \
  --exclude "^\.vscode/" \
  --exclude "^\.claude/" \
  --exclude "^\.superpowers/" \
  --exclude "^CLAUDE\.md$" \
  --exclude "^SETUP\.md$" \
  --exclude "^ruvector\.db$" \
  --exclude "^docs/" \
  --exclude "\.sh$" \
  . ${FTP_REMOTE_PATH}
bye
LFTP_EOF

echo "✅ Deploy abgeschlossen."
