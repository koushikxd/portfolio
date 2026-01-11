export default function GitHubChart() {
  return (
    <section>
      <p className="text-xs sm:text-sm mb-2 sm:mb-3 text-muted-foreground">
        <span className="font-medium text-foreground">Contributions</span>{" "}
        @koushikxd
      </p>
      <img
        src={`https://ghchart.rshah.org/ededed/koushikxd`}
        alt="GitHub Contributions"
        className="w-full rounded-lg invert(1) hue-rotate(180deg)"
      />
    </section>
  );
}
