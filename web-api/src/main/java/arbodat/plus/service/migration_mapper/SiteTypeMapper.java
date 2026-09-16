package arbodat.plus.service.migration_mapper;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SiteTypeMapper {

    private final Map<String, String> siteTypeMap;

    public SiteTypeMapper() {
        siteTypeMap = new HashMap<>();

    // alluvium/flood plain
        // alluvium/flood plain
        siteTypeMap.put("Aue", "http://uri.gbv.de/terminology/arbodat_site_type/23dc788b-d233-4d1e-a0a5-2bcc1a0c974d");

        // oxbow
        siteTypeMap.put("Alt", "http://uri.gbv.de/terminology/arbodat_site_type/d441ac64-f846-4825-852c-c00d1ad79d83");

    // cave/abri
        // cave
        siteTypeMap.put("Hö", "http://uri.gbv.de/terminology/arbodat_site_type/fdc3b527-b62f-4acd-94af-0a336ae9223f");

        // abri
        siteTypeMap.put("Ab", "http://uri.gbv.de/terminology/arbodat_site_type/49768ad0-ad83-4a32-85dc-07f289e3b1ec");

    // charcoal kiln/charburnery
        // charcoal kiln/charburnery
        siteTypeMap.put("Mei", "http://uri.gbv.de/terminology/arbodat_site_type/c3feb228-9f1b-49da-a545-2e5bca627a45");

    // colluvium
        // colluvium
        siteTypeMap.put("Kol", "http://uri.gbv.de/terminology/arbodat_site_type/9043abc1-4c83-4248-985c-375fa9cb3bf4");

    // harbour/landing
        // harbour/landing
        siteTypeMap.put("Haf", "http://uri.gbv.de/terminology/arbodat_site_type/6cda490c-534f-4463-bad7-897f89aaf346");

        // shipwreck
        siteTypeMap.put("Wra", "http://uri.gbv.de/terminology/arbodat_site_type/11446632-d482-4f67-9cb6-f63bf50e0532");

    // lake/pond/basin
        // lake/pond/basin
        siteTypeMap.put("See", "http://uri.gbv.de/terminology/arbodat_site_type/82beafce-753f-4fd5-8396-4e9009c5985a");

        // channel/waterway
        siteTypeMap.put("Rin", "http://uri.gbv.de/terminology/arbodat_site_type/3da8c2a9-242f-490f-87c7-a215f0f36fd7");

    // mine/stack/galleries
        // mine/stack/galleries
        siteTypeMap.put("Be", "http://uri.gbv.de/terminology/arbodat_site_type/6b82d510-4fe3-4747-a76d-ca67c56aa8a7");

    // swamp
        // swamp
        siteTypeMap.put("Moor", "http://uri.gbv.de/terminology/arbodat_site_type/b1407acf-bbc6-4cd9-805e-1e8df88735af");

    // places of cult and religious institutions
        // burial ground
        siteTypeMap.put("Grab", "http://uri.gbv.de/terminology/arbodat_site_type/45a9b70b-e0f6-40db-8838-36fe82f1380a");

        // church/monastery/sanctuary
        siteTypeMap.put("Kirche", "http://uri.gbv.de/terminology/arbodat_site_type/75ba2d29-c8d1-43b1-a434-7a9bc5121485");

    // sea/ocean
        // sea
        siteTypeMap.put("Meer", "http://uri.gbv.de/terminology/arbodat_site_type/c61471c0-ac5f-4ddc-b3a2-0a0a4fd5944e");

    // settlement
        // lakeside dwelling
        siteTypeMap.put("SeeMo", "http://uri.gbv.de/terminology/arbodat_site_type/68e1bc4e-1b60-4981-95cc-00ef1e253e69");

        // wharf
        siteTypeMap.put("Wurt", "http://uri.gbv.de/terminology/arbodat_site_type/93d78a1d-3323-47c4-8597-eb0b3d065ff0");

        // common building
        siteTypeMap.put("GemGeb", "http://uri.gbv.de/terminology/arbodat_site_type/c52d0ef3-5c04-4bbf-af28-afb7fa503c84");

        // open settlement
        siteTypeMap.put("Siedl", "http://uri.gbv.de/terminology/arbodat_site_type/5ea2db14-cebe-4916-9167-8ee2daec5b6f");

        // fortified settlement/enclosure
        siteTypeMap.put("befSied", "http://uri.gbv.de/terminology/arbodat_site_type/f283168d-c5c8-4f8f-a5ba-b1452f40e4fe");

        // fortified hilltop settlement/enclosure
        siteTypeMap.put("befHöhS", "http://uri.gbv.de/terminology/arbodat_site_type/53840c76-4d7c-4284-9644-a46b8f440eb8");

        // unfortified hilltop settlement
        siteTypeMap.put("HöhS", "http://uri.gbv.de/terminology/arbodat_site_type/d588ff86-da4b-448b-8b26-a0f33ffe3376");

        // tell
        siteTypeMap.put("Tell", "http://uri.gbv.de/terminology/arbodat_site_type/91d83860-dedd-4510-a187-8f74c485497f");

        // urban
        siteTypeMap.put("Stadt", "http://uri.gbv.de/terminology/arbodat_site_type/a086d2c2-58c7-4061-859d-faf28927af64");

        // vicus
        siteTypeMap.put("Vicus", "http://uri.gbv.de/terminology/arbodat_site_type/72365ca1-d26d-477f-8cbc-5c065cc0322d");

        // fortress/military camp/military context
        siteTypeMap.put("Kas", "http://uri.gbv.de/terminology/arbodat_site_type/075e2b0e-80bb-4b01-bad7-e95202ab9100");

        // castle/chateau
        siteTypeMap.put("Burg", "http://uri.gbv.de/terminology/arbodat_site_type/d7da8eca-75cb-4dd7-87d3-546f17bfb495");

        // Villa rustica/farmstead
        siteTypeMap.put("Villa", "http://uri.gbv.de/terminology/arbodat_site_type/fb4357b0-57ef-40fc-9b36-9568962ce382");

    // workshop (incl. mill)
        // workshop (incl. mill)
        siteTypeMap.put("Ha", "http://uri.gbv.de/terminology/arbodat_site_type/59cb654d-affd-497e-9317-99e325f7e6f9");

    // ArboDat+_siteType
        // unknown
        siteTypeMap.put("unbek", "ArboDat+_siteType_unknown");
        // not chosen
        siteTypeMap.put("-99", "ArboDat+_siteType_notChosen");
        siteTypeMap.put(null, "ArboDat+_siteType_notChosen");
        // other anthropogenic deposit
        siteTypeMap.put("FustelSo", "ArboDat+_siteType_otherAnthropogenicDeposit");
        // other natural deposit
        siteTypeMap.put("natSo", "ArboDat+_siteType_otherNaturalDeposit");
        // other rural setting
        siteTypeMap.put("LändSo", "ArboDat+_siteType_otherRuralSetting");
        // other settlement
        siteTypeMap.put("SiedSo", "ArboDat+_siteType_otherSettlement");
        // other place of cult
        siteTypeMap.put("KultSo", "ArboDat+_siteType_otherPlaceOfCult");
    }

    public String getUri(String key) {
        return siteTypeMap.get(key);
    }
}
