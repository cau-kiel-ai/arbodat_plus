package arbodat.plus.service.migration_mapper;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ClassificationConferMapper {

    private final Map<String, String> classificationConferMap;

    public ClassificationConferMapper() {
        classificationConferMap = new HashMap<>();

        // species
        classificationConferMap.put("A", "http://uri.gbv.de/terminology/arbodat_classification_confer/7be41f01-c47b-4e2d-9fd0-1ad82815aac7");
        // subspecies
        classificationConferMap.put("S", "http://uri.gbv.de/terminology/arbodat_classification_confer/8b1aaada-1ad4-433f-9143-24cec5ae84ef");
        // genus
        classificationConferMap.put("G", "http://uri.gbv.de/terminology/arbodat_classification_confer/f335e69e-b62e-4e25-9c41-4e293b3ad6d7");
        // family
        classificationConferMap.put("F", "http://uri.gbv.de/terminology/arbodat_classification_confer/20889380-0b12-4de6-b756-d5e7fe7033d7");
        // variety
        classificationConferMap.put("V", "http://uri.gbv.de/terminology/arbodat_classification_confer/9d67a583-2a5c-4c30-8d9e-66c9a129ebed");
        // no confer
        classificationConferMap.put("-", "http://uri.gbv.de/terminology/arbodat_classification_confer/62e2a36f-c4fc-475d-a940-4053a9afe8a1");
    }

    public String getUri(String key) {
        return classificationConferMap.get(key);
    }
}
