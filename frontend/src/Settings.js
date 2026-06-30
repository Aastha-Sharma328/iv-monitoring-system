import { useEffect, useState } from "react";
import axios from "axios";
import PageLayout from "./components/PageLayout";
import "./Settings.css";

export default function Settings() {
  const [theme, setTheme] = useState(
  localStorage.getItem("theme") || "light");
  const [compactMode, setCompactMode] = useState(
  localStorage.getItem("compactMode") === "true");
  const [systemInfo, setSystemInfo] = useState({});
  const [thresholds, setThresholds] = useState({});
  const [deviceConfig, setDeviceConfig]=useState({});
  
  useEffect(() => {
    loadSystemInfo();

    const interval = setInterval(()=>{
        loadSystemInfo();
    },5000);
    return()=>clearInterval(interval);
    loadThresholds();
    loadDeviceConfig();
}, []);

useEffect(() => {

document.body.classList.remove(
"light-theme",
"dark-theme"
);

document.body.classList.add(
`${theme}-theme`
);

document.body.classList.toggle(
"compact-layout",
compactMode
);

localStorage.setItem(
"theme",
theme
);

localStorage.setItem(
"compactMode",
compactMode
);

}, [theme, compactMode]);

const backupDatabase = async () => {

  try{

    const res = await axios.get(
      "http://localhost:5000/settings/backup",
      "_blank");

  }

  catch(err){

    console.log(err);

  }

};

const exportRecords = async () => {
window.open(
      "http://localhost:5000/settings/export",
      "_blank" 
);
};

const clearCache = () => {
localStorage.clear();
alert("Cache cleared successfully");
window.location.reload();
};

const loadSystemInfo = async () => {
try {
const res = await axios.get("http://localhost:5000/settings/system-info");
setSystemInfo(res.data);
} catch (err) {
console.error(err);
}};

const loadThresholds = async () => {
    try {
        const res = await axios.get(
            "http://localhost:5000/settings/thresholds"
        );

        setThresholds(res.data);
    } catch (err) {
        console.error(err);
    }
};

const loadDeviceConfig = async()=>{

try{

const res =
await axios.get("http://localhost:5000/settings/device-config");
setDeviceConfig(res.data);
}
catch(err){
console.log(err);
}};

const saveThresholds = async () => {
    try {
        await axios.put(
            "http://localhost:5000/settings/thresholds",
            thresholds
        );

        alert("Thresholds updated successfully");
    } catch (err) {
        console.error(err);
    }
};

const saveDeviceConfig = async()=>{
try{await axios.put("http://localhost:5000/settings/device-config", deviceConfig);
alert("Configuration Updated");
}

catch(err){
console.log(err);
}};

  return (

    <PageLayout
      activeItem="Settings"
      onNavigate={(item) => {

        if (item === "Dashboard")
          window.location.hash = "#/dashboard";

        if (item === "Reports")
          window.location.hash = "#/reports";

        if (item === "User Management")
          window.location.hash = "#/users";

        if (item === "Settings")
          window.location.hash = "#/settings";

        if (item === "Logout") {
          localStorage.removeItem("clinician");
          window.location.hash = "#/";
        }

      }}
    >

      <div className="settings-page">

        <div className="settings-header">

          <h1>System Settings</h1>

          <p>
            Configure monitoring system, devices and application preferences.
          </p>

        </div>

        <div className="settings-grid">

          <div className="settings-card">

    <h2>System Information</h2>

    <div className="info-row">
        <span>System Name</span>
        <strong>{systemInfo.systemName}</strong>
    </div>

    <div className="info-row">
        <span>Version</span>
        <strong>{systemInfo.version}</strong>
    </div>

    <div className="info-row">
        <span>Server Status</span>
        <strong className="status-online">
            {systemInfo.serverStatus}
        </strong>
    </div>

    <div className="info-row">
        <span>Database Status</span>
        <strong className="status-online">
            {systemInfo.databaseStatus}
        </strong>
    </div>

    <div className="info-row">
        <span>Connected Devices</span>
        <strong>{systemInfo.connectedDevices}</strong>
    </div>

    <div className="info-row">
        <span>Last Backup</span>
        <strong>{systemInfo.lastBackup}</strong>
    </div>

</div>

          <div className="settings-card">

    <h2>Alert Thresholds</h2>

    <div className="threshold-grid">

        <div>
            <label>Heart Rate Min</label>

            <input
                type="number"
                value={thresholds.heartRateMin || ""}
                onChange={(e)=>
                    setThresholds({
                        ...thresholds,
                        heartRateMin:e.target.value
                    })
                }
            />
        </div>

        <div>
            <label>Heart Rate Max</label>

            <input
                type="number"
                value={thresholds.heartRateMax || ""}
                onChange={(e)=>
                    setThresholds({
                        ...thresholds,
                        heartRateMax:e.target.value
                    })
                }
            />
        </div>

        <div>
            <label>SpO₂ Minimum</label>

            <input
                type="number"
                value={thresholds.spo2Min || ""}
                onChange={(e)=>
                    setThresholds({
                        ...thresholds,
                        spo2Min:e.target.value
                    })
                }
            />
        </div>

        <div>
            <label>Temperature Maximum</label>

            <input
                type="number"
                value={thresholds.temperatureMax || ""}
                onChange={(e)=>
                    setThresholds({
                        ...thresholds,
                        temperatureMax:e.target.value
                    })
                }
            />
        </div>

        <div>
            <label>Minimum IV Fluid</label>

            <input
                type="number"
                value={thresholds.ivMin || ""}
                onChange={(e)=>
                    setThresholds({
                        ...thresholds,
                        ivMin:e.target.value
                    })
                }
            />
        </div>

    </div>

    <button
        className="save-btn"
        onClick={saveThresholds}
    >
        Save Thresholds
    </button>

</div>

          <div className="settings-card">

<h2>Device Configuration</h2>

<div className="settings-form">

<label>

Sampling Interval (sec)

<input
type="number"
value={deviceConfig.samplingInterval || ""}

onChange={(e)=>
    setDeviceConfig({
    ...deviceConfig,
    samplingInterval:e.target.value
})
}
/>

</label>

<label>

Transmission Interval (sec)

<input
type="number"
value={deviceConfig.transmissionInterval || ""}

onChange={(e)=>
    setDeviceConfig({
    ...deviceConfig,
    transmissionInterval:
    e.target.value
    })
}
/>
</label>

<label>

Sensor Status

<input value={deviceConfig.sensorStatus || ""}
disabled/>

</label>

<button className="save-btn"
onClick={saveDeviceConfig}>

Save Configuration

</button>

</div>

</div>

          <div className="settings-card">

<h2>Data Management</h2>

<div className="settings-actions">
<button onClick={backupDatabase}>
Backup Database
</button>

<button onClick={exportRecords}>
Export Records
</button>

<button onClick={clearCache}>
Clear Cache
</button>

</div>
</div>

<div className="settings-card">

<h2>Appearance</h2>
<div className="appearance-section">
<label>
Theme
<select
value={theme}
onChange={(e)=>setTheme(e.target.value)
}>

<option value="light">
Light
</option>
<option value="dark">
Dark
</option>
</select>
</label>

<label className="switch-row">
Compact Layout
<input
type="checkbox"
checked={compactMode}
onChange={(e)=>
setCompactMode(
e.target.checked)
}/>

</label>
</div>
</div>

</div>
</div>

</PageLayout>
);
}