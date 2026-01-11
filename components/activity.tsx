import GitHubChart from "./github-chart";

const Activity = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-dotted border-muted pb-2">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          02 // Activity
        </h2>
      </div>
      <GitHubChart />
    </div>
  );
};

export default Activity;
