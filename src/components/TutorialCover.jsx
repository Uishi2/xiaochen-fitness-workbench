export default function TutorialCover({ tutorial, compact = false }) {
  return (
    <div className={`tutorial-cover cover-${tutorial.theme} ${compact ? "compact" : ""}`}>
      <span className="cover-orbit orbit-one" />
      <span className="cover-orbit orbit-two" />
      <span className="cover-figure" aria-hidden="true">
        <span />
      </span>
      <span className="cover-duration">{tutorial.duration} MIN</span>
      <span className="cover-title">{tutorial.title}</span>
      <span className="cover-subtitle">{tutorial.subtitle}</span>
    </div>
  );
}
