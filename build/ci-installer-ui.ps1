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
$activePort=$null
for($attempt=0;$attempt -lt 90;$attempt++){
 foreach($candidatePort in @(33942,33930)){
  try{$health=Invoke-RestMethod -Uri ('http://127.0.0.1:'+$candidatePort+'/health') -TimeoutSec 1;if($health.clientOnly){$ready=$true;$activePort=$candidatePort;break}}catch{}
 }
 if($ready){break}
 Start-Sleep -Seconds 1
}
if(-not $ready){
 Get-Content 'install-ui.log' | Select-String -Pattern 'LaunchReborn|CustomAction|Return value 3|Error' | Select-Object -Last 18
 $errors=Join-Path $env:LOCALAPPDATA 'CavegameReborn/launcher-errors.log'
 if(Test-Path $errors){Get-Content $errors -Tail 12}
 Get-CimInstance Win32_Process | Where-Object {$_.Name -in @('node.exe','Cavegame Reborn.exe','msiexec.exe')} | Select-Object Name,ProcessId,CommandLine | Format-List
 throw 'Installer Play button did not open the client'
}
Write-Output ('Interactive welcome, Install, completion, and Play action verified on port '+$activePort)
$launcher='http://127.0.0.1:'+$activePort
$page=(Invoke-WebRequest -Uri $launcher -UseBasicParsing).Content
$match=[regex]::Match($page,'window.RebornLauncher=(.*?);</script>','Singleline')
$config=$match.Groups[1].Value | ConvertFrom-Json
Invoke-RestMethod -Uri ($launcher+'/launcher/quit') -Method Post -Headers @{'x-reborn-launcher'=$config.nonce} -ContentType 'application/json' -Body '{}' | Out-Null
Start-Sleep -Seconds 2

