const express = require("express");
const si = require("systeminformation");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/system", async (req, res) => {
  const cpu = await si.currentLoad();
  const mem = await si.mem();
  const processes = await si.processes();

  let suggestion = "System is stable";

  if (cpu.currentLoad > 80) {
    suggestion = "High CPU usage! Close heavy apps";
  }

  if ((mem.used / mem.total) * 100 > 80) {
    suggestion = "RAM usage high! Consider closing apps";
  }

  res.json({
    cpu: cpu.currentLoad,
    ram: (mem.used / mem.total) * 100,
    processes: processes.list.slice(0, 5),
    suggestion
  });
});

app.listen(5000, () => console.log("Server running"));