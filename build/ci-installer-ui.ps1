$ErrorActionPreference='Stop'
Add-Type -AssemblyName UIAutomationClient
Add-Type -AssemblyName UIAutomationTypes
$env:CAVEGAME_CLIENT_PORT='33942'
$env:CAVEGAME_GAME_PORT='33944'
$installer=(Resolve-Path 'installer/CavegameRebornSetup.msi').Path
$installProcess=Start-Process msiexec.exe -ArgumentList @('/i',"`"$installer`"",'/qf','/norestart','/L*v','install-ui.log') -PassThru -WindowStyle Hidden
function Find-SetupWindow([string]$title){
 for($attempt=0;$attempt -lt 120;$attempt++){
  $condition=New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::NameProperty,$title)
  $window=[System.Windows.Automation.AutomationElement]::RootElement.FindFirst([System.Windows.Automation.TreeScope]::Children,$condition)
  if($null -ne $window){return $window}
  Start-Sleep -Milliseconds 250
 }
 throw ('Installer dialog did not appear: '+$title)
}
function Click-SetupButton($window,[string]$label){
 $condition=New-Object System.Windows.Automation.PropertyCondition([System.Windows.Automation.AutomationElement]::NameProperty,$label)
 $button=$window.FindFirst([System.Windows.Automation.TreeScope]::Descendants,$condition)
 if($null -eq $button){throw ('Missing installer button: '+$label)}
 $invoke=$button.GetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern)
 $invoke.Invoke()
}
$welcome=Find-SetupWindow 'Cavegame Reborn Setup'
Click-SetupButton $welcome 'Install'
$complete=Find-SetupWindow 'Cavegame Reborn — Installed'
Click-SetupButton $complete 'Play Cavegame Reborn'
$installProcess.WaitForExit()
if($installProcess.ExitCode -ne 0){throw ('Interactive installer failed: '+$installProcess.ExitCode)}
$ready=$false
for($attempt=0;$attempt -lt 90;$attempt++){
 try{$health=Invoke-RestMethod -Uri 'http://127.0.0.1:33942/health';if($health.clientOnly){$ready=$true;break}}catch{}
 Start-Sleep -Seconds 1
}
if(-not $ready){throw 'Installer Play button did not open the client'}
Write-Output 'Interactive welcome, Install, completion, and Play action verified.'
