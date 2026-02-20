import React, { useState, useEffect } from "react";
import { logger } from "../utils/logger";
import {
  Download,
  Upload,
  Trash2,
  Save,
  Shield,
  FileText,
  UserX,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  useSettings,
  useUpdateSettings,
  useMedias,
  useReviews,
  useMilestones,
} from "../hooks/queries";
import { UserSettings } from "../types";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useI18n } from "../i18n";

// Services for deletion
import { getMedias, deleteMedia } from "../services/mediaService";
import { getReviews, deleteReview } from "../services/reviewService";
import { getMilestones, deleteMilestone } from "../services/milestoneService";

const defaultSettings: UserSettings = {
  favorites: { characters: [], games: [], movies: [] },
  defaultLibrarySort: "updatedAt",
  theme: "dark",
  language: "pt"
};

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const { data: settingsData } = useSettings(user?.uid);
  const updateSettingsMutation = useUpdateSettings();

  // For export (keep hooks)
  const { data: mediaItems = [] } = useMedias(user?.uid);
  const { data: reviews = [] } = useReviews(user?.uid);
  const { data: milestones = [] } = useMilestones(user?.uid);

  const [localSettings, setLocalSettings] =
    useState<UserSettings>(defaultSettings);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (settingsData) {
      setLocalSettings(prev => ({ ...prev, ...settingsData }));
    }
  }, [settingsData]);

  const handleSave = async () => {
    if (!user?.uid) {
      logger.error("Usuário não autenticado");
      return;
    }

    logger.log("💾 Salvando configurações:", localSettings);
    try {
      await updateSettingsMutation.mutateAsync({
        userId: user.uid,
        settings: localSettings,
      });
      showSuccess(t("settings.toast.saved"), t("settings.toast.saved_desc"));
    } catch (error) {
      showError(t("settings.toast.error"), t("settings.toast.error_desc"));
    }
  };

  const handleExport = () => {
    const data = {
      settings: localSettings,
      mediaItems,
      reviews,
      milestones,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nerdlog-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSuccess(t("settings.toast.exported"), t("settings.toast.backup_started"));
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) {
          setLocalSettings(prev => ({ ...prev, ...data.settings }));
          showSuccess(t("settings.toast.imported"), t("settings.toast.config_loaded"));
        } else {
          showError(t("settings.toast.invalid_file"), t("settings.toast.invalid_file_desc"));
        }
      } catch (error) {
        showError(t("settings.toast.import_error"), t("settings.toast.import_error_desc"));
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAllData = async () => {
    if (!user?.uid) return;

    const confirmMessage = `🚨 ${t("settings.danger.confirm_question")} 🚨\n\n${t("settings.danger.desc")}`;

    if (!confirm(confirmMessage)) return;

    const keyword = t("settings.danger.confirm_delete_keyword");
    const finalConfirm = t("settings.danger.confirm_delete_instruction", { keyword });
    const userInput = prompt(finalConfirm);

    if (userInput !== keyword) {
      alert(t("settings.danger.action_cancelled"));
      return;
    }

    setIsDeleting(true);

    try {
      // Fetch fresh IDs to ensure we delete everything on server
      const [serverMedias, serverReviews, serverMilestones] = await Promise.all([
        getMedias(user.uid),
        getReviews(user.uid),
        getMilestones(user.uid)
      ]);

      const deletePromises: Promise<any>[] = [];

      // Delete Medias
      serverMedias.forEach(m => deletePromises.push(deleteMedia(m.id).catch(e => console.error(e))));
      // Delete Reviews
      serverReviews.forEach(r => deletePromises.push(deleteReview(r.id).catch(e => console.error(e))));
      // Delete Milestones
      serverMilestones.forEach(m => deletePromises.push(deleteMilestone(m.id).catch(e => console.error(e))));

      await Promise.all(deletePromises);

      // Reset Settings
      await updateSettingsMutation.mutateAsync({
        userId: user.uid,
        settings: defaultSettings,
      });

      showSuccess(t("settings.toast.data_wiped"), t("settings.toast.data_wiped_desc"));
      // Reload to refresh all queries / disconnect valid states
      window.location.reload();

    } catch (error) {
      console.error("Critical error wiping data", error);
      showError(t("settings.toast.critical_error"), t("settings.toast.critical_error_desc"));
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{t("settings.title")}</h1>
        <p className="text-slate-400">{t("settings.subtitle")}</p>
      </div>

      {/* Data Management */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-6">{t("settings.title")}</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {t("settings.sort_label")}
          </label>
          <select
            value={localSettings.defaultLibrarySort}
            onChange={(e) =>
              setLocalSettings((prev) => ({
                ...prev,
                defaultLibrarySort: e.target.value,
              }))
            }
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="updatedAt">{t("settings.sort.updated")}</option>
            <option value="title">{t("settings.sort.az")}</option>
            <option value="rating">{t("settings.sort.rating")}</option>
            <option value="hoursSpent">{t("settings.sort.hours")}</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <h3 className="font-medium text-white mb-2 flex items-center gap-2">
              <Download className="text-green-400" size={18} />
              {t("settings.export.title")}
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              {t("settings.export.desc")}
            </p>
            <button
              onClick={handleExport}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {t("settings.export.button")}
            </button>
          </div>

          {/* Import */}
          <div className="p-4 bg-slate-800/30 rounded-lg">
            <h3 className="font-medium text-white mb-2 flex items-center gap-2">
              <Upload className="text-blue-400" size={18} />
              {t("settings.import.title")}
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              {t("settings.import.desc")}
            </p>
            <label className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer text-center">
              {t("settings.import.button")}
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Delete All Data */}
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <h3 className="font-medium text-red-400 mb-2 flex items-center gap-2">
            <Trash2 size={18} />
            {t("settings.danger.title")}
          </h3>
          <p className="text-slate-300 text-sm mb-4">
            {t("settings.danger.desc")}
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {t("settings.danger.delete_all")}
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-red-400 text-sm font-medium">
                {t("settings.danger.confirm_question")}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAllData}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                  {isDeleting ? "Excluindo..." : t("settings.danger.confirm_yes")}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {t("actions.cancel")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legal and Privacy */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Shield className="text-blue-400" size={20} />
          {t("settings.legal.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Privacy Policy */}
          <div className="p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
            <h3 className="font-medium text-white mb-2 flex items-center gap-2">
              <FileText className="text-blue-400" size={18} />
              {t("settings.legal.privacy")}
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              {t("settings.legal.privacy_desc")}
            </p>
            <button
              onClick={() => navigate("/privacy-policy")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {t("settings.legal.privacy_button")}
            </button>
          </div>

          {/* Account Deletion */}
          <div className="p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
            <h3 className="font-medium text-white mb-2 flex items-center gap-2">
              <UserX className="text-red-400" size={18} />
              {t("settings.legal.delete_account")}
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              {t("settings.legal.delete_account_desc")}
            </p>
            <button
              onClick={() => navigate("/account-deletion")}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {t("settings.legal.delete_account_button")}
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm">
            <strong>{t("settings.legal.rights")}</strong>
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center gap-2"
        >
          <Save size={18} />
          {t("actions.save")}
        </button>
      </div>
    </div>
  );
};
export default Settings;
