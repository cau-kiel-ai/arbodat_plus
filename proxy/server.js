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

// let cache = null;
// let cacheTime = 0;
// const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// app.get("/arbodat-taxonomy", async (req, res) => {
//     const now = Date.now();

//     // Cache valid
//     if (cache && (now - cacheTime) < CACHE_TTL) {
//         return res.json(cache);
//     }

//     const url = "https://api.dante.gbv.de/export/download/arbodat_taxonomy/ArboDat-Taxonomy/arbodat_taxonomy__ArboDat-Taxonomy.jskos.jsonld";

//     const response = await fetch(url);

//     if (!response.ok) {
//         const text = await response.text();
//         console.error("DANTE error:", text);
//         return res.status(response.status).send({ error: "Failed to fetch Arbodat Taxonomy" });
//     }

//     const data = await response.json();

//     // Refresh cache
//     cache = data;
//     cacheTime = now;

//     res.json(data);
// });

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
