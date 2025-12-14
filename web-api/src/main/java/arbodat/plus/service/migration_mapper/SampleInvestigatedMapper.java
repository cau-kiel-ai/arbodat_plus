package arbodat.plus.service.migration_mapper;

import org.hibernate.annotations.SecondaryRow;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SampleInvestigatedMapper {

    private final Map<String, String> sampleInvestigatedMap;

    public SampleInvestigatedMapper() {
        sampleInvestigatedMap = new HashMap<>();

        // not examined
        sampleInvestigatedMap.put("nu", "http://uri.gbv.de/terminology/arbodat_sample_investigated/0a9c17bb-ac36-4c8a-bc14-01916c0e0dc1");

        // examined, without results
        sampleInvestigatedMap.put("ob", "http://uri.gbv.de/terminology/arbodat_sample_investigated/4e969c7f-347a-436a-bb29-381d8fe61556");

        // examined, results available
        sampleInvestigatedMap.put("u", "http://uri.gbv.de/terminology/arbodat_sample_investigated/a7c129c1-bd61-4709-9672-e4e5dc8ba421");

        // ArboDat+_sampleInvestigate
        // unknown
        sampleInvestigatedMap.put("nb", "ArboDat+_sampleInvestigated_unknown");
    }

    public String getUri(String key) {
        return sampleInvestigatedMap.get(key);
    }
}
