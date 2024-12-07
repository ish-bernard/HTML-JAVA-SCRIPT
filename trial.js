let wakeLock = null;

// Function to request wake lock
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock is active.');
      wakeLock.addEventListener('release', () => {
        console.log('Wake Lock was released.');
      });
    } else {
      console.error('Wake Lock API is not supported in this browser.');
    }
  } catch (err) {
    console.error(`Failed to acquire wake lock: ${err.message}`);
  }
}

// Function to release wake lock
function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
    console.log('Wake Lock manually released.');
  }
}

// Notify user if they try to put the system to sleep manually
function notifyOnVisibilityChange() {
  if (document.hidden) {
    alert('The application is running and preventing the computer from sleeping. Please keep it active.');
  }
}

// Request wake lock when the page loads
document.addEventListener('DOMContentLoaded', () => {
  requestWakeLock();

  // Monitor the battery status
  if ('getBattery' in navigator) {
    navigator.getBattery().then(function(battery) {
      function updateBatteryInfo() {
        const batteryLevel = (battery.level * 100).toFixed(0) + '%';
        const chargingStatus = battery.charging ? 'Charging' : 'Not Charging';

        document.getElementById('battery-level').textContent = 'Battery Level: ' + batteryLevel;
        document.getElementById('charging-status').textContent = 'Charging Status: ' + chargingStatus;
      }

      updateBatteryInfo();

      battery.addEventListener('levelchange', updateBatteryInfo);
      battery.addEventListener('chargingchange', updateBatteryInfo);
    });
  } else {
    console.error('Battery Status API is not supported in this browser.');
  }

  // Add visibility change listener
  document.addEventListener('visibilitychange', notifyOnVisibilityChange);
});

// Release wake lock when the page is unloaded
window.addEventListener('beforeunload', releaseWakeLock);
