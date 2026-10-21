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
  --exclude "^\.gitignore$" \
  --exclude "^\.env" \
  --exclude "^\.vscode/" \
  --exclude "^\.claude/" \
  --exclude "^\.superpowers/" \
  --exclude "^CLAUDE\.md$" \
  --exclude "^SETUP\.md$" \
  --exclude "^ruvector\.db$" \
  --exclude "^agentdb\.rvf" \
  --exclude "^docs/" \
  --exclude "^node_modules/" \
  --exclude "^worker/" \
  --exclude "^__pycache__/" \
  --exclude "^package\.json$" \
  --exclude "^package-lock\.json$" \
  --exclude "^_generate-social\.js$" \
  --exclude "\.py$" \
  --exclude "\.sh$" \
  --exclude "(^|/)\.DS_Store$" \
  . ${FTP_REMOTE_PATH}
bye
LFTP_EOF

echo "✅ Deploy abgeschlossen."
