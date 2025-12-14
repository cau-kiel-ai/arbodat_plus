import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());

app.get("/nominatim-reverse", async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: "latitude and longitude required" });

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    
    const response = await fetch(url, {
        headers: { "User-Agent": "arbodat-plus (mail@arbodat.info)" }
    })

    if (!response.ok) {
        const text = await response.text();
        console.error("Nominatim error:", text);
        return res.status(response.status).send({ error: "Failed to fetch from Nominatim" });
    }

    const data = await response.json();
    res.json(data);
});

app.listen(PORT, () => console.log(`Node proxy running on port ${PORT}`));
