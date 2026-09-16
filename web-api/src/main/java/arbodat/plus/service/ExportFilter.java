package arbodat.plus.service;

import java.util.*;

public final class ExportFilter {

    public enum Level { NONE, RESEARCH_PROJECT, SITE, FEATURE, SAMPLE }

    private final Level level;
    private final List<UUID> ids;

    private ExportFilter(Level level, List<UUID> ids) {
        this.level = level;
        this.ids = ids;
    }

    public static ExportFilter of(
        List<UUID> researchProjects,
        List<UUID> sites,
        List<UUID> features,
        List<UUID> samples
    ) {

        List<Map.Entry<Level, List<UUID>>> provided = new ArrayList<>();
        if (isNotEmpty(researchProjects)) provided.add(Map.entry(Level.RESEARCH_PROJECT, researchProjects));
        if (isNotEmpty(sites))            provided.add(Map.entry(Level.SITE, sites));
        if (isNotEmpty(features))         provided.add(Map.entry(Level.FEATURE, features));
        if (isNotEmpty(samples))          provided.add(Map.entry(Level.SAMPLE, samples));

        if (provided.size() > 1) {
            throw new IllegalArgumentException(
                    "Only ONE filter may be set at a time: " +
                            "research_projects, sites, features OR samples.");
        }
        if (provided.isEmpty()) {
            return new ExportFilter(Level.NONE, List.of());
        }
        var entry = provided.get(0);
        return new ExportFilter(entry.getKey(), entry.getValue());
    }

    private static boolean isNotEmpty(List<UUID> list) {
        return list != null && !list.isEmpty();
    }

    public Level level() { return level; }
    public List<UUID> ids() { return ids; }
}