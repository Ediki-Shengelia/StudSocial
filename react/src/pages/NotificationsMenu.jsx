import React, { useEffect, useState } from "react";
import { notificationsApi } from "../posts/notifications";
import { useNavigate } from "react-router-dom";
import { path } from "../routes/path"; // 👈 ADD THIS
const NotificationsMenu = () => {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await notificationsApi.listNot();
      setUnread(res.data.unread || []);
      setUnreadCount(res.data.unread_count || 0);
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id) {
    try {
      await notificationsApi.markRead(id);
      setUnread((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to mark as read");
    }
  }

  async function markAllRead() {
    try {
      await notificationsApi.markAllRead();
      setUnread([]);
      setUnreadCount(0);
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed to mark all as read");
    }
  }
  async function openPost(notification) {
    try {
      await notificationsApi.markRead(notification.id);

      setUnread((prev) => prev.filter((n) => n.id !== notification.id));

      setUnreadCount((c) => Math.max(0, c - 1));
      setOpen(false);

      if (notification.data?.post_id) {
        navigate(path.show.replace(":id", notification.data.post_id));
      }
    } catch (error) {
      setErr(error?.response?.data?.message || "Failed");
    }
  }
  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10 transition"
        aria-label="Notifications"
      >
        <span className="text-lg">🔔</span>

        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-[11px] leading-[18px] text-white text-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-96 rounded-2xl border border-white/10 bg-zinc-950/95 backdrop-blur shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div>
              <p className="font-semibold text-zinc-100">Notifications</p>
              <p className="text-xs text-zinc-400">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up 🎉"}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={load}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 transition"
              >
                Refresh
              </button>

              <button
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Read all
              </button>
            </div>
          </div>

          {/* Error */}
          {err && (
            <div className="px-4 py-2 text-sm text-red-200 bg-red-500/10 border-b border-red-500/20">
              {err}
            </div>
          )}

          {/* Body */}
          <div className="max-h-[420px] overflow-auto">
            {loading ? (
              <div className="px-4 py-6 text-sm text-zinc-400">
                Loading notifications…
              </div>
            ) : unread.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="mx-auto mb-3 h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <span>✅</span>
                </div>
                <p className="text-sm text-zinc-200">No unread notifications</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Likes and comments will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {unread.map((n) => (
                  <div
                    key={n.id}
                    className="px-4 py-3 hover:bg-white/5 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-9 w-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-300">
                        ♥
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-zinc-100">
                          {n.message || "Notification"}
                        </p>
                        <div className="mt-2 flex items-center gap-3">
                          {n?.post_id && (
                            <button
                              onClick={() => {
                                markRead(n.id);
                                setOpen(false);
                                navigate(
                                  `/posts/show/${n.post_id}`,
                                );
                              }}
                              className="text-xs cursor-pointer text-emerald-300 underline"
                            >
                              Open post
                            </button>
                          )}

                          <button
                            onClick={() => markRead(n.id)}
                            className="text-xs px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 transition"
                          >
                            Mark read
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/10 text-xs text-zinc-500">
            Tip: click “Open post” to mark as read.
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsMenu;
