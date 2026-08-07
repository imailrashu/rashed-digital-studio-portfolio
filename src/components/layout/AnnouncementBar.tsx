import { siteConfig } from "../../data/siteConfig";

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <span className="availability-dot" aria-hidden="true" />

      <span>{siteConfig.availability}</span>

      <span className="announcement-separator" aria-hidden="true">
        /
      </span>

      <span>India · Worldwide</span>
    </div>
  );
}
