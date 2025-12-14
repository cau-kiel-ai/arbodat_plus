package arbodat.plus.service.migration_mapper;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StateOfPreservationMapper {

    private final Map<String, String> stateOfPreservationMap;

    public StateOfPreservationMapper() {
        stateOfPreservationMap = new HashMap<>();

        // charred
        stateOfPreservationMap.put("vk", "http://uri.gbv.de/terminology/arbodat_result_condition/172d941e-9c0b-495e-afa3-b7f39299de17");
        // waterlogged
        stateOfPreservationMap.put("sf", "http://uri.gbv.de/terminology/arbodat_result_condition/a0b98017-a58e-4c26-af1d-a9f1fd6e5881");
        // mineralised
        stateOfPreservationMap.put("mi", "http://uri.gbv.de/terminology/arbodat_result_condition/cfc997fb-405f-4c39-9f79-aa633e8acdec");
        // dessicated
        stateOfPreservationMap.put("st", "http://uri.gbv.de/terminology/arbodat_result_condition/7b291166-cc26-4f02-b6b6-88a031d36f52");
        // charred and mineralised
        stateOfPreservationMap.put("vm", "http://uri.gbv.de/terminology/arbodat_result_condition/8b26a0cd-8695-4d5b-938c-07952cd0478e");
        // kiln-dried/partly charred
        stateOfPreservationMap.put("ag", "http://uri.gbv.de/terminology/arbodat_result_condition/aa3c2cab-9b6f-4ec1-be98-61ac6fee1613");
        // calcinated
        stateOfPreservationMap.put("ca", "http://uri.gbv.de/terminology/arbodat_result_condition/73299633-5296-46d6-9929-2719946da9ae");
        // imprint
        stateOfPreservationMap.put("Ab", "http://uri.gbv.de/terminology/arbodat_result_condition/dc371072-4d3a-42d5-b67d-8ee6b1c2a42e");

    // ArboDat+_restType
        // others
        stateOfPreservationMap.put("so", "ArboDat+_stateOfPreservation_unknown");
        // not chosen
        stateOfPreservationMap.put("-99", "ArboDat+_stateOfPreservation_notChosen");
    }

    public String getUri(String key) {
        return stateOfPreservationMap.get(key);
    }
}
