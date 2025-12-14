package arbodat.plus.service.migration_mapper;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PreservationConditionMapper {

    private final Map<String, String> preservationConditionMap;

    public PreservationConditionMapper() {
        preservationConditionMap = new HashMap<>();

        // good
        preservationConditionMap.put("good", "http://uri.gbv.de/terminology/arbodat_preservation_condition/98f61fee-5f35-4e80-aa71-19e8cb7c52b9");
        // medium
        preservationConditionMap.put("medium", "http://uri.gbv.de/terminology/arbodat_preservation_condition/08f5e76d-6330-41d6-b995-d9a070c40155");
        // bad
        preservationConditionMap.put("bad", "http://uri.gbv.de/terminology/arbodat_preservation_condition/06fed320-58b7-4c21-aa5d-ddf5e6cd5eb9");
    }

    public String getUri(String key) {
        return preservationConditionMap.get(key);
    }
}
