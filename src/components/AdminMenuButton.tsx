"use client";

export default function AdminMenuButton() {
  function toggleMenu() {
    window.dispatchEvent(new Event("admin-nav:toggle"));
  }
  return (
    <button
      onClick={toggleMenu}
      className="lg:hidden p-2 rounded border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5"
      aria-label="Menüyü Aç/Kapat"
      title="Menü"
    >
      <span className="block w-6 h-0.5 bg-black dark:bg-white mb-1"></span>
      <span className="block w-6 h-0.5 bg-black dark:bg-white mb-1"></span>
      <span className="block w-6 h-0.5 bg-black dark:bg-white"></span>
    </button>
  );
}


