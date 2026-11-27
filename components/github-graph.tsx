import {
  type Contribution,
  ContributionGraph,
} from "@/components/contribution-graph";
import { Section } from "@/components/section";
import { HANDLES } from "@/lib/data";

const CONTRIBUTIONS_URL = `https://github-contributions-api.jogruber.de/v4/${HANDLES.github}?y=last`;

type ContributionsResponse = {
  total: { lastYear: number };
  contributions: Contribution[];
};

function isContributionsResponse(data: unknown): data is ContributionsResponse {
  if (typeof data !== "object" || data === null) return false;
  const { total, contributions } = data as Record<string, unknown>;
  return (
    typeof total === "object" &&
    total !== null &&
    typeof (total as Record<string, unknown>).lastYear === "number" &&
    Array.isArray(contributions)
  );
}

export async function getContributions(): Promise<ContributionsResponse | null> {
  try {
    const res = await fetch(CONTRIBUTIONS_URL, {
      next: { revalidate: 60 * 60 * 12 },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    return isContributionsResponse(data) ? data : null;
  } catch {
    return null;
  }
}

export const GRAPH_STEPS = 2;

export function GithubGraph({
  step,
  data,
}: {
  step: number;
  data: ContributionsResponse;
}) {
  return (
    <Section title="GitHub" step={step}>
      <ContributionGraph
        step={step + 1}
        contributions={data.contributions}
        total={data.total.lastYear}
      />
    </Section>
  );
}
