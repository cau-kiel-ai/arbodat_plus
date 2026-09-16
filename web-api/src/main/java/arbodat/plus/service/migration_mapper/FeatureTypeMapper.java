package arbodat.plus.service.migration_mapper;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class FeatureTypeMapper {

    private final Map<String, String> featureTypeMap;

    public FeatureTypeMapper() {
        featureTypeMap = new HashMap<>();

        // "natural" sediment
        featureTypeMap.put("natAbla", "http://uri.gbv.de/terminology/arbodat_feature_type/24172a34-3c34-4e86-8115-67e5fade723d");

        // attic
        featureTypeMap.put("DaBo", "http://uri.gbv.de/terminology/arbodat_feature_type/a9ddcb96-d289-4c51-b28f-e99e9b8b1192");

        // bank/dam/mound
        featureTypeMap.put("Schütt", "http://uri.gbv.de/terminology/arbodat_feature_type/84c5646e-31cc-4110-b5bd-affdc9974b46");

        // boat/water craft
        featureTypeMap.put("Wass", "http://uri.gbv.de/terminology/arbodat_feature_type/aa0841fc-242c-44b8-aea9-1480783cac03");

        // burning horizon
        featureTypeMap.put("Bra", "http://uri.gbv.de/terminology/arbodat_feature_type/7e2dc6b4-dd20-4886-9280-a31f014c401b");

        // cellar
        featureTypeMap.put("Ke", "http://uri.gbv.de/terminology/arbodat_feature_type/bc0fb058-58bf-4441-b3e0-2de11983c99a");

        // cesspit/latrine
        featureTypeMap.put("Klo", "http://uri.gbv.de/terminology/arbodat_feature_type/1d5be56d-806e-4ee0-bd3d-d5e56ec32c36");

        // cistern
        featureTypeMap.put("Zis", "http://uri.gbv.de/terminology/arbodat_feature_type/9d0fd1f7-9f72-4e78-a749-df45ea1ab4cf");

        // clay coat
        featureTypeMap.put("Klei", "http://uri.gbv.de/terminology/arbodat_feature_type/34b30653-e0df-4936-b5e4-ab260a637ecf");

        // core
        featureTypeMap.put("Bohr", "http://uri.gbv.de/terminology/arbodat_feature_type/bb6a19a6-ffdd-4899-8198-02d83ba53f7e");

        // cremation
        featureTypeMap.put("BrGrab", "http://uri.gbv.de/terminology/arbodat_feature_type/2eb55db2-e5dd-4b21-928c-e9b126973743");

        // culture layer
        featureTypeMap.put("Kult", "http://uri.gbv.de/terminology/arbodat_feature_type/83b7513e-f2f6-4277-826c-f8f2f04f0e06");

        // colluvium
        featureTypeMap.put("Koll", "http://uri.gbv.de/terminology/arbodat_feature_type/f55f3c08-d07c-41bc-915a-f5df34f962d1");

        // dead floor
        featureTypeMap.put("Fehl", "http://uri.gbv.de/terminology/arbodat_feature_type/33c61f2d-4108-43cc-8a2e-e3bce7e6364f");

        // deposition of dump/midden
        featureTypeMap.put("Abf", "http://uri.gbv.de/terminology/arbodat_feature_type/4ec3c3f0-2fbc-48d6-b128-0ab9389a2557");

        // ditch
        featureTypeMap.put("Gra", "http://uri.gbv.de/terminology/arbodat_feature_type/c219342d-1693-4c49-a5a9-caeef574f98a");

        // ditch system (larger enclosure)
        featureTypeMap.put("GraWe", "http://uri.gbv.de/terminology/arbodat_feature_type/33f7bd91-58ea-41ad-b3a5-959cc4514460");

        // ground floor of a building
        featureTypeMap.put("Bod", "http://uri.gbv.de/terminology/arbodat_feature_type/2a9b28b0-bf0c-4f91-991b-d205c1d1c5eb");

        // hearth/fireplace
        featureTypeMap.put("Her", "http://uri.gbv.de/terminology/arbodat_feature_type/d5227957-7309-465c-b5b2-1c193aec3d52");

        // inhumation
        featureTypeMap.put("KöGrab", "http://uri.gbv.de/terminology/arbodat_feature_type/89def8d5-24fe-48bb-a221-116b40c47195");

        // kiln
        featureTypeMap.put("Dar", "http://uri.gbv.de/terminology/arbodat_feature_type/32a541fc-2a45-42d0-8465-db2f25679c7d");

        // lake marl
        featureTypeMap.put("Seek", "http://uri.gbv.de/terminology/arbodat_feature_type/ce017c75-6706-4d77-9ae7-ee194b6f7f1c");

        // layer (generally) - outside features
        featureTypeMap.put("Schi", "http://uri.gbv.de/terminology/arbodat_feature_type/e2955668-55f3-450a-8504-913ab5f5ff7d");

        // occupation layer (including former surface)
        featureTypeMap.put("KultLauf", "http://uri.gbv.de/terminology/arbodat_feature_type/db8d9fce-e731-4320-a1a2-d9ff4e5f4018");

        // oven
        featureTypeMap.put("Of", "http://uri.gbv.de/terminology/arbodat_feature_type/ffaba2f1-1028-4caf-9679-0b04de11eb3a");

        // paleosol
        featureTypeMap.put("PalBod", "http://uri.gbv.de/terminology/arbodat_feature_type/5578a2f2-54d8-4ed7-a9ae-74ac5382d012");

        // peat
        featureTypeMap.put("Torf", "http://uri.gbv.de/terminology/arbodat_feature_type/7e22a02d-8cf0-4a0c-b305-1a859e9c9944");

        // pit
        featureTypeMap.put("Gr", "http://uri.gbv.de/terminology/arbodat_feature_type/b9692714-4263-4e9e-b1e7-4b6c2d6670c3");

        // pit complex
        featureTypeMap.put("GrKo", "http://uri.gbv.de/terminology/arbodat_feature_type/7338db79-48c5-4b89-a6c2-1e1a0b28a01b");

        // pit in pit complex
        featureTypeMap.put("GrIn", "http://uri.gbv.de/terminology/arbodat_feature_type/b15acb36-cbdd-49af-9307-c63f54918868");

        // pit kiln
        featureTypeMap.put("Grm", "http://uri.gbv.de/terminology/arbodat_feature_type/ae8fc29b-72ab-473e-b9b2-9d2e314dfc3c");

        // kiln
        featureTypeMap.put("Plm", "http://uri.gbv.de/terminology/arbodat_feature_type/32a541fc-2a45-42d0-8465-db2f25679c7d");

        // post-hole
        featureTypeMap.put("Pfo", "http://uri.gbv.de/terminology/arbodat_feature_type/36f1aac7-df4c-4ba0-90f9-32eea18c60b7");

        // profile section
        featureTypeMap.put("Prof", "http://uri.gbv.de/terminology/arbodat_feature_type/01854c36-14be-4972-8af7-2407e3aa48ad");

        // rampart/earthwork/fortification
        featureTypeMap.put("Wal", "http://uri.gbv.de/terminology/arbodat_feature_type/2a7f468e-075d-46a1-bc45-dc994ff141c8");

        // recipient
        featureTypeMap.put("Beh", "http://uri.gbv.de/terminology/arbodat_feature_type/fe249041-10a5-4837-a621-183c4a893bfc");

        // road drain/gutter
        featureTypeMap.put("StrGra", "http://uri.gbv.de/terminology/arbodat_feature_type/3e14362e-fc3b-4c3e-8d22-d7ceb9a5c5ff");

        // roadway/trackway
        featureTypeMap.put("Str", "http://uri.gbv.de/terminology/arbodat_feature_type/b8fcdecd-1415-4ba1-81e7-e12fbab43cdb");

        // sandy sediment
        featureTypeMap.put("Sand", "http://uri.gbv.de/terminology/arbodat_feature_type/95e45a02-55bf-4526-97bb-46678330a514");

        // shaft
        featureTypeMap.put("Scha", "http://uri.gbv.de/terminology/arbodat_feature_type/8c6583bb-7d9e-469a-b28a-91fc11faf863");

        // silo/storage pit
        featureTypeMap.put("Silo", "http://uri.gbv.de/terminology/arbodat_feature_type/351b0483-4e43-496a-80a5-fca4dd95338d");

        // silt coat
        featureTypeMap.put("Lehm", "http://uri.gbv.de/terminology/arbodat_feature_type/1c5da17a-28b1-4886-9c66-d71d33932120");

        // sunken hut
        featureTypeMap.put("GrHa", "http://uri.gbv.de/terminology/arbodat_feature_type/1ebb8788-5e03-4962-ad45-4dd9e76db65b");

        // pit alongside house (LBK)
        featureTypeMap.put("Lgr", "http://uri.gbv.de/terminology/arbodat_feature_type/88f01190-8546-421e-8b38-8eb940178fb5");

        // V-shaped pit (Neolithic)
        featureTypeMap.put("SchlGr", "http://uri.gbv.de/terminology/arbodat_feature_type/52f35754-bbbb-48ca-a858-0deac19d1930");

        // wall construction
        featureTypeMap.put("Wand", "http://uri.gbv.de/terminology/arbodat_feature_type/cb65735a-49b8-4db8-95dc-2b940ee622da");

        // wall ditch (belonging to a building)
        featureTypeMap.put("Wa", "http://uri.gbv.de/terminology/arbodat_feature_type/0d993884-c1f4-43d7-87a6-750ea4ff1e34");

        // water basin
        featureTypeMap.put("Bass", "http://uri.gbv.de/terminology/arbodat_feature_type/fa5cbcdb-b8d8-4651-adda-bdcda2018ece");

        // water pipe/aqueduct
        featureTypeMap.put("Aqu", "http://uri.gbv.de/terminology/arbodat_feature_type/ef0d22bf-8de6-48d5-a691-6bd194bcce32");

        // well
        featureTypeMap.put("Bru", "http://uri.gbv.de/terminology/arbodat_feature_type/b85a6c36-61f2-4f47-99fc-88c9e11160ab");

        // yard/place
        featureTypeMap.put("Platz", "http://uri.gbv.de/terminology/arbodat_feature_type/3777beff-003a-4197-8fa4-1e3ec77bd0ae");

        // ArboDat+_featureType
        // others
        featureTypeMap.put("BefuTyp?", "ArboDat+_featureType_unknown");
        // not chosen
        featureTypeMap.put("-99", "ArboDat+_featureType_notChosen");
        featureTypeMap.put(null, "ArboDat+_featureType_notChosen");
        // other ritual feature
        featureTypeMap.put("SoRit", "ArboDat+_featureType_otherRitualFeature");
        // other type of feature
        featureTypeMap.put("SoBefu", "ArboDat+_featureType_otherTypeOfFeature");
    }

    public String getUri(String key) {
        return featureTypeMap.get(key);
    }
}
