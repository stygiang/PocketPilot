# Add Windows Firewall rule to allow Next.js dev server on port 3000
# Run this script as Administrator

Write-Host "Adding Windows Firewall rule for Next.js Dev Server (port 3000)..." -ForegroundColor Cyan

try {
    New-NetFirewallRule -DisplayName "Next.js Dev Server" `
        -Direction Inbound `
        -Action Allow `
        -Protocol TCP `
        -LocalPort 3000 `
        -Profile Private,Domain `
        -ErrorAction Stop

    Write-Host "✓ Firewall rule added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Port 3000 is now accessible from your local network." -ForegroundColor Green
    Write-Host "You can now test demo mode on your mobile device." -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "✓ Firewall rule already exists!" -ForegroundColor Yellow
    } else {
        Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please run this script as Administrator:" -ForegroundColor Yellow
        Write-Host "Right-click PowerShell → Run as Administrator" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
