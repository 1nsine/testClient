import { useMemo, useState } from "react";
import styles from "./AdminPanel.module.css";
import { DashBoard } from "./DashBoard/DashBoard";
import { SideBar } from "./SideBar/SideBar";

const sections = [
  { id: "overview", label: "Обзор" },
  { id: "users", label: "Пользователи" },
  { id: "questions", label: "Вопросы" },
  { id: "reviews", label: "Отзывы" },
  { id: "feedback", label: "Жалобы" },
];

export function AdminPanel() {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [sectionBadges, setSectionBadges] = useState<
    Partial<Record<string, number>>
  >({});

  const navigationItems = useMemo(
    () =>
      sections.map((section) => ({
        ...section,
        active: section.id === activeSection,
        badgeCount: sectionBadges[section.id] ?? 0,
      })),
    [activeSection, sectionBadges],
  );

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <main className={styles.panel}>
      <SideBar items={navigationItems} onSelect={handleSelectSection} />
      <DashBoard
        activeSection={activeSection}
        onSectionChange={handleSelectSection}
        onSectionBadgesChange={setSectionBadges}
      />
    </main>
  );
}
