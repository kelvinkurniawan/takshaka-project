import SettingsManager from "@/app/components/dashboard/settings/SettingsManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure application settings and preferences",
};

export default function SettingsPage() {
  return (
    <>
      <SettingsManager />
    </>
  );
}
