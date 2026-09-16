package arbodat.plus.service.migration_mapper;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ChronozoneMapper {

    private final Map<String, String> chronozoneMap;

    public ChronozoneMapper() {
        chronozoneMap = new HashMap<>();

        // Atlantic
        chronozoneMap.put("AT", "http://uri.gbv.de/terminology/arbodat_chronozone/55605b37-0384-40d3-a532-eed08db824eb");

        // Boreal
        chronozoneMap.put("BO", "http://uri.gbv.de/terminology/arbodat_chronozone/6d7c9aa4-403a-4221-9a37-4766e1e81b54");

        // Older Dryas
        chronozoneMap.put("DR2", "http://uri.gbv.de/terminology/arbodat_chronozone/e1d48499-4809-48dc-a8ea-b2e54acfed2e");

        // Oldest Dryas
        chronozoneMap.put("DR1", "http://uri.gbv.de/terminology/arbodat_chronozone/18a2729a-5023-447f-930a-9e9ef29e1422");

        // Preboreal
        chronozoneMap.put("PB", "http://uri.gbv.de/terminology/arbodat_chronozone/a088bb19-8d80-4b66-86e2-0d809b1217d0");

        // Subatlantic
        chronozoneMap.put("SA", "http://uri.gbv.de/terminology/arbodat_chronozone/315aba74-3788-4ba2-afec-096946a6a12e");

        // Subboreal
        chronozoneMap.put("SB", "http://uri.gbv.de/terminology/arbodat_chronozone/05a84dba-21d5-4296-be63-bd3a98bf52b6");

        // Younger Dryas
        chronozoneMap.put("DR3", "http://uri.gbv.de/terminology/arbodat_chronozone/5a8ff62a-27c4-46e6-8a92-041e3b100aa3");

        // Allerød
        chronozoneMap.put("AL", "http://uri.gbv.de/terminology/arbodat_chronozone/49c5fd64-a456-409e-853f-ea9923ce7739");

        // Bølling/Allerød
        chronozoneMap.put("BolAll", "http://uri.gbv.de/terminology/arbodat_chronozone/b9674576-b171-45cc-950c-bd32f66c52b6");

        // Bølling
        chronozoneMap.put("BOL", "http://uri.gbv.de/terminology/arbodat_chronozone/db77b351-ec2b-4d86-a8f2-faf58c309c57");

        // ArboDat+_chronozone
        // unknown
        chronozoneMap.put("Chrono?", "ArboDat+_chronozone_unknown");
        // not chosen
        chronozoneMap.put("n.gew.", "ArboDat+_chronozone_notChosen");
        chronozoneMap.put(null, "ArboDat+_chronozone_notChosen");
        // empty
        chronozoneMap.put("-99", "ArboDat+_chronozone_notChosen");
    }

    public String getUri(String key) {
        return chronozoneMap.get(key);
    }
}
