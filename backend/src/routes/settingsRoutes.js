const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/system-info",
async(req,res)=>{
try{
const patients=await pool.query(`SELECT COUNT(*) FROM patients`);
const users=await pool.query(`SELECT COUNT(*) FROM users`);

const vitals=await pool.query(`SELECT COUNT(*) FROM vitals`);
const devices = await pool.query(`SELECT COUNT(*) FROM devices WHERE last_seen > NOW() - INTERVAL '5 seconds'`);
const backup = await pool.query(`SELECT last_backup FROM settings LIMIT 1`);

res.json({
systemName:"IAF Vital Monitoring System",
version:"1.0.0",
serverStatus:"Online",
databaseStatus:"Connected",
connectedDevices:
devices.rows[0].count,
lastBackup:
backup.rows[0]?.last_backup || "Never",
patients: patients.rows[0].count,
users: users.rows[0].count,
records: vitals.rows[0].count
});
}
catch(err){
res.status(500).send(err.message);
}
});

router.get("/thresholds", async(req,res)=>{
try{
const result=await pool.query(
`SELECT * FROM settings LIMIT 1`
);

const row=result.rows[0];
res.json({
heartRateMin:row.heart_rate_min,
heartRateMax:row.heart_rate_max,
spo2Min:row.spo2_min,
temperatureMax:row.temperature_max,
ivMin:row.iv_min
});
}
catch(err){
res.status(500).send(err.message);
}
});
router.put("/thresholds",async(req,res)=>{
try{
const{heartRateMin, heartRateMax, spo2Min, temperatureMax, ivMin}=req.body;

await pool.query(`UPDATE settings SET heart_rate_min=$1, heart_rate_max=$2, spo2_min=$3, temperature_max=$4, iv_min=$5 WHERE id=1`,
[heartRateMin, heartRateMax, spo2Min, temperatureMax, ivMin]);
res.json({
message:"Thresholds updated"});
}
catch(err){
res.status(500).send(err.message);
}});

router.get("/device-config",async(req,res)=>{
try{
const result = await pool.query(`SELECT * FROM settings LIMIT 1`);

const row=result.rows[0];

const sensor = await pool.query(`

SELECT CASE WHEN EXISTS (SELECT 1 FROM devices WHERE last_seen > NOW() - INTERVAL '5 seconds')
THEN 'Active'
ELSE 'Offline'
END AS status`);

res.json({
samplingInterval: row.sampling_interval,
transmissionInterval: row.transmission_interval,
sensorStatus: sensor.rows[0].status,
theme:row.theme,
compactMode:row.compact_mode
});
}

catch(err){
res.status(500).send(err.message);
}
});

router.put("/device-config", async(req,res)=>{
try{
const{samplingInterval, transmissionInterval, sensorStatus, theme, compactMode
}=req.body;

await pool.query(`UPDATE settings SET sampling_interval=$1, transmission_interval=$2, sensor_status=$3,
theme=$4, compact_mode=$5 WHERE id=1`,
[samplingInterval, transmissionInterval, sensorStatus, theme, compactMode]
);

res.json({

message:"Configuration saved",

data:{
samplingInterval,
transmissionInterval,
sensorStatus,
theme,
compactMode
}

});
}

catch(err){
res.status(500).send(err.message);
}
});

router.get("/backup", async(req,res)=>{
try{
const patients=await pool.query("SELECT * FROM patients");
const vitals=await pool.query("SELECT * FROM vitals");
const alerts=await pool.query("SELECT * FROM alerts");
const users=await pool.query("SELECT * FROM users");
const backup={patients:patients.rows, vitals:vitals.rows, alerts:alerts.rows, users:users.rows, timestamp:new Date()
};

res.setHeader("Content-Type", "application/json");
res.setHeader("Content-Disposition", "attachment; filename=backup.json");
await pool.query(`UPDATE settings SET last_backup = NOW() WHERE id=1`)
res.send(JSON.stringify(backup, null, 2));
}

catch(err){
res.status(500).send(err.message);
}
});

router.get("/export", async(req,res)=>{
try{
const result = await pool.query(`SELECT * FROM vitals ORDER BY recorded_at DESC`);

let csv = "patient_id,heart_rate,spo2,temperature,weight,recorded_at\n";
result.rows.forEach(row=>{
csv += `${row.patient_id}, ${row.heart_rate}, ${row.spo2}, ${row.temperature}, ${row.weight}, ${row.recorded_at}\n`;
});
res.setHeader("Content-Type", "text/csv");
res.setHeader("Content-Disposition", "attachment; filename=vitals_export.csv");
res.send(csv);
}

catch(err){
res.status(500).send(err.message);
}});

module.exports = router;