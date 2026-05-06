export default function GitHubChart() {
  return (
    <section>
      <p className="text-xs sm:text-sm mb-2 sm:mb-3 text-muted-foreground">
        <span className="font-medium text-foreground">Contributions</span>{" "}
        @koushikxd
      </p>
      {/* biome-ignore lint/performance/noImgElement: dynamic SVG from external host; next/image would require remote domain config for negligible benefit */}
      <img
        src={`https://ghchart.rshah.org/ededed/koushikxd`}
        alt="GitHub Contributions"
        className="w-full rounded-lg invert(1) hue-rotate(180deg)"
      />
    </section>
  );
}
