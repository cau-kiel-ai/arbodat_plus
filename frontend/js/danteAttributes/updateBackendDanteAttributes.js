
const danteAttributesJSON = {};

async function updateBackendDanteAttributes() {

    let cachedData = [];

    const attributes = ["license",                                                                    // research project
                        "taxonomy", "siteType", "naturalUnit",                                        // site
                        "featureType", "preservationCondition",                                       // feature
                        "chronozone", "sampleType", "sampleInvestigated",                             // sample
                        "datingMethod",                                                               // absolute dating
                        "ArboDat_PCODE", "classificationConfer", "restType", "stateOfPreservation"];  // result

    const ArboDat_PCODE_URI = "http://uri.gbv.de/terminology/arbodat_taxonomy/6ac2cb7f-fed7-445d-bd8c-4c8cadec2303"

    for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i];

        // Fetch dante attributes -------------------------------------------------------
        if (attribute == "ArboDat_PCODE") {
            await fetchDanteTaxCodes(ArboDat_PCODE_URI);
        } else {
            await fetchDanteAttribute(attribute);
        }        
        
        // Get cachedData ---------------------------------------------------------------
        // extra handling :cachedTaxCodesForURI = new Map(); //   Key       value
                                                             // {"uri" => [taxCodes]}
        switch (attribute) {
    
            // researchProject --------------------------
            case ("license"):
                cachedData = cachedLicenses;
                break;

            // site -------------------------------------
            case "taxonomy":
                cachedData = cachedTaxonomies;
                break;

            case ("siteType"):
                cachedData = cachedSiteTypes;
                break;
    
            case "naturalUnit":
                cachedData = cachedNaturalUnits;
                break;
    
            // coordinate -------------------------------
            case "coordinateSystem":
                cachedData = cachedCoordinateSystems;
                break;
    
            // feature --------------------------------------
            case ("featureType"):
                cachedData = cachedFeatureTypes;
                break;
    
            case ("preservationCondition"):
                cachedData = cachedPreservationConditions;
                break;
    
            // sample ---------------------------------------
            case ("sampleType"):
                cachedData = cachedSampleTypes;
                break;
    
            case ("chronozone"):
                cachedData = cachedChronozones;
                break;
    
            case ("sampleInvestigated"):
                cachedData = cachedSampleInvestigated;
                break;
    
            // absoluteDating -------------------------------    
            case ("datingMethod"):
                cachedData = cachedDatingMethods;
                break;
    
            // result ---------------------------------------
            case ("stateOfPreservation"):            
                cachedData = cachedStateOfPreservation;
                break;
    
            case ("restType"):
                cachedData = cachedRestTypes;
                break;
    
            case ("classificationConfer"):
                cachedData = cachedClassificationConfers;
                break;
            
            // TaxCodes for 'ArboDat_PCODE' taxonomy
            case "ArboDat_PCODE":
                cachedData = cachedTaxCodesForURI.get(ArboDat_PCODE_URI);
                break;                    
            // ----------------------------------------------
                        
            default:
                console.error("Unknown attribute");
                return;
        }        
        
        // create JSON-Arrays -----------------------------------------------------------
        const attributeList = [];        
        let isNarrower = false;

        for (let i = 0; i < cachedData.length; i++) {
            const item = cachedData[i];

            // If guideTerm ("restType")
            if (attribute !== "taxonomy" && item.type.includes("http://vocab.getty.edu/ontology#GuideTerm")) {
                isNarrower = true;
                iterateNarrower(item.prefLabel.en, item.narrower, attribute);
                continue;
            }

            switch (attribute) {

                case "ArboDat_PCODE":
                    newEntry = {
                        id:       item.uri,
                        label:    item.notation[0],
                        taxonomy: "ArboDat PCODE"
                    };                    
                    break;

                case "naturalUnit":
                    newEntry = {
                        id:    item.uri,
                        label: item.prefLabel.zxx,
                        naturalMainGroup: Array.isArray(item.ancestors)
                                          ? (item.ancestors.length > 1
                                             ? item.ancestors[0]?.prefLabel.de
                                             : (item.ancestors[0]?.prefLabel.de ?? item.ancestors[0]?.prefLabel.en)
                                            )
                                          : null
                    };
                    break;
            
                default:
                    newEntry = {
                        id:    item.uri,
                        label: item.prefLabel.en
                    };                    
                    break;
            }            
    
            attributeList.push(newEntry);
        } // ----------------------------------------------

        if (!isNarrower) {
            danteAttributesJSON[attribute] = attributeList;
        }
    }

    // POST -----------------------------------------------------------------------------
    try {        
        await axios.post("http://localhost:8080/dante_attributes", danteAttributesJSON);

    } catch (error) {
        console.error('Error during post dante attributes: ', error);
    }
}

function iterateNarrower(structuralConcept, narrower, attribute) {

    // Termination condition
    if (!narrower || narrower.length === 0) {
        return;
    }
    
    // create JSON-Arrays for narrower ----------------
    const attributeList = [];
    for (let i = 0; i < narrower.length; i++) {
        newEntry = {
            id:                narrower[i].uri,
            label:             narrower[i].prefLabel.en,
            structuralConcept: structuralConcept
        };            

        attributeList.push(newEntry);
    } // ----------------------------------------------
    if (!Array.isArray(danteAttributesJSON[attribute])) {
        danteAttributesJSON[attribute] = [];
    }
    danteAttributesJSON[attribute].push(...attributeList);
}