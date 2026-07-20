export default function BookingLoading() {
  return (
    <main className="pt-24 pb-stack-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto min-h-screen animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-10 w-48 bg-surface-container-high rounded" />
          <div className="h-64 bg-surface-container-high rounded-xl" />
        </div>
        <div className="h-48 bg-surface-container-high rounded-xl" />
      </div>
    </main>
  );
}
