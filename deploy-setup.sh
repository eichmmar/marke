#!/bin/bash
# Einmaliges Deployment-Setup: lokales Git → cyon SSH
# Ausführen mit: bash deploy-setup.sh
set -e

echo ""
echo "═══════════════════════════════════════════════════"
echo "  Markenportal → cyon Deployment Setup"
echo "═══════════════════════════════════════════════════"
echo ""

read -p "  SSH Hostname (z.B. gc1.cyon.ch): " SSH_HOST
read -p "  SSH Benutzername:                 " SSH_USER
read -e -i "~/www/marke.vka-albis.ch" -p "  Web-Verzeichnis auf cyon:        " WEB_ROOT
REPO_PATH="~/repos/marke.git"

echo ""
echo "  → Verbinde mit $SSH_USER@$SSH_HOST"
echo "  → Bare-Repo: $REPO_PATH"
echo "  → Web-Root:  $WEB_ROOT"
echo ""

# Bare-Repo + post-receive Hook auf cyon erstellen
ssh "$SSH_USER@$SSH_HOST" \
  "mkdir -p $REPO_PATH && git init --bare $REPO_PATH && \
   mkdir -p $WEB_ROOT && \
   printf '#!/bin/bash\nGIT_WORK_TREE=$WEB_ROOT git checkout -f main\necho \"✓ Deployed\"\n' \
     > $REPO_PATH/hooks/post-receive && \
   chmod +x $REPO_PATH/hooks/post-receive && \
   echo '✓ Bare-Repo und Hook erstellt.'"

# Remote lokal registrieren
if git remote get-url cyon >/dev/null 2>&1; then
  git remote set-url cyon "$SSH_USER@$SSH_HOST:$REPO_PATH"
else
  git remote add cyon "$SSH_USER@$SSH_HOST:$REPO_PATH"
fi
echo "  ✓ Remote 'cyon' registriert."

# Erster Push
echo ""
echo "  → Pushe auf cyon..."
git push cyon main

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✓ Fertig! marke.vka-albis.ch sollte live sein."
echo ""
echo "  Zukünftige Updates:"
echo "    git add . && git commit -m 'Update' && git push cyon main"
echo "═══════════════════════════════════════════════════"
