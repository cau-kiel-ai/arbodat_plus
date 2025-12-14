package arbodat.plus.service.migration_mapper;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RestTypeMapper {

    private final Map<String, String> restTypeMap;

    public RestTypeMapper() {
        restTypeMap = new HashMap<>();

    // Seeds/Fruits etc.
        // glume base
        restTypeMap.put("HSB", "http://uri.gbv.de/terminology/arbodat_rest_type/6090ff3b-8a66-4e03-978d-c029fdd48254");
        // lemma base
        restTypeMap.put("DSB", "http://uri.gbv.de/terminology/arbodat_rest_type/95b8a5b5-094f-4547-86ec-6915e14cc818");
        // glume
        restTypeMap.put("S", "http://uri.gbv.de/terminology/arbodat_rest_type/d379ea22-eeaa-4539-9508-bcf06ce1523f");
        // rachis segment
        restTypeMap.put("Spi", "http://uri.gbv.de/terminology/arbodat_rest_type/4f9964cd-d342-4d79-8b5e-7f6710448a53");
        // rachilla
        restTypeMap.put("Rac", "http://uri.gbv.de/terminology/arbodat_rest_type/17088eb8-73e5-48ae-b08d-2920d3962960");
        // awn fragment
        restTypeMap.put("Gr", "http://uri.gbv.de/terminology/arbodat_rest_type/74b7f48a-6534-4dfe-92f6-5a253d27be99");
        // spikelet undiff.
        restTypeMap.put("Äch", "http://uri.gbv.de/terminology/arbodat_rest_type/c306b564-ad43-4c45-8cc3-675738025a01");
        // spikelet (1-grained)
        restTypeMap.put("Äch1", "http://uri.gbv.de/terminology/arbodat_rest_type/44d5e68e-c8a2-4353-9e05-40189ab68ff2");
        // spikelet (2-grained)
        restTypeMap.put("Äch2", "http://uri.gbv.de/terminology/arbodat_rest_type/819c38bc-0b01-4508-b275-160f0bf51dc2");
        // ear/panicle
        restTypeMap.put("Ähre", "http://uri.gbv.de/terminology/arbodat_rest_type/e8e5df0b-7427-472a-b568-6a9f645be7b7");
        // base of the ear
        restTypeMap.put("Ärbas", "http://uri.gbv.de/terminology/arbodat_rest_type/8810a269-897d-49a8-bc26-73ba2fd06c7a");
        // sterile side spikelet
        restTypeMap.put("StSär", "http://uri.gbv.de/terminology/arbodat_rest_type/23584550-aa60-49e6-be50-549a182c1d94");
        // embryo/sprout
        restTypeMap.put("Em", "http://uri.gbv.de/terminology/arbodat_rest_type/59fc8ccb-3d57-486c-9881-e17fed9d8332");
        // hulled grain
        restTypeMap.put("Ksp", "http://uri.gbv.de/terminology/arbodat_rest_type/02bac0fb-146a-4467-a8bb-6b6a47d71d62");
        // seed/fruit
        restTypeMap.put("Sa/Fr", "http://uri.gbv.de/terminology/arbodat_rest_type/87f1c7d2-b4ea-483c-842b-c6328d33034a");
        // seed/fruit germinated
        restTypeMap.put("SaFrKeim", "http://uri.gbv.de/terminology/arbodat_rest_type/262fe4d0-cb9c-4be3-80f5-8660aa8cbfe5");
        // whole fruit
        restTypeMap.put("Fr", "http://uri.gbv.de/terminology/arbodat_rest_type/8436aba5-de33-488d-8d55-2504b9af567e");
        // whole plant
        restTypeMap.put("gPfl", "http://uri.gbv.de/terminology/arbodat_rest_type/760568c7-7289-42a6-ba61-56723800322a");
        // anther
        restTypeMap.put("Anth", "http://uri.gbv.de/terminology/arbodat_rest_type/30d8d860-1086-44a7-b9ae-e66460be9cce");
        // pollen/spores
        restTypeMap.put("Pol", "http://uri.gbv.de/terminology/arbodat_rest_type/782a707a-9fea-45c6-8de8-c7b2193c608c");
        // flower part/flower  (incl. perianth etc.)
        restTypeMap.put("Blü", "http://uri.gbv.de/terminology/arbodat_rest_type/60090137-edfd-44b5-b822-9d2d31c04aaa");
        // inflorescence
        restTypeMap.put("Blüst", "http://uri.gbv.de/terminology/arbodat_rest_type/5b26909a-e498-4cdb-89a6-de5f6c5fa53b");
        // infructescence
        restTypeMap.put("Frust", "http://uri.gbv.de/terminology/arbodat_rest_type/81c842c2-5c3d-47e8-a851-52033586a1b1");
        // fruit scale
        restTypeMap.put("Frschu", "http://uri.gbv.de/terminology/arbodat_rest_type/1fc4e097-834d-4e27-8e48-d646fc5ed401");
        // cupule
        restTypeMap.put("FrBe", "http://uri.gbv.de/terminology/arbodat_rest_type/0ab123eb-0074-4e4d-90b1-7a285163d156");
        // capsule
        restTypeMap.put("Kap", "http://uri.gbv.de/terminology/arbodat_rest_type/d099ea0a-bbcc-49d8-9d3c-c71e283af918");
        // capsule dent
        restTypeMap.put("Kapz", "http://uri.gbv.de/terminology/arbodat_rest_type/038f8a58-8a60-4ee4-8da8-23d3263fcd56");
        // seed leaf/cotyledon
        restTypeMap.put("Kot", "http://uri.gbv.de/terminology/arbodat_rest_type/d80ca6b3-f9c9-4b48-bffa-6142e319c58b");
        // pericarp/fragment of pericarp
        restTypeMap.put("Pekarp", "http://uri.gbv.de/terminology/arbodat_rest_type/d2718cfe-85fa-4dd6-9c0b-363130453790");
        // testa with/without hilum (Cerealia)
        restTypeMap.put("Te", "http://uri.gbv.de/terminology/arbodat_rest_type/33094365-4dcc-4217-8db6-5ecbcc0cd09f");
        // hilum (Fabaceae)
        restTypeMap.put("Hil", "http://uri.gbv.de/terminology/arbodat_rest_type/9e148c7d-2df5-4c6f-9348-bb1dab3ad7ae");
        // porridge/(flat) bread/pulp
        restTypeMap.put("BGF", "http://uri.gbv.de/terminology/arbodat_rest_type/480e544d-9115-406a-bc65-0d123460816c");
        // pulp
        restTypeMap.put("Frfl", "http://uri.gbv.de/terminology/arbodat_rest_type/88f760b9-eb53-4114-85d0-4ae69d318414");
        // porridge
        restTypeMap.put("Br", "http://uri.gbv.de/terminology/arbodat_rest_type/a550a47b-60bd-4ca9-8d0e-a59c37781384");
        // (flat) bread
        restTypeMap.put("Geb", "http://uri.gbv.de/terminology/arbodat_rest_type/f46ac8d5-1592-4fb9-926f-cdc64984a981");
        // stalk
        restTypeMap.put("Sti", "http://uri.gbv.de/terminology/arbodat_rest_type/e85413a0-9913-4cec-a835-b4bc8b3ab589");
        // cone/cone part
        restTypeMap.put("Za", "http://uri.gbv.de/terminology/arbodat_rest_type/9269d23f-4698-40f1-ae33-98e03ff469ad");
        // male cone
        restTypeMap.put("mZa", "http://uri.gbv.de/terminology/arbodat_rest_type/566d644c-75fc-48d6-833e-0e50282975ad");
        // female cone
        restTypeMap.put("wZa", "http://uri.gbv.de/terminology/arbodat_rest_type/f9ee9e86-288b-4ee6-9d99-359f52a0c972");
        // oogonium
        restTypeMap.put("Oog", "http://uri.gbv.de/terminology/arbodat_rest_type/dc1adf7c-5dac-478d-a816-eb54dca06c1c");
        // sporange
        restTypeMap.put("Spor", "http://uri.gbv.de/terminology/arbodat_rest_type/636e5523-2247-4f7d-b115-fe327dabc4f0");
        // fungus/sclerotium/parts
        restTypeMap.put("Pi", "http://uri.gbv.de/terminology/arbodat_rest_type/1e649f92-4914-47c1-931b-1a94ab1395f9");

    // Veg. Remains
        // culm node (cf. Cerealia)
        restTypeMap.put("Hano", "http://uri.gbv.de/terminology/arbodat_rest_type/625ea22c-e802-423d-941b-1639a5906cef");
        // culm (cf. Cerealia)
        restTypeMap.put("Hal", "http://uri.gbv.de/terminology/arbodat_rest_type/b1c38c6e-8a96-4b14-9779-4e3d78c150d7");
        // stem/culm fragment
        restTypeMap.put("Veget", "http://uri.gbv.de/terminology/arbodat_rest_type/b3cc2166-1373-4a3f-9a74-99c5ed79119d");
        // leaf/needle
        restTypeMap.put("Bl", "http://uri.gbv.de/terminology/arbodat_rest_type/7bac78da-5f3f-4aa5-837e-4580327afffa");
        // epidermis
        restTypeMap.put("Epid", "http://uri.gbv.de/terminology/arbodat_rest_type/afe4c005-4124-4931-9541-c566d87a62e7");
        // thorn/prickle
        restTypeMap.put("Do/St", "http://uri.gbv.de/terminology/arbodat_rest_type/df5f0563-8c64-4e3b-a99f-b25c5cfc240b");
        // basal part of plant: nodules, tubercles, bulbis, rhizomes, ...
        restTypeMap.put("boPf", "http://uri.gbv.de/terminology/arbodat_rest_type/e135cb06-5d80-4695-a376-0fae56af45ce");
        // bulb
        restTypeMap.put("Zwi", "http://uri.gbv.de/terminology/arbodat_rest_type/0220743f-4385-4b0d-8804-6461a7f2b57d");
        // rhizome
        restTypeMap.put("Rhi", "http://uri.gbv.de/terminology/arbodat_rest_type/e79636ab-d62f-4caf-9630-db267ddea509");
        // bud
        restTypeMap.put("Knos", "http://uri.gbv.de/terminology/arbodat_rest_type/8bb53a4c-394e-49b6-95e2-50109abf042a");
        // tendril
        restTypeMap.put("Ra", "http://uri.gbv.de/terminology/arbodat_rest_type/85d245ab-d3af-4636-82c8-79ffbfb1c551");
        // rhizome of fern
        restTypeMap.put("FaRhi", "http://uri.gbv.de/terminology/arbodat_rest_type/4bcf81c4-0e8c-40c0-bcd8-9ec4733de34b");
        // moss
        restTypeMap.put("Moo", "http://uri.gbv.de/terminology/arbodat_rest_type/ac9ad9d8-3d86-4416-abb4-db33753d02ae");

    // Wood
        // wood
        restTypeMap.put("Ho", "http://uri.gbv.de/terminology/arbodat_rest_type/d52c87de-ad20-4dd3-be08-925c30f39b08");
        // branch wood
        restTypeMap.put("A/Z", "http://uri.gbv.de/terminology/arbodat_rest_type/190abb23-7113-42f3-965c-3c514b0d4f7a");
        // stem wood
        restTypeMap.put("Sho", "http://uri.gbv.de/terminology/arbodat_rest_type/efedab17-1444-4ec6-afb6-852314417adb");
        // stem wood with bark
        restTypeMap.put("ShoRi", "http://uri.gbv.de/terminology/arbodat_rest_type/a33fbb04-df7b-4a0f-a6c6-9a0b0776930a");
        // processed wood
        restTypeMap.put("beHo", "http://uri.gbv.de/terminology/arbodat_rest_type/4231a3bb-39fe-4a6e-abae-296573de51b2");
        // root wood
        restTypeMap.put("Wu", "http://uri.gbv.de/terminology/arbodat_rest_type/3f72d8ae-366d-4b12-88be-bf40d1332e12");
        // tree stump
        restTypeMap.put("Bstum", "http://uri.gbv.de/terminology/arbodat_rest_type/27bab65a-702d-4cbb-b902-4b22cfb89ed2");
        // tree knot
        restTypeMap.put("Kntz", "http://uri.gbv.de/terminology/arbodat_rest_type/a2d29997-1d8f-441f-9bc0-1c4c5c7bb4c1");
        // twig/branchet
        restTypeMap.put("Zwei", "http://uri.gbv.de/terminology/arbodat_rest_type/90632002-90fe-4455-89b5-ebc5d53f2fc4");
        // bark/bast, phloem
        restTypeMap.put("Rin", "http://uri.gbv.de/terminology/arbodat_rest_type/1211cae8-bdf8-4059-b0cb-17b487624e22");

    // Others
        // gall
        restTypeMap.put("Gal", "http://uri.gbv.de/terminology/arbodat_rest_type/592d8afc-0a94-43ad-800a-57bcc111fc70");
        // phytolith
        restTypeMap.put("Phyt", "http://uri.gbv.de/terminology/arbodat_rest_type/17f67d30-9489-4656-bcb9-a569897d5114");
        // archaeology
        restTypeMap.put("Arch", "http://uri.gbv.de/terminology/arbodat_rest_type/4bcbaf2d-26da-4784-bb72-207c7c51687b");
        // fish remains
        restTypeMap.put("Fisch", "http://uri.gbv.de/terminology/arbodat_rest_type/8795e2b8-69f8-4082-96c3-f4941194eb9e");
        // horns/horn parts
        restTypeMap.put("Hornt", "http://uri.gbv.de/terminology/arbodat_rest_type/dc751548-043b-444a-a9d7-fd732e524879");
        // insects/arthropoda
        restTypeMap.put("Insek", "http://uri.gbv.de/terminology/arbodat_rest_type/41e0e5fc-f157-49a7-ac58-a7def1e8f819");
        // bones/teeth
        restTypeMap.put("Knoz", "http://uri.gbv.de/terminology/arbodat_rest_type/2cb1b147-ef2f-415d-a253-4c786edcdc17");
        // egg/eggshell
        restTypeMap.put("Ei", "http://uri.gbv.de/terminology/arbodat_rest_type/87c1070f-58e9-46f7-a750-90d400c716da");
        // coprolites
        restTypeMap.put("Kopr", "http://uri.gbv.de/terminology/arbodat_rest_type/3dd21315-be74-4c6f-ba2c-6b5d5f502caf");
        // leather
        restTypeMap.put("Leder", "http://uri.gbv.de/terminology/arbodat_rest_type/3f44f259-3ee4-4b52-9c09-025a7afeac44");
        // feather/quill
        restTypeMap.put("Fki", "http://uri.gbv.de/terminology/arbodat_rest_type/d0d20d2d-b5b9-4eb9-9f8e-af308e10e994");
        // hair/pelt/fur
        restTypeMap.put("HFP", "http://uri.gbv.de/terminology/arbodat_rest_type/7a1170ca-a614-49ed-a932-a379e03ca67b");
        // mollusca
        restTypeMap.put("Moll", "http://uri.gbv.de/terminology/arbodat_rest_type/f0f7dc1b-f5c5-4aed-884e-6129e8927706");
        // ostracode
        restTypeMap.put("Ostra", "http://uri.gbv.de/terminology/arbodat_rest_type/2a11bbc3-9aa8-46f1-afcd-909a2c629f76");
        // crustacea
        restTypeMap.put("Crust", "http://uri.gbv.de/terminology/arbodat_rest_type/94aaf0b6-45f9-4107-bee8-69468ba8c60d");
        // cladocera
        restTypeMap.put("Clad", "http://uri.gbv.de/terminology/arbodat_rest_type/32fb9782-ca01-49ab-8da4-b1ef9e89a0ff");
        // foraminifera
        restTypeMap.put("For", "http://uri.gbv.de/terminology/arbodat_rest_type/b0511b68-0693-4d3b-840c-ed0886869757");
        // statoliths/otoliths
        restTypeMap.put("Sta", "http://uri.gbv.de/terminology/arbodat_rest_type/ae521c2d-152e-4173-a3d6-39893c71b981");
        // textiles
        restTypeMap.put("Text", "http://uri.gbv.de/terminology/arbodat_rest_type/7267a591-d7b2-4182-8b83-dbc7205b9aaf");
        // geological particularities/minerals
        restTypeMap.put("Geo", "http://uri.gbv.de/terminology/arbodat_rest_type/07270f5d-36ff-494d-a39c-5518534cbf51");

    // ArboDat+_restType
        // other
        restTypeMap.put("sonst", "ArboDat+_restType_unknown");
        // not chosen
        restTypeMap.put("-99", "ArboDat+_restType_notChosen");
    }

    public String getUri(String key) {
        return restTypeMap.get(key);
    }
}
