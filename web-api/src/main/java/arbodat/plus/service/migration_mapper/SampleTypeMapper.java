package arbodat.plus.service.migration_mapper;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SampleTypeMapper {

    private final Map<String, String> sampleTypeMap;

    public SampleTypeMapper() {
        sampleTypeMap = new HashMap<>();

        // box profile (section sample)
        sampleTypeMap.put("Kast", "http://uri.gbv.de/terminology/arbodat_sample_type/8a82642a-e2fd-4223-b761-18bb44235266");

        // bucket/bag
        sampleTypeMap.put("Eim", "http://uri.gbv.de/terminology/arbodat_sample_type/bf2dc8fc-d6f9-40a7-9ef3-11793d4f8e65");

        // MR taken individually
        sampleTypeMap.put("dir", "http://uri.gbv.de/terminology/arbodat_sample_type/a6c86d3f-5724-4015-af0f-e67551b49c50");

        // core sample
        sampleTypeMap.put("Bohr", "http://uri.gbv.de/terminology/arbodat_sample_type/adc47020-8131-4c1b-b53a-a25697f76ffb");

        // vessel content
        sampleTypeMap.put("Gef", "http://uri.gbv.de/terminology/arbodat_sample_type/30d54e93-c913-4e74-98a6-025799f771f8");

        // ArboDat+_sampleType
        // unknown
        sampleTypeMap.put("-99", "ArboDat+_sampleType_unknown");
        // other
        sampleTypeMap.put("Sonst", "ArboDat+_sampleType_other");
    }

    public String getUri(String key) {
        return sampleTypeMap.get(key);
    }
}
