@echo off
title AGENCIAR
color 0b
echo =======================================================
echo           STARTUP DO ECOSSISTEMA AGENCIAR V2           
echo =======================================================
echo.
echo    TUDO ONLINE! ACESSE SEU PAINEL GESTOR PRINCIPAL:  
echo ➔  http://localhost:4002/portal.html
echo.
echo =======================================================
echo (Links Diretos Alternativos)
echo SITE AGENCIAR:   http://localhost:3007
echo EXTRATOR GMAPS:  http://localhost:4004/admin?tab=gmaps
echo WHATSAPP BOT:    http://localhost:4002
echo CRM WEB:         http://localhost:4003
echo =======================================================
echo.
echo === Pressione CTRL+C DUAS VEZES neste terminal para desligar tudo simultaneamente ===
echo.
concurrently -k -n "AGENCIAR,CRM-WEB,RAIOX-SITE,EXTRATOR-GMAPS" -c "bgBlue.bold,bgGreen.bold,bgMagenta.bold,bgYellow.bold" "cd /d %~dp0whatsapp-web.js-main && node meu-bot.js" "cd /d %~dp0crm && npm run dev" "cd /d %~dp0agenciar-site-main && npm run dev" "cd /d %~dp0agenciar-site-main && npx vite --port 4004"
pause

