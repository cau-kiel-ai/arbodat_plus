package arbodat.plus.service.migration_mapper;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DatingMethodMapper {

    private final Map<String, String> datingMethodMap;

    public DatingMethodMapper() {
        datingMethodMap = new HashMap<>();

        // Dendrochronology
        datingMethodMap.put("Dendrochronologie", "http://uri.gbv.de/terminology/arbodat_dating_method/14e0e278-5c71-4d42-9dea-2312e9ed4639");

        // Electronspin Resonance
        datingMethodMap.put("Elektronenspinresonanz", "http://uri.gbv.de/terminology/arbodat_dating_method/9c5f06fb-12d0-4be8-bef3-9d2509674320");

        // Magnetic Dating
        datingMethodMap.put("Magnetische Datierung", "http://uri.gbv.de/terminology/arbodat_dating_method/a8522a6e-188d-4a30-aa1a-d669f6d00ed7");

        // Potassium-Argon-Dating
        datingMethodMap.put("Kalium-Argon-Datierung", "http://uri.gbv.de/terminology/arbodat_dating_method/083d0db6-665c-4ba9-88b6-668511c9938b");

        // Radiocarbon Dating
        datingMethodMap.put("C14-Datierung", "http://uri.gbv.de/terminology/arbodat_dating_method/7a517e8f-21c0-4ad5-a9b0-3b6f32004512");

        // Thermoluminescense
        datingMethodMap.put("Thermolumineszens", "http://uri.gbv.de/terminology/arbodat_dating_method/1fc89104-5697-41d7-ac99-c99895de286f");

        // Uranium-Series-Dating
        datingMethodMap.put("Uran-Serien-Datierung", "http://uri.gbv.de/terminology/arbodat_dating_method/5cc88f0f-eb11-4f9d-9822-f6a11ff4a42e");

        // Uranium-Thorium-Dating
        datingMethodMap.put("Uran-Thorium-Datierung", "http://uri.gbv.de/terminology/arbodat_dating_method/7cfdce70-8d8e-4920-b9f9-84e092f7b08e");

        // ArboDat+_datingMethod
        // unknown
        datingMethodMap.put("-99", "ArboDat+_datingMethod_unknown");
        // other
        datingMethodMap.put("sonstige", "ArboDat+_datingMethod_other");
    }

    public String getUri(String key) {
        return datingMethodMap.get(key);
    }
}
