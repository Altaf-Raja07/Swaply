export default function SessionLoading() {
  return (
    <main className="pt-24 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen animate-pulse">
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 bg-surface-container-high rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-surface-container-high rounded-xl" />
          <div className="h-48 bg-surface-container-high rounded-xl" />
        </div>
      </div>
    </main>
  );
}
